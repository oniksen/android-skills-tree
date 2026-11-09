import { doc, collection, writeBatch } from "firebase/firestore";
import { db } from "./firebase";
import {
  achievementKey,
  type AchievementAward,
} from "@/core/domain/achievement-conditions";
import {
  userProgressPath,
  userAchievementsPath,
  userStatePath,
} from "@/adapters/firestore-client/paths";
import { readUserState, ensureUserState } from "@/adapters/firestore-client/state";
import { setAchievementsCache } from "@/shared/lib/achievement-cache";
import type { Achievement, UserProgress, UserState } from "@/types";

// ============ User Progress ============

const DEFAULT_USER_PROGRESS: UserProgress = {
  currentLevelId: "junior",
  unlockedLevelIds: ["junior"],
  totalScore: 0,
};

export async function getUserProgress(uid: string): Promise<UserProgress> {
  const state = await readUserState(uid);
  return (state?.progress as UserProgress | undefined) ?? DEFAULT_USER_PROGRESS;
}

export async function updateUserProgress(
  uid: string,
  data: Partial<UserProgress>,
) {
  await ensureUserState(uid);
  const progressRef = doc(db, ...userProgressPath(uid));
  const stateRef = doc(db, ...userStatePath(uid));
  const batch = writeBatch(db);
  batch.set(progressRef, data, { merge: true });
  batch.set(stateRef, { progress: data }, { merge: true });
  await batch.commit();
}

// ============ Project Progress ============

export async function getProjectProgressMap(
  uid: string,
): Promise<Record<string, boolean>> {
  const state = await readUserState(uid);
  const map: Record<string, boolean> = {};
  if (state?.projects) {
    for (const key of Object.keys(state.projects)) {
      map[key] = state.projects[key].completed;
    }
  }
  return map;
}

// ============ Achievements ============

export interface ReconcileAchievementsResult {
  added: number;
  removed: number;
  updated: number;
}

export async function reconcileAchievements(
  uid: string,
  awards: AchievementAward[],
  state?: UserState,
): Promise<ReconcileAchievementsResult> {
  await ensureUserState(uid);
  const userState = state ?? (await readUserState(uid));
  const achievementsRef = collection(db, ...userAchievementsPath(uid));
  const stateRef = doc(db, ...userStatePath(uid));

  const desired = new Map<string, AchievementAward>();
  for (const award of awards) {
    desired.set(achievementKey(award.type, award.metadata), award);
  }

  const result: ReconcileAchievementsResult = { added: 0, removed: 0, updated: 0 };

  const batch = writeBatch(db);
  let opCount = 0;

  const existingMap = userState?.achievements ?? {};
  const existingDocs = Object.entries(existingMap).map(([key, ach]) => ({
    id: ach.id || key,
    ref: doc(achievementsRef, ach.id || key),
    data: () => ({
      type: ach.type,
      metadata: ach.metadata,
      achievedAt: ach.achievedAt,
    }),
  }));

  const kept = new Map<string, (typeof existingDocs)[number]>();

  for (const achievementDoc of existingDocs) {
    const data = achievementDoc.data() as {
      type?: unknown;
      metadata?: Record<string, unknown>;
    };

    if (typeof data.type !== "string") {
      batch.delete(achievementDoc.ref as never);
      opCount += 1;
      result.removed += 1;
      continue;
    }

    const key = achievementKey(data.type, data.metadata);
    if (!desired.has(key) || kept.has(key)) {
      batch.delete(achievementDoc.ref as never);
      opCount += 1;
      result.removed += 1;
      continue;
    }

    kept.set(key, achievementDoc);
  }

  const nextList: Achievement[] = [];
  const nextMap: Record<string, Achievement> = {};

  for (const [key, award] of desired) {
    const existing = kept.get(key);

    if (!existing) {
      const now = new Date();
      batch.set(doc(achievementsRef, key), {
        type: award.type,
        metadata: award.metadata,
        achievedAt: now,
      });
      opCount += 1;
      result.added += 1;
      const ach: Achievement = {
        id: key,
        type: award.type,
        metadata: award.metadata,
        achievedAt: now,
      };
      nextList.push(ach);
      nextMap[key] = ach;
      continue;
    }

    const existingData = existing.data() as {
      metadata?: Record<string, unknown>;
      achievedAt?: unknown;
    };
    const existingMetadata = existingData.metadata ?? {};
    const metadataChanged = Object.entries(award.metadata).some(
      ([field, value]) => existingMetadata[field] !== value,
    );
    const needsMove = existing.id !== key;

    const achievedAt = (existingData.achievedAt ?? new Date()) as Date;

    if (!metadataChanged && !needsMove) {
      const ach: Achievement = {
        id: key,
        type: award.type,
        metadata: existingMetadata,
        achievedAt,
      };
      nextList.push(ach);
      nextMap[key] = ach;
      continue;
    }

    const mergedMetadata = { ...existingMetadata, ...award.metadata };
    batch.set(doc(achievementsRef, key), {
      type: award.type,
      metadata: mergedMetadata,
      achievedAt,
    });
    opCount += 1;
    result.updated += 1;

    if (needsMove) {
      batch.delete(existing.ref as never);
      opCount += 1;
      result.removed += 1;
    }

    const ach: Achievement = {
      id: key,
      type: award.type,
      metadata: mergedMetadata,
      achievedAt,
    };
    nextList.push(ach);
    nextMap[key] = ach;
  }

  batch.update(stateRef, { achievements: nextMap });
  opCount += 1;

  if (opCount > 0) {
    await batch.commit();
  }

  setAchievementsCache(uid, nextList);

  return result;
}