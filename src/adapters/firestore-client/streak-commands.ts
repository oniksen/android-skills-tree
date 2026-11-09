"use client";

import { auth, db } from "@/lib/firebase";
import { STREAK_FREEZE_ITEM_ID } from "@/data/shop";
import { getFreezeCount } from "@/core/domain/currency";
import { doc, runTransaction, setDoc } from "firebase/firestore";
import { userStatePath } from "@/adapters/firestore-client/paths";
import { ensureUserState, normalizeUserState, readUserState } from "@/adapters/firestore-client/state";
import {
  STREAK_ACHIEVEMENT_DAYS,
  collectMissedDays,
  computeStreaks,
  getLocalDayString,
  type AutoFreezeReport,
  type StreakData,
} from "@/core/domain/streak";
import { computeStreakSync } from "@/core/use-cases/compute-streak-sync";
import type { CurrencyData } from "@/types";
import { runExclusive } from "@/shared/lib/user-state-lock";

export async function applyAutoFreezes(): Promise<AutoFreezeReport | null> {
  const user = auth.currentUser;
  if (!user) return null;
  if (autoFreezePermissionDenied) return null;

  return runExclusive(user.uid, async () => {
    await ensureUserState(user.uid);

    const today = getLocalDayString();
    const stateRef = doc(db, ...userStatePath(user.uid));

    try {
      const result = await runTransaction(db, async (tx) => {
        const stateSnap = await tx.get(stateRef);
        const stateSnapData = typeof stateSnap?.data === "function" ? stateSnap.data() : undefined;
        const state = normalizeUserState(stateSnapData);
        const streak = state.streak ?? {};
        const activeDays = Array.isArray(streak.activeDays) ? streak.activeDays : [];
        const frozenDays = Array.isArray(streak.frozenDays) ? streak.frozenDays : [];

        const missed = collectMissedDays(activeDays, frozenDays, today);
        if (missed.length === 0) {
          return { frozen: [] as string[], unfundedMisses: 0, longestStreak: null };
        }

        const currency = state.currency ?? {};
        const freezes = getFreezeCount(currency as CurrencyData);

        const toFreeze = missed.slice(0, freezes);
        if (toFreeze.length === 0) {
          return { frozen: [] as string[], unfundedMisses: missed.length, longestStreak: null };
        }

        const nextFrozenDays = [...frozenDays, ...toFreeze];
        const { currentStreak, longestStreak } = computeStreaks(
          activeDays,
          nextFrozenDays,
          today,
        );

        const nextStreak = {
          activeDays,
          frozenDays: nextFrozenDays,
          lastActiveDate: streak.lastActiveDate ?? today,
          currentStreak,
          longestStreak,
          updatedAt: new Date(),
        };

        const nextCurrency = {
          balance: typeof currency.balance === "number" ? currency.balance : 0,
          items: {
            ...(currency.items ?? {}),
            [STREAK_FREEZE_ITEM_ID]: freezes - toFreeze.length,
          },
          claimedSkills:
            currency.claimedSkills && typeof currency.claimedSkills === "object"
              ? (currency.claimedSkills as Record<string, string>)
              : {},
          updatedAt: new Date(),
        };
        tx.set(
          stateRef,
          { streak: nextStreak, currency: nextCurrency },
          { merge: true },
        );

        return {
          frozen: toFreeze,
          unfundedMisses: missed.length - toFreeze.length,
          longestStreak,
        };
      });

      if (result.longestStreak !== null) {
        await checkStreakAchievements(user.uid, result.longestStreak);
      }

      return { frozen: result.frozen, unfundedMisses: result.unfundedMisses };
    } catch (error) {
      console.error("Error applying automatic freezes:", error);
      if (error && typeof error === "object" && (error as { code?: string }).code === "permission-denied") {
        autoFreezePermissionDenied = true;
        return null;
      }
      return null;
    }
  });
}

let autoFreezeInFlight: Promise<AutoFreezeReport | null> | null = null;
let autoFreezePermissionDenied = false;

export function applyAutoFreezesOnce(): Promise<AutoFreezeReport | null> {
  if (!autoFreezeInFlight) {
    autoFreezeInFlight = applyAutoFreezes().finally(() => {
      autoFreezeInFlight = null;
    });
  }
  return autoFreezeInFlight;
}

export async function getStreak(uid: string): Promise<StreakData | null> {
  const state = await readUserState(uid);
  const streak = state?.streak;
  if (!streak) return null;
  if (
    !streak.lastActiveDate &&
    (streak.activeDays?.length ?? 0) === 0 &&
    (streak.frozenDays?.length ?? 0) === 0
  ) {
    return null;
  }
  return {
    ...streak,
    frozenDays: Array.isArray(streak.frozenDays) ? streak.frozenDays : [],
    updatedAt:
      streak.updatedAt instanceof Date
        ? streak.updatedAt
        : new Date(streak.updatedAt as unknown as string | number),
  };
}

export async function syncStreak(): Promise<StreakData | null> {
  const user = auth.currentUser;
  if (!user) return null;

  return runExclusive(user.uid, async () => {
    await ensureUserState(user.uid);

    const today = getLocalDayString();
    const stateRef = doc(db, ...userStatePath(user.uid));

    try {
      const result = await runTransaction(db, async (tx) => {
        const snap = await tx.get(stateRef);
        const snapData = typeof snap?.data === "function" ? snap.data() : undefined;
        const state = normalizeUserState(snapData);
        const existing = (state.streak ?? {}) as Partial<StreakData>;
        const { changed, data } = computeStreakSync({ today, existing });
        if (changed) {
          tx.set(stateRef, { streak: data }, { merge: true });
        }
        return data;
      });

      await checkStreakAchievements(user.uid, result.longestStreak);
      return result;
    } catch (error) {
      console.error("Error syncing streak:", error);
      if (error && typeof error === "object" && (error as { code?: string }).code === "permission-denied") {
        throw error;
      }
      return null;
    }
  });
}

async function addStreakAchievementIfNotExists(uid: string, days: number) {
  const type = `streak_${days}`;
  const state = await ensureUserState(uid);

  if (state?.achievements && state.achievements[type]) return;

  const stateRef = doc(db, ...userStatePath(uid));
  const achievedAt = new Date();
  const achievement = {
    id: `streak_${days}`,
    type,
    metadata: { days },
    achievedAt,
  };
  await setDoc(stateRef, { achievements: { [type]: achievement } }, { merge: true });
}

async function checkStreakAchievements(uid: string, longestStreak: number) {
  if (longestStreak < STREAK_ACHIEVEMENT_DAYS[0]) return;
  for (const days of STREAK_ACHIEVEMENT_DAYS) {
    if (longestStreak >= days) {
      await addStreakAchievementIfNotExists(uid, days);
    }
  }
}
