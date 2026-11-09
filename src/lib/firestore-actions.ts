"use client";

import { auth, db } from "@/lib/firebase";
import { doc, writeBatch } from "firebase/firestore";
import { levels } from "@/data/levels";
import { categories } from "@/data/categories";
import { skills } from "@/data/skills";
import { syncStreak } from "@/adapters/firestore-client/streak-commands";
import { calcCategoryScore, calcTotalScore } from "@/core/domain/scoring";
import {
  getCategoryMaxScore,
  getLevelMinScore,
  LEVEL_UP_THRESHOLD,
} from "@/core/domain/weights";
import {
  reconcileAchievements,
  updateUserProgress,
} from "@/lib/firestore";
import { ensureUserState, readUserState } from "@/adapters/firestore-client/state";
import {
  evaluateAchievements,
  type AssessmentMap,
} from "@/core/domain/achievement-conditions";
import { userProjectPath, userStatePath } from "@/adapters/firestore-client/paths";

import { patchCachedUserState, userStateStore } from "@/shared/lib/user-state-store";

function getUid(): string {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  return user.uid;
}

export async function readAssessmentMap(uid: string): Promise<Record<string, { score: number; subtopics?: Record<string, boolean> }>> {
  const state = await readUserState(uid);
  const map: Record<string, { score: number; subtopics?: Record<string, boolean> }> = {};
  if (state?.assessments) {
    for (const [id, data] of Object.entries(state.assessments)) {
      map[id] = { score: data.score ?? 0, subtopics: data.subtopics };
    }
  }
  return map;
}

type PreloadedAssessments = AssessmentMap | Promise<AssessmentMap>;

export async function backfillTotalScore(
  uid: string,
  preloadedMap?: PreloadedAssessments,
): Promise<number> {
  const state = await readUserState(uid);
  const resolvedPreloaded = preloadedMap ? await preloadedMap : null;
  const assessmentMap = (resolvedPreloaded ?? state?.assessments ?? {}) as AssessmentMap;
  const totalScore = calcTotalScore(assessmentMap);
  const stored = state?.progress?.totalScore ?? 0;
  if (stored === totalScore) return totalScore;

  await updateUserProgress(uid, { totalScore });
  return totalScore;
}

export async function checkAchievements(
  uid: string,
  preloadedMap?: PreloadedAssessments,
) {
  const state = await readUserState(uid);
  const resolvedPreloaded = preloadedMap ? await preloadedMap : null;
  const assessmentMap = (resolvedPreloaded ?? state?.assessments ?? {}) as AssessmentMap;

  const awards = evaluateAchievements({
    assessmentMap,
    longestStreak: state?.streak?.longestStreak ?? 0,
    unlockedLevelIds:
      state?.progress?.unlockedLevelIds ?? [state?.progress?.currentLevelId ?? "junior"],
  });

  await reconcileAchievements(uid, awards, state);
  return awards;
}

const achievementsSynced = new Set<string>();

export async function checkAchievementsOnce(
  uid: string,
  preloadedMap?: PreloadedAssessments,
) {
  if (achievementsSynced.has(uid)) return [];
  achievementsSynced.add(uid);
  try {
    return await checkAchievements(uid, preloadedMap);
  } catch (error) {
    achievementsSynced.delete(uid);
    throw error;
  }
}

export async function checkLevelUp() {
  const uid = getUid();

  const state = await readUserState(uid);
  const userProgress = state?.progress;
  if (!userProgress) return null;

  const currentLevelId = userProgress.currentLevelId || levels[0].id;
  const currentIndex = levels.findIndex((l) => l.id === currentLevelId);
  if (currentIndex >= levels.length - 1) return null;

  const nextLevel = levels[currentIndex + 1];
  const assessmentMap = (state?.assessments ?? {}) as AssessmentMap;

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
    const stateAssessments = state?.assessments ?? {};
    const allRequiredScored = requiredSkills.every(
      (s) => (stateAssessments[s.id]?.score || 0) >= 1,
    );
    if (!allRequiredScored) return null;
  }

  if (nextLevel.requiredProjectCount > 0) {
    const projects = state?.projects ?? {};
    const projectMap: Record<string, boolean> = {};
    for (const key of Object.keys(projects)) {
      projectMap[key] = projects[key].completed;
    }
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

  await checkAchievements(uid, assessmentMap);

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
  await ensureUserState(uid);
  const projectRef = doc(db, ...userProjectPath(uid, projectId));
  const stateRef = doc(db, ...userStatePath(uid));
  const completedAt = completed ? new Date() : null;
  const statePayload = {
    projectId,
    completed,
    completedAt,
  };
  const batch = writeBatch(db);
  batch.set(projectRef, {
    completed,
    completedAt,
  });
  batch.set(
    stateRef,
    { projects: { [projectId]: statePayload } },
    { merge: true },
  );
  await batch.commit();

  const cachedProjects = userStateStore.peek(uid).data?.projects ?? {};
  const nextProjects = {
    ...cachedProjects,
    [projectId]: statePayload,
  };
  patchCachedUserState(uid, { projects: nextProjects });

  if (completed) {
    void syncStreak();
  }
}
