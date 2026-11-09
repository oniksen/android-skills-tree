import { createLiveStore } from "./live-store";
import { registerSessionReset } from "./session-reset";
import { clearAchievementsCache } from "./achievement-cache";
import { clearUserStateCache } from "@/adapters/firestore-client/state";
import type { UserState } from "@/types";

export const userStateStore = createLiveStore<UserState>();

registerSessionReset(() => {
  userStateStore.disposeAll();
  clearUserStateCache();
  clearAchievementsCache();
});

export function setCachedUserState(uid: string, state: UserState): void {
  userStateStore.set(uid, state);
}

export function patchCachedUserState(uid: string, patch: Partial<UserState>): void {
  const current = userStateStore.peek(uid).data;
  if (!current) return;
  userStateStore.set(uid, { ...current, ...patch });
}