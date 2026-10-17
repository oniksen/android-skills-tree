import type { StreakData } from "@/types";

export type { StreakData };

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
  frozenDays: string[],
  today: string,
): { currentStreak: number; longestStreak: number } {
  const covered = Array.from(new Set([...activeDays, ...frozenDays])).sort();
  const daysSet = new Set(covered);

  let longestStreak = 0;
  let run = 0;
  let prev: string | null = null;
  for (const day of covered) {
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

export function collectMissedDays(
  activeDays: string[],
  frozenDays: string[],
  today: string,
): string[] {
  const covered = new Set([...activeDays, ...frozenDays]);
  if (covered.size === 0) return [];

  const missed: string[] = [];
  let cursor = shiftDay(today, -1);
  while (!covered.has(cursor)) {
    missed.push(cursor);
    cursor = shiftDay(cursor, -1);
  }

  return missed.reverse();
}

export interface AutoFreezeReport {
  frozen: string[];
  unfundedMisses: number;
}
