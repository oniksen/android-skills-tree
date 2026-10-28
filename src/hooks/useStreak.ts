"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useToast } from "@/shared/lib/toast-context";
import { isPermissionDenied } from "@/shared/lib/permission-denied";
import { isQuotaExceeded } from "@/shared/lib/quota";
import { useFirebaseAuth } from "./useFirebaseAuth";
import {
  applyAutoFreezesOnce,
  getStreak as getStreakFirestore,
  syncStreak as syncStreakFirestore,
} from "@/adapters/firestore-client/streak-commands";
import {
  computeStreaks,
  getLocalDayString,
  shiftDay,
  type AutoFreezeReport,
} from "@/core/domain/streak";

export interface StreakDay {
  date: string;
  active: boolean;
  frozen: boolean;
  isToday: boolean;
}

const EMPTY_DAYS: string[] = [];

export function useStreak() {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [lastActiveDate, setLastActiveDate] = useState<string | null>(null);
  const [activeDays, setActiveDays] = useState<string[]>([]);
  const [frozenDays, setFrozenDays] = useState<string[]>([]);
  const [autoFreeze, setAutoFreeze] = useState<AutoFreezeReport | null>(null);
  const [loading, setLoading] = useState(true);
  const { uid, loading: authLoading } = useFirebaseAuth();
  const toast = useToast();

  const refreshStreak = useCallback(async () => {
    if (!uid) return;
    try {
      const snapshot = await getStreakFirestore(uid);
      if (!snapshot) {
        setCurrentStreak(0);
        setLongestStreak(0);
        setLastActiveDate(null);
        setActiveDays([]);
        setFrozenDays([]);
      } else {
        const today = getLocalDayString();
        const streaks = computeStreaks(
          snapshot.activeDays,
          snapshot.frozenDays,
          today,
        );
        setCurrentStreak(streaks.currentStreak);
        setLongestStreak(streaks.longestStreak);
        setLastActiveDate(snapshot.lastActiveDate);
        setActiveDays(snapshot.activeDays);
        setFrozenDays(snapshot.frozenDays);
      }
    } catch (error) {
      console.error("Error loading streak:", error);
      if (isPermissionDenied(error)) {
        toast.show("Для отслеживания прогресса обратитесь к администратору.");
      }
      if (isQuotaExceeded(error)) {
        toast.show("Квота Firestore исчерпана. Повторите позже.");
      }
    } finally {
      setLoading(false);
    }
  }, [uid, toast]);

  useEffect(() => {
    if (authLoading || !uid) return;
    const timer = setTimeout(() => {
      void refreshStreak();
    }, 0);
    return () => clearTimeout(timer);
  }, [uid, authLoading, refreshStreak]);

  // Auto-freeze once per session to avoid repeated reads/writes.
  useEffect(() => {
    if (!uid) return;
    const key = `autoFreezeDone:${uid}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    let cancelled = false;
    void applyAutoFreezesOnce().then((report) => {
      if (!cancelled && report) setAutoFreeze(report);
    }).catch((error) => {
      console.error("Error applying auto freezes:", error);
      if (isPermissionDenied(error)) {
        toast.show("Для отслеживания прогресса обратитесь к администратору.");
      }
      if (isQuotaExceeded(error)) {
        toast.show("Квота Firestore исчерпана. Повторите позже.");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [uid, toast]);



  const syncStreak = useCallback(async () => {
    if (!uid) return null;
    try {
      const result = await syncStreakFirestore();
      void refreshStreak();
      return result;
    } catch (error) {
      console.error("Error syncing streak:", error);
      if (isPermissionDenied(error)) {
        toast.show("Для отслеживания прогресса обратитесь к администратору.");
      }
      if (isQuotaExceeded(error)) {
        toast.show("Квота Firestore исчерпана. Повторите позже.");
      }
      return null;
    }
  }, [uid, toast, refreshStreak]);

  const signedOut = !authLoading && !uid;
  const displayActiveDays = signedOut ? EMPTY_DAYS : activeDays;
  const displayFrozenDays = signedOut ? EMPTY_DAYS : frozenDays;

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
    currentStreak: signedOut ? 0 : currentStreak,
    longestStreak: signedOut ? 0 : longestStreak,
    lastActiveDate: signedOut ? null : lastActiveDate,
    activeDays: displayActiveDays,
    frozenDays: displayFrozenDays,
    autoFreeze: signedOut ? null : autoFreeze,
    week,
    loading: signedOut ? false : loading,
    syncStreak,
  };
}
