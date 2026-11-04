"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useServices } from "@/composition/services-context";
import type { AuthState } from "@/ports/auth-state-provider";
import { getAuthStore } from "@/shared/lib/auth-store";

export function useFirebaseAuth(): AuthState {
  const { auth } = useServices();
  const store = useMemo(() => getAuthStore(auth), [auth]);

  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
}
