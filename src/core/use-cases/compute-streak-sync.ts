import { computeStreaks } from "@/core/domain/streak";
import type { StreakData } from "@/types";

export interface StreakSyncInput {
  today: string;
  existing: Partial<StreakData>;
}

export interface StreakSyncResult {
  changed: boolean;
  data: StreakData;
}

export function computeStreakSync({
  today,
  existing,
}: StreakSyncInput): StreakSyncResult {
  const activeDays = Array.isArray(existing.activeDays) ? existing.activeDays : [];
  const frozenDays = Array.isArray(existing.frozenDays) ? existing.frozenDays : [];
  const changed = !activeDays.includes(today);
  const nextActiveDays = changed ? [...activeDays, today] : activeDays;
  const { currentStreak, longestStreak } = computeStreaks(
    nextActiveDays,
    frozenDays,
    today,
  );

  return {
    changed,
    data: {
      activeDays: nextActiveDays,
      frozenDays,
      lastActiveDate: changed ? today : existing.lastActiveDate ?? today,
      currentStreak,
      longestStreak,
      updatedAt: changed ? new Date() : existing.updatedAt ?? new Date(),
    },
  };
}
