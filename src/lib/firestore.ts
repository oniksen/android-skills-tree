import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  achievementKey,
  selectMissingAwards,
  type AchievementAward,
} from "@/lib/achievement-conditions";
import { calcSkillScore } from "@/lib/scoring";
import type { UserProgress, Assessment, ProjectProgress, Achievement } from "@/types";

// ============ User Progress ============

const DEFAULT_USER_PROGRESS: UserProgress = {
  currentLevelId: "junior",
  unlockedLevelIds: ["junior"],
  totalScore: 0,
};

export async function getUserProgress(uid: string): Promise<UserProgress> {
  const progressRef = doc(db, "users", uid, "progress", "current");
  const snap = await getDoc(progressRef);

  if (!snap.exists()) {
    await setDoc(progressRef, DEFAULT_USER_PROGRESS);
    return DEFAULT_USER_PROGRESS;
  }

  return snap.data() as UserProgress;
}

export async function updateUserProgress(
  uid: string,
  data: Partial<UserProgress>,
) {
  const progressRef = doc(db, "users", uid, "progress", "current");
  const snap = await getDoc(progressRef);

  if (!snap.exists()) {
    await setDoc(progressRef, { ...DEFAULT_USER_PROGRESS, ...data });
  } else {
    await updateDoc(progressRef, data);
  }
}

// ============ Assessments ============

export async function getUserAssessments(uid: string): Promise<Assessment[]> {
  const assessmentsRef = collection(db, "users", uid, "assessments");
  const snap = await getDocs(assessmentsRef);

  return snap.docs.map((doc) => ({
    skillId: doc.id,
    ...doc.data(),
  })) as Assessment[];
}

export async function getAssessmentMap(
  uid: string,
): Promise<Record<string, number>> {
  const assessments = await getUserAssessments(uid);
  const map: Record<string, number> = {};
  assessments.forEach((a) => {
    map[a.skillId] = a.subtopics ? calcSkillScore(a.skillId, a.subtopics) : a.score || 0;
  });
  return map;
}

export async function saveAssessment(
  uid: string,
  skillId: string,
  score: number,
) {
  const assessmentRef = doc(db, "users", uid, "assessments", skillId);
  await setDoc(assessmentRef, {
    score,
    updatedAt: new Date(),
  });
}

export async function deleteAssessmentsByLevel(
  uid: string,
  skillIds: string[],
) {
  for (const skillId of skillIds) {
    const assessmentRef = doc(db, "users", uid, "assessments", skillId);
    await deleteDoc(assessmentRef);
  }
}

// ============ Project Progress ============

export async function getUserProjectProgress(
  uid: string,
): Promise<ProjectProgress[]> {
  const projectsRef = collection(db, "users", uid, "projects");
  const snap = await getDocs(projectsRef);

  return snap.docs.map((doc) => ({
    projectId: doc.id,
    ...doc.data(),
  })) as ProjectProgress[];
}

export async function getProjectProgressMap(
  uid: string,
): Promise<Record<string, boolean>> {
  const progress = await getUserProjectProgress(uid);
  const map: Record<string, boolean> = {};
  progress.forEach((p) => {
    map[p.projectId] = p.completed;
  });
  return map;
}

export async function toggleProjectCompletion(
  uid: string,
  projectId: string,
  completed: boolean,
) {
  const projectRef = doc(db, "users", uid, "projects", projectId);
  await setDoc(projectRef, {
    completed,
    completedAt: completed ? new Date() : null,
  });
}

export async function deleteProjectProgress(
  uid: string,
  projectIds: string[],
) {
  for (const projectId of projectIds) {
    const projectRef = doc(db, "users", uid, "projects", projectId);
    await deleteDoc(projectRef);
  }
}

// ============ Achievements ============

export async function getUserAchievements(uid: string): Promise<Achievement[]> {
  const achievementsRef = collection(db, "users", uid, "achievements");
  const q = query(achievementsRef);
  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Achievement[];
}

export async function addAchievementIfNotExists(
  uid: string,
  type: string,
  metadata: Record<string, unknown>,
  matchKey?: string,
  matchValue?: unknown,
) {
  const achievementsRef = collection(db, "users", uid, "achievements");
  const snap = await getDocs(achievementsRef);

  const exists = snap.docs.some((doc) => {
    const data = doc.data();
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

export async function addAchievementsIfNotExists(
  uid: string,
  awards: AchievementAward[],
) {
  if (awards.length === 0) return;

  const achievementsRef = collection(db, "users", uid, "achievements");
  const snap = await getDocs(achievementsRef);

  const existingKeys = snap.docs.map((d) => {
    const data = d.data();
    return achievementKey(data.type, data.metadata);
  });

  for (const award of selectMissingAwards(awards, existingKeys)) {
    await setDoc(doc(achievementsRef), {
      type: award.type,
      metadata: award.metadata,
      achievedAt: new Date(),
    });
  }
}

// ============ Helpers ============

export function createDefaultUserProgress(uid: string) {
  return setDoc(doc(db, "users", uid, "progress", "current"), DEFAULT_USER_PROGRESS);
}
