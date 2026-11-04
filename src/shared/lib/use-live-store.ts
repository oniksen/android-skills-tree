"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Observer, Unsubscribe } from "@/ports/observation";
import type { LiveSnapshot, LiveStore } from "./live-store";

/**
 * Subscribes a component to a live store entry.
 *
 * `start` must be memoized (or null while there is no user): it is only called
 * once per key, and the subscription survives unmounts so the next page can
 * paint from the cached snapshot instead of a skeleton.
 */
export function useLiveStore<T>(
  store: LiveStore<T>,
  key: string | null,
  start: ((observer: Observer<T>) => Unsubscribe) | null,
): LiveSnapshot<T> {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!key || !start) return () => {};
      return store.subscribe(key, start, onChange);
    },
    [store, key, start],
  );

  const getSnapshot = useCallback(
    () => (key && start ? store.peek(key) : store.getServerSnapshot()),
    [store, key, start],
  );

  const getServerSnapshot = useCallback(
    () => store.getServerSnapshot(),
    [store],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
