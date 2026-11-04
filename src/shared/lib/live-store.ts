import type { Observer, Unsubscribe } from "@/ports/observation";

export interface LiveSnapshot<T> {
  data: T | undefined;
  loading: boolean;
  error: unknown | null;
}

export interface LiveStoreOptions {
  /**
   * How long to keep the live subscription after the last consumer left.
   * Omit to keep it for the whole session (one subscription per user per domain).
   */
  idleTtlMs?: number;
}

export interface LiveStore<T> {
  /** Stable snapshot object, safe for `useSyncExternalStore`. */
  peek(key: string): LiveSnapshot<T>;
  subscribe(
    key: string,
    start: (observer: Observer<T>) => Unsubscribe,
    onChange: () => void,
  ): Unsubscribe;
  /** Applies an optimistic value to an existing entry (no-op for unknown keys). */
  set(key: string, data: T): void;
  dispose(key: string): void;
  disposeAll(): void;
  getServerSnapshot(): LiveSnapshot<T>;
}

interface Entry<T> {
  snapshot: LiveSnapshot<T>;
  observers: Set<() => void>;
  stop: Unsubscribe | null;
  idleTimer: ReturnType<typeof setTimeout> | null;
}

export function createLiveStore<T>(
  options: LiveStoreOptions = {},
): LiveStore<T> {
  const entries = new Map<string, Entry<T>>();
  // Server snapshot must be referentially stable for useSyncExternalStore.
  const serverSnapshot: LiveSnapshot<T> = {
    data: undefined,
    loading: true,
    error: null,
  };

  function notify(entry: Entry<T>) {
    entry.observers.forEach((onChange) => onChange());
  }

  function stopEntry(key: string) {
    const entry = entries.get(key);
    if (!entry) return;
    if (entry.idleTimer) clearTimeout(entry.idleTimer);
    entry.idleTimer = null;
    entry.stop?.();
    entry.stop = null;
    entries.delete(key);
  }

  function ensure(
    key: string,
    start: (observer: Observer<T>) => Unsubscribe,
  ): Entry<T> {
    const existing = entries.get(key);
    if (existing) {
      if (existing.idleTimer) {
        clearTimeout(existing.idleTimer);
        existing.idleTimer = null;
      }
      return existing;
    }

    const entry: Entry<T> = {
      snapshot: { data: undefined, loading: true, error: null },
      observers: new Set(),
      stop: null,
      idleTimer: null,
    };
    entries.set(key, entry);

    try {
      entry.stop = start({
        next: (data) => {
          entry.snapshot = { data, loading: false, error: null };
          notify(entry);
        },
        error: (error) => {
          // Keep the last good data so a transient failure does not blank the UI.
          entry.snapshot = { data: entry.snapshot.data, loading: false, error };
          notify(entry);
        },
      });
    } catch (error) {
      entry.snapshot = {
        data: entry.snapshot.data,
        loading: false,
        error,
      };
    }

    return entry;
  }

  return {
    peek(key) {
      return entries.get(key)?.snapshot ?? serverSnapshot;
    },

    subscribe(key, start, onChange) {
      const entry = ensure(key, start);
      entry.observers.add(onChange);

      let active = true;
      return () => {
        if (!active) return;
        active = false;
        entry.observers.delete(onChange);

        if (entry.observers.size > 0) return;
        const ttl = options.idleTtlMs;
        if (ttl === undefined) return;

        if (entry.idleTimer) clearTimeout(entry.idleTimer);
        entry.idleTimer = setTimeout(() => stopEntry(key), ttl);
      };
    },

    set(key, data) {
      const entry = entries.get(key);
      if (!entry) return;
      entry.snapshot = { data, loading: false, error: null };
      notify(entry);
    },

    dispose(key) {
      stopEntry(key);
    },

    disposeAll() {
      Array.from(entries.keys()).forEach(stopEntry);
    },

    getServerSnapshot() {
      return serverSnapshot;
    },
  };
}
