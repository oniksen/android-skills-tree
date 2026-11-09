import type { Achievement } from "@/types";

const cache = new Map<string, Achievement[]>();

export function setAchievementsCache(uid: string, achievements: Achievement[]): void {
  cache.set(uid, achievements);
}

export function getAchievementsCache(uid: string): Achievement[] | null {
  const value = cache.get(uid);
  return value === undefined ? null : value;
}

export function clearAchievementsCache(uid?: string): void {
  if (uid === undefined) {
    cache.clear();
  } else {
    cache.delete(uid);
  }
}
