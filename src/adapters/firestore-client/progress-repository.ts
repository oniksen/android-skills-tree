import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { userProgressPath } from "./paths";
import type { ProgressRepository } from "@/ports/progress-repository";
import type { UserProgress } from "@/types";

export const DEFAULT_USER_PROGRESS: UserProgress = {
  currentLevelId: "junior",
  unlockedLevelIds: ["junior"],
  totalScore: 0,
};

export function createProgressRepository(): ProgressRepository {
  return {
    subscribe(uid, observer) {
      const ref = doc(db, ...userProgressPath(uid));
      return onSnapshot(
        ref,
        (snapshot) => {
          observer.next(
            snapshot.exists()
              ? (snapshot.data() as UserProgress)
              : DEFAULT_USER_PROGRESS,
          );
        },
        (error) => observer.error?.(error),
      );
    },
  };
}
