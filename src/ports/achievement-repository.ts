import type { Achievement } from "@/types";
import type { Observer, Unsubscribe } from "./observation";

export interface AchievementRepository {
  subscribe(uid: string, observer: Observer<Achievement[]>): Unsubscribe;
}
