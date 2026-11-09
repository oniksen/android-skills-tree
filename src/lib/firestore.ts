import { doc, setDoc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import {
  achievementKey,
  type AchievementAward,
} from "@/core/domain/achievement-conditions";
import { userStatePath } from "@/adapters/firestore-client/paths";
import { readUserState, ensureUserState, normalizeUserState } from "@/adapters/firestore-client/state";
import type { Achievement, UserProgress, UserState } from "@/types";
import { recordWrite } from "@/shared/lib/firestore-metrics";

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
  const stateRef = doc(db, ...userStatePath(uid));
  await setDoc(stateRef, { progress: data }, { merge: true });
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
  _state?: UserState,
): Promise<ReconcileAchievementsResult> {
  await ensureUserState(uid);
  void _state;
  const stateRef = doc(db, ...userStatePath(uid));

  const resultCounts = await runTransaction(db, async (tx) => {
    const snap = await tx.get(stateRef);
    const snapData = typeof snap?.data === "function" ? snap.data() : undefined;
    const userState = normalizeUserState(snapData);

    const desired = new Map<string, AchievementAward>();
    for (const award of awards) {
      desired.set(achievementKey(award.type, award.metadata), award);
    }

    // preserve existing streak achievements that are still earned
    const longestStreak = userState?.streak?.longestStreak ?? 0;
    const existingAchievements = userState?.achievements ?? {};
    for (const ach of Object.values(existingAchievements)) {
      if (typeof ach?.type !== "string" || !ach.type.startsWith("streak_")) continue;
      const n = Number(ach.type.slice("streak_".length));
      if (!Number.isFinite(n) || n > longestStreak) continue;
      const key = achievementKey(ach.type, ach.metadata ?? {});
      if (!desired.has(key)) {
        desired.set(key, { type: ach.type, metadata: ach.metadata ?? {} });
      }
    }

    const result: ReconcileAchievementsResult = { added: 0, removed: 0, updated: 0 };

    const kept = new Map<string, { key: string; ach: Achievement }>();

    for (const [entryKey, ach] of Object.entries(existingAchievements)) {
      if (typeof ach?.type !== "string" || !ach.type) {
        result.removed += 1;
        continue;
      }

      const key = achievementKey(ach.type, ach.metadata);
      if (!desired.has(key) || kept.has(key)) {
        result.removed += 1;
        continue;
      }

      kept.set(key, { key: entryKey, ach });
    }

    const nextMap: Record<string, Achievement> = {};

    for (const [key, award] of desired) {
      const existing = kept.get(key);

      if (!existing) {
        result.added += 1;
        const ach: Achievement = {
          id: key,
          type: award.type,
          metadata: award.metadata,
          achievedAt: serverTimestamp() as unknown as Date, // Firestore resolves this server-side; normalizeUserState converts it back to Date on read.
        };
        nextMap[key] = ach;
        continue;
      }

      const existingAch = existing.ach;
      const existingMetadata = existingAch.metadata ?? {};
      const metadataChanged = Object.entries(award.metadata).some(
        ([field, value]) => existingMetadata[field] !== value,
      );
      const needsMove = existingAch.id !== key;

      const achievedAt = (existingAch.achievedAt ?? new Date()) as Date;

      if (!metadataChanged && !needsMove) {
        const ach: Achievement = {
          id: key,
          type: award.type,
          metadata: existingMetadata,
          achievedAt,
        };
        nextMap[key] = ach;
        continue;
      }

      const mergedMetadata = { ...existingMetadata, ...award.metadata };
      result.updated += 1;

      if (needsMove) {
        result.removed += 1;
      }

      const ach: Achievement = {
        id: key,
        type: award.type,
        metadata: mergedMetadata,
        achievedAt,
      };
      nextMap[key] = ach;
    }

    tx.update(stateRef, { achievements: nextMap });

    return result;
  });

  recordWrite("reconcileAchievements", 1);
  return resultCounts;
}
