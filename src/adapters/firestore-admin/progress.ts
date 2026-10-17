import { FieldValue } from "firebase-admin/firestore";
import { fsPath, getAdminDb } from "@/adapters/firestore-admin/admin-app";
import {
  getProjectProgressMap,
  getUserProgress,
  readAssessmentMap,
} from "@/adapters/firestore-admin/queries";
import { addAchievementIfNotExists, addAchievementsIfNotExists, deleteAchievementsByLevel } from "@/adapters/firestore-admin/achievements";
import { syncStreak } from "@/adapters/firestore-admin/streak-commands";
import { levels } from "@/data/levels";
import { categories } from "@/data/categories";
import { skills } from "@/data/skills";
import {
  calcCategoryScore,
  calcTotalScore,
} from "@/core/domain/scoring";
import {
  getCategoryMaxScore,
  getLevelMinScore,
  LEVEL_UP_THRESHOLD,
} from "@/core/domain/weights";
import { evaluateAchievements } from "@/core/domain/achievement-conditions";
import {
  userAssessmentPath,
  userProgressPath,
  userProjectPath,
  userProjectsPath,
} from "@/adapters/firestore-client/paths";
import type { UserProgress } from "@/types";

export interface LevelUpResult {
  fromLevel: string;
  toLevel: string;
  score: number;
}

async function updateUserProgress(uid: string, data: Partial<UserProgress>) {
  const ref = getAdminDb().doc(fsPath(userProgressPath(uid)));
  const snap = await ref.get();
  if (snap.exists) {
    await ref.update({ ...data, updatedAt: FieldValue.serverTimestamp() });
    return;
  }
  const current = snap.data() as Partial<UserProgress> | undefined;
  await ref.set({
    currentLevelId: current?.currentLevelId ?? "junior",
    unlockedLevelIds: current?.unlockedLevelIds ?? ["junior"],
    totalScore: current?.totalScore ?? 0,
    ...data,
  });
}

export async function recalculate(uid: string): Promise<number> {
  const assessmentMap = await readAssessmentMap(uid);
  const totalScore = calcTotalScore(assessmentMap);

  const { totalScore: stored } = await getUserProgress(uid);
  if (stored !== totalScore) {
    await updateUserProgress(uid, { totalScore });
  }

  const awards = evaluateAchievements(assessmentMap);
  await addAchievementsIfNotExists(uid, awards);

  return totalScore;
}

export async function checkLevelUp(uid: string): Promise<LevelUpResult | null> {
  const userProgress = await getUserProgress(uid);

  const currentLevelId = userProgress.currentLevelId || levels[0].id;
  const currentIndex = levels.findIndex((l) => l.id === currentLevelId);
  if (currentIndex >= levels.length - 1) return null;

  const nextLevel = levels[currentIndex + 1];
  const assessmentMap = await readAssessmentMap(uid);

  const currentCategories = categories.filter((c) => c.levelId === currentLevelId);
  for (const cat of currentCategories) {
    const catXp = calcCategoryScore(cat.id, assessmentMap);
    if (catXp < getCategoryMaxScore(cat.id) * LEVEL_UP_THRESHOLD) return null;
  }

  const totalScore = calcTotalScore(assessmentMap);
  if (totalScore < getLevelMinScore(nextLevel.id)) return null;

  const requiredSkills = skills.filter(
    (s) =>
      categories.some(
        (c) => c.id === s.categoryId && c.levelId === nextLevel.id,
      ) && s.requiredForLevelUp,
  );

  if (requiredSkills.length > 0) {
    const allRequiredScored = requiredSkills.every(
      (s) => (assessmentMap[s.id]?.score || 0) >= 1,
    );
    if (!allRequiredScored) return null;
  }

  if (nextLevel.requiredProjectCount > 0) {
    const projectMap = await getProjectProgressMap(uid);
    const completedCount = Object.values(projectMap).filter(Boolean).length;
    if (completedCount < nextLevel.requiredProjectCount) return null;
  }

  const unlockedIds = [
    ...(userProgress.unlockedLevelIds || []),
    nextLevel.id,
    currentLevelId,
  ];

  await updateUserProgress(uid, {
    currentLevelId: nextLevel.id,
    unlockedLevelIds: [...new Set(unlockedIds)],
    totalScore,
  });

  await addAchievementIfNotExists(uid, "level_up", {
    from_level: levels[currentIndex].name,
    to_level: nextLevel.name,
    score: totalScore,
  });

  return {
    fromLevel: levels[currentIndex].name,
    toLevel: nextLevel.name,
    score: totalScore,
  };
}

export async function resetLevelProgress(uid: string, levelId: string) {
  const db = getAdminDb();

  const levelSkillIds = skills
    .filter((s) => {
      const cat = categories.find((c) => c.id === s.categoryId);
      return cat?.levelId === levelId;
    })
    .map((s) => s.id);

  const levelProjectIds = (
    await db.collection(fsPath(userProjectsPath(uid))).get()
  ).docs
    .filter((d) => d.data().levelId === levelId)
    .map((d) => d.id);

  const batch = db.batch();
  let pending = 0;

  for (const skillId of levelSkillIds) {
    batch.delete(db.doc(fsPath(userAssessmentPath(uid, skillId))));
    pending += 1;
  }
  for (const projectId of levelProjectIds) {
    batch.delete(db.doc(fsPath(userProjectPath(uid, projectId))));
    pending += 1;
  }

  if (pending > 0) await batch.commit();

  await deleteAchievementsByLevel(uid, levelId);

  const assessmentMap = await readAssessmentMap(uid);
  await updateUserProgress(uid, { totalScore: calcTotalScore(assessmentMap) });
}

export async function setProjectCompletion(
  uid: string,
  projectId: string,
  completed: boolean,
) {
  const ref = getAdminDb().doc(fsPath(userProjectPath(uid, projectId)));
  await ref.set(
    {
      completed,
      completedAt: completed ? FieldValue.serverTimestamp() : null,
    },
    { merge: true },
  );

  if (completed) {
    await syncStreak(uid);
  }
}
