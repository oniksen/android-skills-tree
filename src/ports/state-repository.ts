import type { Observer, Unsubscribe } from "./observation";
import type { UserState } from "@/types";

export interface StateRepository {
  subscribe(uid: string, observer: Observer<UserState>): Unsubscribe;
}