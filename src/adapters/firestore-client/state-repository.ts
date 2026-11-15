import { subscribeUserState } from "./state";
import type { StateRepository } from "@/ports/state-repository";

export function createStateRepository(): StateRepository {
  return {
    subscribe(uid, observer) {
      return subscribeUserState(uid, observer);
    },
  };
}