"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import {
  computeStreaks,
  findFreezableDay,
  getLocalDayString,
  shiftDay,
  syncStreak as syncStreakFirestore,
  freezeStreakDay as freezeStreakDayFirestore,
} from "@/lib/streak";

export interface StreakDay {
  date: string;
  active: boolean;
  frozen: boolean;
  freezable: boolean;
  isToday: boolean;
}

export function useStreak() {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [lastActiveDate, setLastActiveDate] = useState<string | null>(null);
  const [activeDays, setActiveDays] = useState<string[]>([]);
  const [frozenDays, setFrozenDays] = useState<string[]>([]);
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

  const syncStreak = useCallback(async () => {
    if (!uid) return null;
    return syncStreakFirestore();
  }, [uid]);

  const freezeDay = useCallback(async (day: string) => {
    if (!uid) return null;
    return freezeStreakDayFirestore(day);
  }, [uid]);

  const today = getLocalDayString();

  const freezableDay = useMemo(
    () => findFreezableDay(activeDays, frozenDays, today),
    [activeDays, frozenDays, today],
  );

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
        freezable: date === freezableDay,
        isToday: date === today,
      });
    }
    return result;
  }, [activeDays, frozenDays, freezableDay, today]);

  return {
    currentStreak,
    longestStreak,
    lastActiveDate,
    activeDays,
    frozenDays,
    freezableDay,
    week,
    loading,
    syncStreak,
    freezeDay,
  };
}