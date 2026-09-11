"use client";

import { auth, db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  setDoc,
} from "firebase/firestore";

export interface StreakData {
  activeDays: string[];
  lastActiveDate: string;
  currentStreak: number;
  longestStreak: number;
  updatedAt: Date;
}

export const STREAK_ACHIEVEMENT_DAYS = [7, 30, 60, 100];

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function getLocalDayString(date: Date = new Date()): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function parseDayString(day: string): Date {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function shiftDay(day: string, delta: number): string {
  const date = parseDayString(day);
  date.setDate(date.getDate() + delta);
  return getLocalDayString(date);
}

export function computeStreaks(
  activeDays: string[],
  today: string,
): { currentStreak: number; longestStreak: number } {
  const daysSet = new Set(activeDays);

  let longestStreak = 0;
  const unique = Array.from(new Set(activeDays)).sort();
  let run = 0;
  let prev: string | null = null;
  for (const day of unique) {
    if (prev !== null && shiftDay(prev, 1) === day) {
      run += 1;
    } else {
      run = 1;
    }
    if (run > longestStreak) longestStreak = run;
    prev = day;
  }

  let cursor = today;
  if (!daysSet.has(today)) {
    const yesterday = shiftDay(today, -1);
    if (!daysSet.has(yesterday)) return { currentStreak: 0, longestStreak };
    cursor = yesterday;
  }

  let current = 0;
  while (daysSet.has(cursor)) {
    current += 1;
    cursor = shiftDay(cursor, -1);
  }

  return { currentStreak: current, longestStreak };
}

export async function getStreak(uid: string): Promise<StreakData | null> {
  const streakRef = doc(db, "users", uid, "streaks", "current");
  const snap = await getDoc(streakRef);
  if (!snap.exists()) return null;
  const data = snap.data() as Omit<StreakData, "updatedAt"> & {
    updatedAt?: { toDate?: () => Date };
  };
  return {
    ...data,
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : (data.updatedAt as Date),
  };
}

export async function syncStreak(): Promise<StreakData | null> {
  const user = auth.currentUser;
  if (!user) return null;

  const today = getLocalDayString();
  const streakRef = doc(db, "users", user.uid, "streaks", "current");

  try {
    const result = await runTransaction(db, async (tx) => {
      const snap = await tx.get(streakRef);
      const existing = snap.exists() ? (snap.data() as Partial<StreakData>) : {};
      const activeDays = Array.isArray(existing.activeDays) ? existing.activeDays : [];
      const { currentStreak, longestStreak } = computeStreaks(activeDays, today);

      if (activeDays.includes(today)) {
        return {
          activeDays,
          lastActiveDate: existing.lastActiveDate ?? today,
          currentStreak,
          longestStreak,
          updatedAt: existing.updatedAt ?? new Date(),
        } as StreakData;
      }

      const nextActiveDays = [...activeDays, today];
      const data: StreakData = {
        activeDays: nextActiveDays,
        lastActiveDate: today,
        currentStreak,
        longestStreak,
        updatedAt: new Date(),
      };
      tx.set(streakRef, data);
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
  const achievementsRef = collection(db, "users", uid, "achievements");
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