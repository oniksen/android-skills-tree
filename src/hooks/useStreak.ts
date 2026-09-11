"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import {
  computeStreaks,
  getLocalDayString,
  shiftDay,
  syncStreak as syncStreakFirestore,
} from "@/lib/streak";

export interface StreakDay {
  date: string;
  active: boolean;
  isToday: boolean;
}

export function useStreak() {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [lastActiveDate, setLastActiveDate] = useState<string | null>(null);
  const [activeDays, setActiveDays] = useState<string[]>([]);
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
        const today = getLocalDayString();
        const streaks = computeStreaks(days, today);
        setCurrentStreak(streaks.currentStreak);
        setLongestStreak(streaks.longestStreak);
        setLastActiveDate(data.lastActiveDate ?? null);
        setActiveDays(days);
      } else {
        setCurrentStreak(0);
        setLongestStreak(0);
        setLastActiveDate(null);
        setActiveDays([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid]);

  const syncStreak = useCallback(async () => {
    if (!uid) return null;
    return syncStreakFirestore();
  }, [uid]);

  const today = getLocalDayString();

  const week: StreakDay[] = useMemo(() => {
    const daysSet = new Set(activeDays);
    const result: StreakDay[] = [];
    for (let i = 6; i >= 0; i -= 1) {
      const date = shiftDay(today, -i);
      result.push({
        date,
        active: daysSet.has(date),
        isToday: date === today,
      });
    }
    return result;
  }, [activeDays, today]);

  return {
    currentStreak,
    longestStreak,
    lastActiveDate,
    activeDays,
    week,
    loading,
    syncStreak,
  };
}