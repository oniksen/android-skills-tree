import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  achievementKey,
  type AchievementAward,
} from "@/core/domain/achievement-conditions";
import {
  userProgressPath,
  userProjectsPath,
  userAchievementsPath,
} from "@/adapters/firestore-client/paths";
import {
  getAchievementsCache,
  setAchievementsCache,
  clearAchievementsCache,
} from "@/shared/lib/achievement-cache";
import type { Achievement, UserProgress } from "@/types";

// ============ User Progress ============

const DEFAULT_USER_PROGRESS: UserProgress = {
  currentLevelId: "junior",
  unlockedLevelIds: ["junior"],
  totalScore: 0,
};

export async function getUserProgress(uid: string): Promise<UserProgress> {
  const progressRef = doc(db, ...userProgressPath(uid));
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
  const progressRef = doc(db, ...userProgressPath(uid));
  await setDoc(progressRef, data, { merge: true });
}

// ============ Project Progress ============

export async function getProjectProgressMap(
  uid: string,
): Promise<Record<string, boolean>> {
  const projectsRef = collection(db, ...userProjectsPath(uid));
  const snap = await getDocs(projectsRef);

  const map: Record<string, boolean> = {};
  snap.forEach((d) => {
    map[d.id] = d.data().completed;
  });
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
): Promise<ReconcileAchievementsResult> {
  const achievementsRef = collection(db, ...userAchievementsPath(uid));

  const desired = new Map<string, AchievementAward>();
  for (const award of awards) {
    desired.set(achievementKey(award.type, award.metadata), award);
  }

  const result: ReconcileAchievementsResult = { added: 0, removed: 0, updated: 0 };

  let batch = writeBatch(db);
  let opCount = 0;

  const flushIfNeeded = async () => {
    if (opCount >= 500) {
      await batch.commit();
      batch = writeBatch(db);
      opCount = 0;
    }
  };

  const queueDelete = async (ref: unknown) => {
    await flushIfNeeded();
    batch.delete(ref as never);
    opCount += 1;
  };

  const queueSet = async (ref: unknown, data: unknown) => {
    await flushIfNeeded();
    batch.set(ref as never, data as never);
    opCount += 1;
  };

  try {
    let existingDocs: Array<{
      id: string;
      ref: { id?: string };
      data: () => {
        type?: unknown;
        metadata?: Record<string, unknown>;
        achievedAt?: unknown;
      };
    }>;

    const cached = getAchievementsCache(uid);
    if (cached !== null && cached !== undefined) {
      existingDocs = cached.map((ach) => ({
        id: ach.id,
        ref: doc(achievementsRef, ach.id),
        data: () => ({
          type: ach.type,
          metadata: ach.metadata,
          achievedAt: ach.achievedAt,
        }),
      }));
    } else {
      const snap = await getDocs(achievementsRef);
      const list: Achievement[] = snap.docs.map((d) => {
        const data = d.data() as {
          type?: string;
          metadata?: Record<string, unknown>;
          achievedAt?: { toDate?: () => Date } | Date;
        };
        return {
          id: d.id,
          type: (data.type ?? "") as string,
          metadata: data.metadata ?? {},
          achievedAt:
            (data.achievedAt as { toDate?: () => Date } | undefined)?.toDate?.() ??
            (data.achievedAt as Date | undefined) ??
            new Date(),
        };
      });
      setAchievementsCache(uid, list);
      existingDocs = list.map((ach) => ({
        id: ach.id,
        ref: doc(achievementsRef, ach.id),
        data: () => ({
          type: ach.type,
          metadata: ach.metadata,
          achievedAt: ach.achievedAt,
        }),
      }));
    }
    const kept = new Map<string, (typeof existingDocs)[number]>();

    for (const achievementDoc of existingDocs) {
      const data = achievementDoc.data() as {
        type?: unknown;
        metadata?: Record<string, unknown>;
      };

      if (typeof data.type !== "string") {
        await queueDelete(achievementDoc.ref);
        result.removed += 1;
        continue;
      }

      const key = achievementKey(data.type, data.metadata);
      if (!desired.has(key) || kept.has(key)) {
        await queueDelete(achievementDoc.ref);
        result.removed += 1;
        continue;
      }

      kept.set(key, achievementDoc);
    }

    const nextList: Achievement[] = [];

    for (const [key, award] of desired) {
      const existing = kept.get(key);

      if (!existing) {
        const now = new Date();
        await queueSet(doc(achievementsRef, key), {
          type: award.type,
          metadata: award.metadata,
          achievedAt: now,
        });
        result.added += 1;
        nextList.push({
          id: key,
          type: award.type,
          metadata: award.metadata,
          achievedAt: now,
        });
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
        nextList.push({
          id: key,
          type: award.type,
          metadata: existingMetadata,
          achievedAt,
        });
        continue;
      }

      const mergedMetadata = { ...existingMetadata, ...award.metadata };
      await queueSet(doc(achievementsRef, key), {
        type: award.type,
        metadata: mergedMetadata,
        achievedAt,
      });
      result.updated += 1;

      if (needsMove) {
        await queueDelete(existing.ref);
        result.removed += 1;
      }

      nextList.push({
        id: key,
        type: award.type,
        metadata: mergedMetadata,
        achievedAt,
      });
    }

    if (opCount > 0) {
      await batch.commit();
    }
    setAchievementsCache(uid, nextList);
    return result;
  } catch (error) {
    clearAchievementsCache(uid);
    throw error;
  }
}
