"use client";

import { auth, db } from "@/lib/firebase";
import { STREAK_FREEZE_ITEM_ID } from "@/data/shop";
import { getFreezeCount } from "@/core/domain/currency";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  setDoc,
} from "firebase/firestore";
import {
  userAchievementsPath,
  userCurrencyPath,
  userStreakPath,
} from "@/adapters/firestore-client/paths";
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

  const today = getLocalDayString();
  const streakRef = doc(db, ...userStreakPath(user.uid));
  const currencyRef = doc(db, ...userCurrencyPath(user.uid));

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
        return { frozen: [] as string[], unfundedMisses: 0, currentStreak: null };
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
        return { frozen: [] as string[], unfundedMisses: missed.length, currentStreak: null };
      }

      const nextFrozenDays = [...frozenDays, ...toFreeze];
      const { currentStreak, longestStreak } = computeStreaks(
        activeDays,
        nextFrozenDays,
        today,
      );

      tx.set(streakRef, {
        activeDays,
        frozenDays: nextFrozenDays,
        lastActiveDate: existing.lastActiveDate ?? today,
        currentStreak,
        longestStreak,
        updatedAt: new Date(),
      });
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

      return {
        frozen: toFreeze,
        unfundedMisses: missed.length - toFreeze.length,
        currentStreak,
      };
    });

    if (result.currentStreak !== null) {
      await checkStreakAchievements(user.uid, result.currentStreak);
    }

    return { frozen: result.frozen, unfundedMisses: result.unfundedMisses };
  } catch (error) {
    console.error("Error applying automatic freezes:", error);
    return null;
  }
}

let autoFreezeInFlight: Promise<AutoFreezeReport | null> | null = null;

export function applyAutoFreezesOnce(): Promise<AutoFreezeReport | null> {
  if (!autoFreezeInFlight) {
    autoFreezeInFlight = applyAutoFreezes().finally(() => {
      autoFreezeInFlight = null;
    });
  }
  return autoFreezeInFlight;
}

export async function getStreak(uid: string): Promise<StreakData | null> {
  const streakRef = doc(db, ...userStreakPath(uid));
  const snap = await getDoc(streakRef);
  if (!snap.exists()) return null;
  const data = snap.data() as Omit<StreakData, "updatedAt"> & {
    frozenDays?: string[];
    updatedAt?: { toDate?: () => Date };
  };
  return {
    ...data,
    frozenDays: Array.isArray(data.frozenDays) ? data.frozenDays : [],
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : (data.updatedAt as Date),
  };
}

export async function syncStreak(): Promise<StreakData | null> {
  const user = auth.currentUser;
  if (!user) return null;

  const today = getLocalDayString();
  const streakRef = doc(db, ...userStreakPath(user.uid));

  try {
    const result = await runTransaction(db, async (tx) => {
      const snap = await tx.get(streakRef);
      const existing = snap.exists() ? (snap.data() as Partial<StreakData>) : {};
      const { changed, data } = computeStreakSync({ today, existing });
      if (changed) tx.set(streakRef, data);
      return data;
    });

    await checkStreakAchievements(user.uid, result.currentStreak);
    return result;
  } catch (error) {
    console.error("Error syncing streak:", error);
    return null;
  }
}

async function addStreakAchievementIfNotExists(uid: string, days: number) {
  const achievementsRef = collection(db, ...userAchievementsPath(uid));
  const snap = await getDocs(query(achievementsRef));
  const type = `streak_${days}`;
  const exists = snap.docs.some((d) => d.data().type === type);
  if (exists) return;

  const newRef = doc(achievementsRef);
  await setDoc(newRef, {
    type,
    metadata: { days },
    achievedAt: new Date(),
  });
}

async function checkStreakAchievements(uid: string, currentStreak: number) {
  if (currentStreak < STREAK_ACHIEVEMENT_DAYS[0]) return;
  for (const days of STREAK_ACHIEVEMENT_DAYS) {
    if (currentStreak >= days) {
      await addStreakAchievementIfNotExists(uid, days);
    }
  }
}
