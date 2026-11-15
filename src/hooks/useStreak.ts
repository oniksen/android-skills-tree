"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useToast } from "@/shared/lib/toast-context";
import { isPermissionDenied } from "@/shared/lib/permission-denied";
import { isQuotaExceeded } from "@/shared/lib/quota";
import { useFirebaseAuth } from "./useFirebaseAuth";
import { useUserState } from "./useUserState";
import {
  applyAutoFreezesOnce,
  syncStreak as syncStreakFirestore,
} from "@/adapters/firestore-client/streak-commands";
import {
  computeStreaks,
  getLocalDayString,
  shiftDay,
  type AutoFreezeReport,
  type StreakData,
} from "@/core/domain/streak";

export interface StreakDay {
  date: string;
  active: boolean;
  frozen: boolean;
  isToday: boolean;
}

const EMPTY_DAYS: string[] = [];

export function useStreak() {
  const { uid, loading: authLoading } = useFirebaseAuth();
  const { state, loading: stateLoading } = useUserState();
  const toast = useToast();
  const showToast = toast.show;

  const [autoFreeze, setAutoFreeze] = useState<AutoFreezeReport | null>(null);

  const signedOut = !authLoading && !uid;
  const streak: StreakData | null = signedOut ? null : (state?.streak ?? null);

  const applied = useMemo(() => {
    if (!streak) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: null as string | null,
        activeDays: [] as string[],
        frozenDays: [] as string[],
      };
    }
    const today = getLocalDayString();
    const streaks = computeStreaks(streak.activeDays, streak.frozenDays, today);
    return {
      currentStreak: streaks.currentStreak,
      longestStreak: streaks.longestStreak,
      lastActiveDate: streak.lastActiveDate || null,
      activeDays: streak.activeDays,
      frozenDays: streak.frozenDays,
    };
  }, [streak]);

  const displayActiveDays = signedOut ? EMPTY_DAYS : applied.activeDays;
  const displayFrozenDays = signedOut ? EMPTY_DAYS : applied.frozenDays;

  const syncStreak = useCallback(async () => {
    if (!uid) return null;
    try {
      const result = await syncStreakFirestore();
      return result;
    } catch (error) {
      console.error("Error syncing streak:", error);
      if (isPermissionDenied(error)) {
        showToast("Для отслеживания прогресса обратитесь к администратору.");
      }
      if (isQuotaExceeded(error)) {
        showToast("Квота Firestore исчерпана. Повторите позже.");
      }
      return null;
    }
  }, [uid, showToast]);

  useEffect(() => {
    if (!uid) return;
    const key = `autoFreezeDone:${uid}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    let cancelled = false;
    void applyAutoFreezesOnce()
      .then((report) => {
        if (!cancelled && report) setAutoFreeze(report);
      })
      .catch((error) => {
        console.error("Error applying auto freezes:", error);
        if (isPermissionDenied(error)) {
          showToast("Для отслеживания прогресса обратитесь к администратору.");
        }
        if (isQuotaExceeded(error)) {
          showToast("Квота Firestore исчерпана. Повторите позже.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [uid, showToast]);

  const today = getLocalDayString();

  const week: StreakDay[] = useMemo(() => {
    const daysSet = new Set(displayActiveDays);
    const frozenSet = new Set(displayFrozenDays);
    const result: StreakDay[] = [];
    for (let i = 6; i >= 0; i -= 1) {
      const date = shiftDay(today, -i);
      result.push({
        date,
        active: daysSet.has(date),
        frozen: frozenSet.has(date),
        isToday: date === today,
      });
    }
    return result;
  }, [displayActiveDays, displayFrozenDays, today]);

  return {
    currentStreak: signedOut ? 0 : applied.currentStreak,
    longestStreak: signedOut ? 0 : applied.longestStreak,
    lastActiveDate: signedOut ? null : applied.lastActiveDate,
    activeDays: displayActiveDays,
    frozenDays: displayFrozenDays,
    autoFreeze: signedOut ? null : autoFreeze,
    week,
    loading: signedOut ? false : stateLoading,
    syncStreak,
  };
}