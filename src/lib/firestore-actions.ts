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
  query,
} from "firebase/firestore";
import { levels } from "@/data/levels";
import { categories } from "@/data/categories";
import { skills } from "@/data/skills";
import { syncStreak } from "@/lib/streak";

function getUid(): string {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  return user.uid;
}

function calcSkillScore(skillId: string, subtopics: Record<string, boolean> | undefined): number {
  const skill = skills.find((s) => s.id === skillId);
  if (!skill || !skill.subtopics || skill.subtopics.length === 0 || !subtopics) return 0;
  const completed = skill.subtopics.filter((st) => subtopics[st]).length;
  return Math.round((completed / skill.subtopics.length) * skill.maxWeight);
}

async function getAssessmentMap(uid: string): Promise<Record<string, { score: number; subtopics?: Record<string, boolean> }>> {
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

async function addAchievementIfNotExists(
  uid: string,
  type: string,
  metadata: Record<string, unknown>,
  matchKey?: string,
  matchValue?: unknown,
) {
  const achievementsRef = collection(db, "users", uid, "achievements");
  const snap = await getDocs(query(achievementsRef));

  const exists = snap.docs.some((d) => {
    const data = d.data();
    if (data.type !== type) return false;
    if (matchKey && matchValue !== undefined) {
      return data.metadata?.[matchKey] === matchValue;
    }
    return true;
  });

  if (!exists) {
    const newRef = doc(achievementsRef);
    await setDoc(newRef, {
      type,
      metadata,
      achievedAt: new Date(),
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

async function recalculateScore(uid: string) {
  const assessmentMap = await getAssessmentMap(uid);

  let totalScore = 0;
  for (const [skillId, data] of Object.entries(assessmentMap)) {
    const skill = skills.find((s) => s.id === skillId);
    if (!skill) continue;
    totalScore += data.score;
  }

  await updateUserProgress(uid, { totalScore });
  return totalScore;
}

async function checkAchievements(uid: string) {
  const assessmentMap = await getAssessmentMap(uid);

  for (const cat of categories) {
    const catSkills = skills.filter((s) => s.categoryId === cat.id);
    if (catSkills.length === 0) continue;

    const allMaxed = catSkills.every((s) => {
      const data = assessmentMap[s.id];
      return data && s.subtopics.length > 0 && data.subtopics &&
        s.subtopics.every((st) => data.subtopics?.[st]);
    });

    if (!allMaxed) continue;

    await addAchievementIfNotExists(
      uid,
      "category_perfect",
      {
        category_id: cat.id,
        category_name: cat.name,
        level_id: cat.levelId,
      },
      "category_id",
      cat.id,
    );
  }

  for (const level of levels) {
    const levelCategories = categories.filter((c) => c.levelId === level.id);
    if (levelCategories.length === 0) continue;

    const allMaxed = levelCategories.every((cat) => {
      const catSkills = skills.filter((s) => s.categoryId === cat.id);
      const catScore = catSkills.reduce((sum, s) => {
        const data = assessmentMap[s.id];
        return sum + (data?.score || 0);
      }, 0);
      return catScore >= cat.maxScore;
    });

    if (!allMaxed) continue;

    await addAchievementIfNotExists(
      uid,
      "level_master",
      { level_id: level.id, level_name: level.name, level_slug: level.slug },
      "level_id",
      level.id,
    );
  }

  const achievementsRef = collection(db, "users", uid, "achievements");
  const achievementsSnap = await getDocs(query(achievementsRef));
  const masteredLevelIds = new Set<string>();
  achievementsSnap.docs.forEach((d) => {
    const data = d.data();
    if (data.type === "level_master" && data.metadata?.level_id) {
      masteredLevelIds.add(data.metadata.level_id);
    }
  });

  const allLevelsMastered = levels.every((l) => masteredLevelIds.has(l.id));
  if (allLevelsMastered && levels.length > 0) {
    const progress = await getUserProgress(uid);
    await addAchievementIfNotExists(uid, "path_complete", {
      total_score: progress?.totalScore ?? 0,
    });
  }
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
    const catSkills = skills.filter((s) => s.categoryId === cat.id);
    const catXp = catSkills.reduce((sum, s) => {
      return sum + (assessmentMap[s.id]?.score || 0);
    }, 0);
    if (catXp < cat.maxScore * 0.8) return null;
  }

  const totalScore = Object.values(assessmentMap).reduce((sum, d) => sum + d.score, 0);
  if (totalScore < nextLevel.minScore) return null;

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

  await updateUserProgress(uid, { totalScore: 0 });
}
