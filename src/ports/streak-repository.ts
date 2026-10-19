import type { Observer, Unsubscribe } from "./observation";

export interface StreakSnapshot {
  activeDays: string[];
  frozenDays: string[];
  lastActiveDate: string | null;
}

export interface StreakRepository {
  subscribe(uid: string, observer: Observer<StreakSnapshot | null>): Unsubscribe;
}
