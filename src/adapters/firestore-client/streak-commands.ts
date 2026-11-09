"use client";

import { auth, db } from "@/lib/firebase";
import { STREAK_FREEZE_ITEM_ID } from "@/data/shop";
import { getFreezeCount } from "@/core/domain/currency";
import {
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  setDoc,
  where,
} from "firebase/firestore";
import {
  userAchievementsPath,
  userCurrencyPath,
  userStreakPath,
  userStatePath,
} from "@/adapters/firestore-client/paths";
import { ensureUserState, readUserState } from "@/adapters/firestore-client/state";
import {
  getAchievementsCache,
  setAchievementsCache,
} from "@/shared/lib/achievement-cache";
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

export async function applyAutoFreezes(): Promise<AutoFreezeReport | null> {
  const user = auth.currentUser;
  if (!user) return null;
  if (autoFreezePermissionDenied) return null;

  await ensureUserState(user.uid);

  const today = getLocalDayString();
  const streakRef = doc(db, ...userStreakPath(user.uid));
  const currencyRef = doc(db, ...userCurrencyPath(user.uid));
  const stateRef = doc(db, ...userStatePath(user.uid));

  try {
    const result = await runTransaction(db, async (tx) => {
      const streakSnap = await tx.get(streakRef);
      const existing = streakSnap.exists()
        ? (streakSnap.data() as Partial<StreakData>)
        : {};
      const activeDays = Array.isArray(existing.activeDays) ? existing.activeDays : [];
      const frozenDays = Array.isArray(existing.frozenDays) ? existing.frozenDays : [];

      const missed = collectMissedDays(activeDays, frozenDays, today);
      if (missed.length === 0) {
        return { frozen: [] as string[], unfundedMisses: 0, longestStreak: null };
      }

      const currencySnap = await tx.get(currencyRef);
      const currency = currencySnap.exists()
        ? (currencySnap.data() as Partial<CurrencyData>)
        : {};
      const freezes = getFreezeCount(currency as CurrencyData);

      // Заморозки тратятся на пропуски по порядку: первая закрывает самый давний
      // пропуск после последнего захода, каждая следующая — следующий за ним.
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
        lastActiveDate: existing.lastActiveDate ?? today,
        currentStreak,
        longestStreak,
        updatedAt: new Date(),
      };

      tx.set(streakRef, nextStreak);
      tx.set(
        currencyRef,
        {
          items: {
            ...(currency.items ?? {}),
            [STREAK_FREEZE_ITEM_ID]: freezes - toFreeze.length,
          },
          updatedAt: new Date(),
        },
        { merge: true },
      );

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

  await ensureUserState(user.uid);

  const today = getLocalDayString();
  const streakRef = doc(db, ...userStreakPath(user.uid));
  const stateRef = doc(db, ...userStatePath(user.uid));

  try {
    const result = await runTransaction(db, async (tx) => {
      const snap = await tx.get(streakRef);
      const existing = snap.exists() ? (snap.data() as Partial<StreakData>) : {};
      const { changed, data } = computeStreakSync({ today, existing });
      if (changed) {
        tx.set(streakRef, data);
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
}

async function addStreakAchievementIfNotExists(uid: string, days: number) {
  const type = `streak_${days}`;
  const state = await ensureUserState(uid);

  // Prefer state for dedupe.
  if (state?.achievements && state.achievements[type]) return;

  const cached = getAchievementsCache(uid);

  // Legacy fallback only if state has no matching key and cache unavailable.
  if (cached === null || cached === undefined) {
    const achievementsRef = collection(db, ...userAchievementsPath(uid));
    const snap = await getDocs(
      query(achievementsRef, where("type", "==", type)),
    );
    if (!snap.empty) return;
  } else {
    if (cached.some((achievement) => achievement.type === type)) return;
  }

  const ref = doc(db, ...userAchievementsPath(uid), `streak_${days}`);
  const achievedAt = new Date();
  await setDoc(ref, { type, metadata: { days }, achievedAt });

  const stateRef = doc(db, ...userStatePath(uid));
  const achievement = {
    id: `streak_${days}`,
    type,
    metadata: { days },
    achievedAt,
  };
  await setDoc(stateRef, { achievements: { [type]: achievement } }, { merge: true });

  if (cached !== null && cached !== undefined) {
    setAchievementsCache(uid, [
      ...cached,
      { id: `streak_${days}`, type, metadata: { days }, achievedAt },
    ]);
  }
}

async function checkStreakAchievements(uid: string, longestStreak: number) {
  if (longestStreak < STREAK_ACHIEVEMENT_DAYS[0]) return;
  for (const days of STREAK_ACHIEVEMENT_DAYS) {
    if (longestStreak >= days) {
      await addStreakAchievementIfNotExists(uid, days);
    }
  }
}
