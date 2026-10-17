import { FieldValue } from "firebase-admin/firestore";
import { fsPath, getAdminDb } from "@/adapters/firestore-admin/admin-app";
import { addAchievementsIfNotExists } from "@/adapters/firestore-admin/achievements";
import {
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
import { getFreezeCount } from "@/core/domain/currency";
import { STREAK_FREEZE_ITEM_ID } from "@/data/shop";
import type { CurrencyData } from "@/types";

export async function awardStreakAchievements(
  uid: string,
  currentStreak: number,
) {
  if (currentStreak < STREAK_ACHIEVEMENT_DAYS[0]) return;
  const awards = STREAK_ACHIEVEMENT_DAYS.filter((days) => currentStreak >= days)
    .map((days) => ({ type: `streak_${days}`, metadata: { days } }));
  await addAchievementsIfNotExists(uid, awards);
}

export async function syncStreak(uid: string): Promise<StreakData | null> {
  const today = getLocalDayString();
  const db = getAdminDb();
  const streakRef = db.doc(fsPath(userStreakPath(uid)));

  try {
    const result = await db.runTransaction(async (tx) => {
      const snap = await tx.get(streakRef);
      const existing = (snap.data() ?? {}) as Partial<StreakData>;
      const { changed, data } = computeStreakSync({ today, existing });
      if (changed) tx.set(streakRef, data);
      return data;
    });

    await awardStreakAchievements(uid, result.currentStreak);
    return result;
  } catch (error) {
    console.error("Error syncing streak:", error);
    return null;
  }
}

export async function applyAutoFreezes(
  uid: string,
): Promise<AutoFreezeReport | null> {
  const today = getLocalDayString();
  const db = getAdminDb();
  const streakRef = db.doc(fsPath(userStreakPath(uid)));
  const currencyRef = db.doc(fsPath(userCurrencyPath(uid)));

  try {
    const result = await db.runTransaction(async (tx) => {
      const streakSnap = await tx.get(streakRef);
      const existing = (streakSnap.data() ?? {}) as Partial<StreakData>;
      const activeDays = Array.isArray(existing.activeDays) ? existing.activeDays : [];
      const frozenDays = Array.isArray(existing.frozenDays) ? existing.frozenDays : [];

      const missed = collectMissedDays(activeDays, frozenDays, today);
      if (missed.length === 0) {
        return { frozen: [] as string[], unfundedMisses: 0, currentStreak: null };
      }

      const currencySnap = await tx.get(currencyRef);
      const currency = (currencySnap.data() ?? {}) as Partial<CurrencyData>;
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
        updatedAt: FieldValue.serverTimestamp(),
      });
      tx.set(
        currencyRef,
        {
          items: {
            ...(currency.items ?? {}),
            [STREAK_FREEZE_ITEM_ID]: freezes - toFreeze.length,
          },
          updatedAt: FieldValue.serverTimestamp(),
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
      await awardStreakAchievements(uid, result.currentStreak);
    }

    return { frozen: result.frozen, unfundedMisses: result.unfundedMisses };
  } catch (error) {
    console.error("Error applying automatic freezes:", error);
    return null;
  }
}
