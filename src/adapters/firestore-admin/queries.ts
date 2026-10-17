import { fsPath, getAdminDb } from "@/adapters/firestore-admin/admin-app";
import type { DocumentReference } from "firebase-admin/firestore";
import { calcSkillScore } from "@/core/domain/scoring";
import {
  userAchievementsPath,
  userAssessmentsPath,
  userProgressPath,
  userProjectsPath,
} from "@/adapters/firestore-client/paths";
import type { UserProgress } from "@/types";

export interface AssessmentMapEntry {
  score: number;
  subtopics?: Record<string, boolean>;
}

export type AssessmentMap = Record<string, AssessmentMapEntry>;

export const DEFAULT_USER_PROGRESS: UserProgress = {
  currentLevelId: "junior",
  unlockedLevelIds: ["junior"],
  totalScore: 0,
};

export async function readAssessmentMap(uid: string): Promise<AssessmentMap> {
  const snap = await getAdminDb()
    .collection(fsPath(userAssessmentsPath(uid)))
    .get();
  const map: AssessmentMap = {};
  snap.forEach((d) => {
    const data = d.data();
    const subtopics = data.subtopics as Record<string, boolean> | undefined;
    const score = subtopics
      ? calcSkillScore(d.id, subtopics)
      : (data.score as number) || 0;
    map[d.id] = { score, subtopics };
  });
  return map;
}

export async function getUserProgress(uid: string): Promise<UserProgress> {
  const ref = getAdminDb().doc(fsPath(userProgressPath(uid)));
  const snap = await ref.get();
  if (!snap.exists) {
    await ref.set(DEFAULT_USER_PROGRESS);
    return DEFAULT_USER_PROGRESS;
  }
  return snap.data() as UserProgress;
}

export async function getProjectProgressMap(
  uid: string,
): Promise<Record<string, boolean>> {
  const snap = await getAdminDb()
    .collection(fsPath(userProjectsPath(uid)))
    .get();
  const map: Record<string, boolean> = {};
  snap.forEach((d) => {
    map[d.id] = Boolean(d.data().completed);
  });
  return map;
}

export interface StoredAchievement {
  ref: DocumentReference;
  data: { type?: string; metadata?: Record<string, unknown> };
}

export async function listAchievements(
  uid: string,
): Promise<StoredAchievement[]> {
  const snap = await getAdminDb()
    .collection(fsPath(userAchievementsPath(uid)))
    .get();
  return snap.docs.map((d) => ({
    ref: d.ref,
    data: d.data() as { type?: string; metadata?: Record<string, unknown> },
  }));
}
