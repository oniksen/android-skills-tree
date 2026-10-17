"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useServices } from "@/composition/services-context";
import { useFirebaseAuth } from "./useFirebaseAuth";
import { syncStreakAction, applyAutoFreezesAction } from "@/features/streak/actions";
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
            snapshot.activeDays as string[],
            (snapshot.frozenDays as string[]) ?? [],
            today,
          );
          setCurrentStreak(streaks.currentStreak);
          setLongestStreak(streaks.longestStreak);
          setLastActiveDate((snapshot.lastActiveDate as string) ?? null);
          setActiveDays(snapshot.activeDays as string[]);
          setFrozenDays((snapshot.frozenDays as string[]) ?? []);
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
    void applyAutoFreezesAction()
      .then((report) => {
        if (!cancelled && report) setAutoFreeze(report);
      })
      .catch((error) => {
        console.error("Error applying automatic freezes:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [uid]);

  const syncStreak = useCallback(async () => {
    if (!uid) return false;
    return syncStreakAction();
  }, [uid]);

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
