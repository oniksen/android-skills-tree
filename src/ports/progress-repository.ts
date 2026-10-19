import type { UserProgress } from "@/types";
import type { Observer, Unsubscribe } from "./observation";

export interface ProgressRepository {
  subscribe(uid: string, observer: Observer<UserProgress | null>): Unsubscribe;
}
