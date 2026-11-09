"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useToast } from "@/shared/lib/toast-context";
import { isPermissionDenied } from "@/shared/lib/permission-denied";
import { isQuotaExceeded } from "@/shared/lib/quota";
import { registerSessionReset } from "@/shared/lib/session-reset";
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
  type StreakData,
} from "@/core/domain/streak";

export interface StreakDay {
  date: string;
  active: boolean;
  frozen: boolean;
  isToday: boolean;
}

const EMPTY_DAYS: string[] = [];

// Short-lived cache: several pages read the streak, but it changes at most once a day.
const STREAK_TTL_MS = 60_000;
const streakCache = new Map<string, { data: StreakData | null; fetchedAt: number }>();
const streakInFlight = new Map<string, Promise<StreakData | null>>();
registerSessionReset(() => streakCache.clear());
registerSessionReset(() => streakInFlight.clear());

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
  const showToast = toast.show;

  const applyStreak = useCallback((snapshot: StreakData | null) => {
    if (!snapshot) {
      setCurrentStreak(0);
      setLongestStreak(0);
      setLastActiveDate(null);
      setActiveDays([]);
      setFrozenDays([]);
      return;
    }

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
  }, []);

  const refreshStreak = useCallback(async () => {
    if (!uid) return;
    try {
      let inFlight = streakInFlight.get(uid);
      if (!inFlight) {
        inFlight = getStreakFirestore(uid)
          .then((snapshot) => {
            streakCache.set(uid, { data: snapshot, fetchedAt: Date.now() });
            return snapshot;
          })
          .finally(() => {
            streakInFlight.delete(uid);
          });
        streakInFlight.set(uid, inFlight);
      }
      const snapshot = await inFlight;
      applyStreak(snapshot);
    } catch (error) {
      console.error("Error loading streak:", error);
      if (isPermissionDenied(error)) {
        showToast("Для отслеживания прогресса обратитесь к администратору.");
      }
      if (isQuotaExceeded(error)) {
        showToast("Квота Firestore исчерпана. Повторите позже.");
      }
    } finally {
      setLoading(false);
    }
  }, [uid, showToast, applyStreak]);

  useEffect(() => {
    if (authLoading || !uid) return;

    const cached = streakCache.get(uid);
    if (cached && Date.now() - cached.fetchedAt < STREAK_TTL_MS) {
      const timer = setTimeout(() => {
        applyStreak(cached.data);
        setLoading(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      void refreshStreak();
    }, 0);
    return () => clearTimeout(timer);
  }, [uid, authLoading, refreshStreak, applyStreak]);

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



  const syncStreak = useCallback(async () => {
    if (!uid) return null;
    try {
      const result = await syncStreakFirestore();
      void refreshStreak();
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
  }, [uid, showToast, refreshStreak]);

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
