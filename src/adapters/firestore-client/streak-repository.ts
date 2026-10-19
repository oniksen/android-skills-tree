import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { userStreakPath } from "./paths";
import type {
  StreakRepository,
  StreakSnapshot,
} from "@/ports/streak-repository";

export function createStreakRepository(): StreakRepository {
  return {
    subscribe(uid, observer) {
      const ref = doc(db, ...userStreakPath(uid));
      return onSnapshot(
        ref,
        (snapshot) => {
          if (!snapshot.exists()) {
            observer.next(null);
            return;
          }
          const data = snapshot.data();
          const result: StreakSnapshot = {
            activeDays: Array.isArray(data.activeDays) ? data.activeDays : [],
            frozenDays: Array.isArray(data.frozenDays) ? data.frozenDays : [],
            lastActiveDate: data.lastActiveDate ?? null,
          };
          observer.next(result);
        },
        (error) => observer.error?.(error),
      );
    },
  };
}
