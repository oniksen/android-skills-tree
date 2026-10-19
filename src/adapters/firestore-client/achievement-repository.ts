import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { userAchievementsPath } from "./paths";
import type { AchievementRepository } from "@/ports/achievement-repository";
import type { Achievement } from "@/types";

export function createAchievementRepository(): AchievementRepository {
  return {
    subscribe(uid, observer) {
      const ref = collection(db, ...userAchievementsPath(uid));
      return onSnapshot(
        ref,
        (snapshot) => {
          const list: Achievement[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            list.push({
              id: doc.id,
              type: data.type,
              metadata: data.metadata,
              achievedAt: data.achievedAt?.toDate() ?? new Date(),
            });
          });
          list.sort((a, b) => b.achievedAt.getTime() - a.achievedAt.getTime());
          observer.next(list);
        },
        (error) => observer.error?.(error),
      );
    },
  };
}
