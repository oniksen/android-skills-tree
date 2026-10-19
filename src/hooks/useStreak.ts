"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useServices } from "@/composition/services-context";
import { useToast } from "@/shared/lib/toast-context";
import { isPermissionDenied } from "@/shared/lib/permission-denied";
import { useFirebaseAuth } from "./useFirebaseAuth";
import {
  applyAutoFreezesOnce,
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
  const { streak: repository } = useServices();
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [lastActiveDate, setLastActiveDate] = useState<string | null>(null);
  const [activeDays, setActiveDays] = useState<string[]>([]);
  const [frozenDays, setFrozenDays] = useState<string[]>([]);
  const [autoFreeze, setAutoFreeze] = useState<AutoFreezeReport | null>(null);
  const [loading, setLoading] = useState(true);
  const { uid, loading: authLoading } = useFirebaseAuth();
  const toast = useToast();

  useEffect(() => {
    if (authLoading || !uid) return;

    return repository.subscribe(uid, {
      next: (snapshot) => {
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
        setLoading(false);
      },
      error: (error) => {
        console.error("Error listening to streak:", error);
        setLoading(false);
      },
    });
  }, [uid, authLoading, repository]);

  useEffect(() => {
    if (!uid) return;

    let cancelled = false;
    void applyAutoFreezesOnce().then((report) => {
      if (!cancelled && report) setAutoFreeze(report);
    }).catch((error) => {
      console.error("Error applying auto freezes:", error);
      if (isPermissionDenied(error)) {
        toast.show("Для отслеживания прогресса обратитесь к администратору.");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [uid, toast]);

  const syncStreak = useCallback(async () => {
    if (!uid) return null;
    try {
      return await syncStreakFirestore();
    } catch (error) {
      console.error("Error syncing streak:", error);
      if (isPermissionDenied(error)) {
        toast.show("Для отслеживания прогресса обратитесь к администратору.");
      }
      return null;
    }
  }, [uid, toast]);

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
