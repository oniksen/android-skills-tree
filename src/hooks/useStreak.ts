"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import {
  applyAutoFreezesOnce,
  computeStreaks,
  getLocalDayString,
  shiftDay,
  syncStreak as syncStreakFirestore,
  type AutoFreezeReport,
} from "@/lib/streak";

export interface StreakDay {
  date: string;
  active: boolean;
  frozen: boolean;
  isToday: boolean;
}

export function useStreak() {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [lastActiveDate, setLastActiveDate] = useState<string | null>(null);
  const [activeDays, setActiveDays] = useState<string[]>([]);
  const [frozenDays, setFrozenDays] = useState<string[]>([]);
  const [autoFreeze, setAutoFreeze] = useState<AutoFreezeReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid ?? null);
      if (!user) {
        setCurrentStreak(0);
        setLongestStreak(0);
        setLastActiveDate(null);
        setActiveDays([]);
        setFrozenDays([]);
        setAutoFreeze(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!uid) return;

    const streakRef = doc(db, "users", uid, "streaks", "current");

    const unsubscribe = onSnapshot(streakRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const days = Array.isArray(data.activeDays) ? data.activeDays : [];
        const frozen = Array.isArray(data.frozenDays) ? data.frozenDays : [];
        const today = getLocalDayString();
        const streaks = computeStreaks(days, frozen, today);
        setCurrentStreak(streaks.currentStreak);
        setLongestStreak(streaks.longestStreak);
        setLastActiveDate(data.lastActiveDate ?? null);
        setActiveDays(days);
        setFrozenDays(frozen);
      } else {
        setCurrentStreak(0);
        setLongestStreak(0);
        setLastActiveDate(null);
        setActiveDays([]);
        setFrozenDays([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid]);

  useEffect(() => {
    if (!uid) return;

    let cancelled = false;
    void applyAutoFreezesOnce().then((report) => {
      if (!cancelled && report) setAutoFreeze(report);
    });

    return () => {
      cancelled = true;
    };
  }, [uid]);

  const syncStreak = useCallback(async () => {
    if (!uid) return null;
    return syncStreakFirestore();
  }, [uid]);

  const today = getLocalDayString();

  const week: StreakDay[] = useMemo(() => {
    const daysSet = new Set(activeDays);
    const frozenSet = new Set(frozenDays);
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
  }, [activeDays, frozenDays, today]);

  return {
    currentStreak,
    longestStreak,
    lastActiveDate,
    activeDays,
    frozenDays,
    autoFreeze,
    week,
    loading,
    syncStreak,
  };
}