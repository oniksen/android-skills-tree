"use client";

import { auth, db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { levels } from "@/data/levels";
import { categories } from "@/data/categories";
import { skills } from "@/data/skills";
import { syncStreak } from "@/lib/streak";
import { calcCategoryScore, calcSkillScore, calcTotalScore } from "@/lib/scoring";
import {
  getCategoryMaxScore,
  getLevelMinScore,
  LEVEL_UP_THRESHOLD,
} from "@/lib/weights";
import {
  addAchievementIfNotExists,
  addAchievementsIfNotExists,
  deleteAchievementsByLevel,
} from "@/lib/firestore";
import {
  evaluateAchievements,
  type AssessmentMap,
} from "@/lib/achievement-conditions";

function getUid(): string {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  return user.uid;
}

export async function getAssessmentMap(uid: string): Promise<Record<string, { score: number; subtopics?: Record<string, boolean> }>> {
  const assessmentsRef = collection(db, "users", uid, "assessments");
  const snap = await getDocs(assessmentsRef);
  const map: Record<string, { score: number; subtopics?: Record<string, boolean> }> = {};
  snap.forEach((d) => {
    const data = d.data();
    const subtopics = data.subtopics;
    const score = subtopics ? calcSkillScore(d.id, subtopics) : (data.score || 0);
    map[d.id] = { score, subtopics };
  });
  return map;
}

async function getUserProgress(uid: string) {
  const progressRef = doc(db, "users", uid, "progress", "current");
  const snap = await getDoc(progressRef);
  if (!snap.exists()) {
    const defaultProgress = {
      currentLevelId: "junior",
      unlockedLevelIds: ["junior"],
      totalScore: 0,
    };
    await setDoc(progressRef, defaultProgress);
    return defaultProgress;
  }
  return snap.data();
}

async function updateUserProgress(
  uid: string,
  data: Record<string, unknown>,
) {
  const progressRef = doc(db, "users", uid, "progress", "current");
  const snap = await getDoc(progressRef);
  if (snap.exists()) {
    await updateDoc(progressRef, data);
  } else {
    await setDoc(progressRef, {
      currentLevelId: "junior",
      unlockedLevelIds: ["junior"],
      totalScore: 0,
      ...data,
    });
  }
}

async function getProjectProgressMap(
  uid: string,
): Promise<Record<string, boolean>> {
  const projectsRef = collection(db, "users", uid, "projects");
  const snap = await getDocs(projectsRef);
  const map: Record<string, boolean> = {};
  snap.forEach((d) => {
    map[d.id] = d.data().completed;
  });
  return map;
}

type PreloadedAssessments = AssessmentMap | Promise<AssessmentMap>;

export async function backfillTotalScore(
  uid: string,
  preloadedMap?: PreloadedAssessments,
): Promise<number> {
  const assessmentMap = await (preloadedMap ?? getAssessmentMap(uid));
  const totalScore = calcTotalScore(assessmentMap);

  const progressRef = doc(db, "users", uid, "progress", "current");
  const snap = await getDoc(progressRef);
  const stored = snap.exists() ? snap.data()?.totalScore : undefined;

  if (snap.exists() && stored === totalScore) return totalScore;

  await updateUserProgress(uid, { totalScore });
  return totalScore;
}

export async function checkAchievements(
  uid: string,
  preloadedMap?: PreloadedAssessments,
) {
  const assessmentMap = await (preloadedMap ?? getAssessmentMap(uid));
  const awards = evaluateAchievements(assessmentMap);
  await addAchievementsIfNotExists(uid, awards);
  return awards;
}

export async function checkLevelUp() {
  const uid = getUid();

  const userProgress = await getUserProgress(uid);
  if (!userProgress) return null;

  const currentLevelId = userProgress.currentLevelId || levels[0].id;
  const currentIndex = levels.findIndex((l) => l.id === currentLevelId);
  if (currentIndex >= levels.length - 1) return null;

  const nextLevel = levels[currentIndex + 1];
  const assessmentMap = await getAssessmentMap(uid);

  const currentCategories = categories.filter(
    (c) => c.levelId === currentLevelId,
  );
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

export async function toggleProjectCompletion(
  projectId: string,
  completed: boolean,
) {
  const uid = getUid();
  const projectRef = doc(db, "users", uid, "projects", projectId);
  await setDoc(projectRef, {
    completed,
    completedAt: completed ? new Date() : null,
  });

  if (completed) {
    void syncStreak();
  }
}

export async function resetLevelProgress(levelId: string) {
  const uid = getUid();

  const levelSkillIds = skills
    .filter((s) => {
      const cat = categories.find((c) => c.id === s.categoryId);
      return cat?.levelId === levelId;
    })
    .map((s) => s.id);

  for (const skillId of levelSkillIds) {
    const assessmentRef = doc(db, "users", uid, "assessments", skillId);
    await deleteDoc(assessmentRef);
  }

  const levelProjectIds = (
    await getDocs(collection(db, "users", uid, "projects"))
  ).docs
    .filter((d) => {
      const data = d.data();
      return data.levelId === levelId;
    })
    .map((d) => d.id);

  for (const projectId of levelProjectIds) {
    const projectRef = doc(db, "users", uid, "projects", projectId);
    await deleteDoc(projectRef);
  }

  await deleteAchievementsByLevel(uid, levelId);

  const assessmentMap = await getAssessmentMap(uid);
  await updateUserProgress(uid, { totalScore: calcTotalScore(assessmentMap) });
}
