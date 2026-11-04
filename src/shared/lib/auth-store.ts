import type { AuthState, AuthStateProvider } from "@/ports/auth-state-provider";
import type { Observer, Unsubscribe } from "@/ports/observation";
import { resetSession } from "./session-reset";

export interface AuthStore {
  subscribe(onChange: () => void): Unsubscribe;
  getSnapshot(): AuthState;
  getServerSnapshot(): AuthState;
  /** Stops the underlying subscription (used by tests and sign-out teardown). */
  dispose(): void;
}

export interface AuthStoreOptions {
  subscribe: (observer: Observer<AuthState>) => Unsubscribe;
  onUserChange?: (uid: string | null) => void;
}

/**
 * Holds a single `onAuthStateChanged` subscription for the whole tab and
 * replays the last known state to consumers that mount later.
 */
export function createAuthStore(options: AuthStoreOptions): AuthStore {
  const serverSnapshot: AuthState = { uid: null, email: null, loading: true };
  const listeners = new Set<() => void>();

  let snapshot = serverSnapshot;
  let stop: Unsubscribe | null = null;
  let lastUid: string | null | undefined;

  const notify = () => {
    listeners.forEach((onChange) => onChange());
  };

  const start = () => {
    if (stop) return;
    try {
      stop = options.subscribe({
        next: (state) => {
          if (lastUid !== undefined && state.uid !== lastUid) {
            options.onUserChange?.(state.uid);
          }
          lastUid = state.uid;
          snapshot = { ...state };
          notify();
        },
        error: () => {
          // Never leave consumers in `loading` forever when auth is unavailable.
          snapshot = { uid: null, email: null, loading: false };
          notify();
        },
      });
    } catch {
      snapshot = { uid: null, email: null, loading: false };
    }
  };

  return {
    subscribe(onChange) {
      listeners.add(onChange);
      start();
      return () => {
        listeners.delete(onChange);
      };
    },

    getSnapshot() {
      return snapshot;
    },

    getServerSnapshot() {
      return serverSnapshot;
    },

    dispose() {
      stop?.();
      stop = null;
      listeners.clear();
      snapshot = serverSnapshot;
      lastUid = undefined;
    },
  };
}

const stores = new WeakMap<AuthStateProvider, AuthStore>();

/** One auth store per service provider instance. */
export function getAuthStore(provider: AuthStateProvider): AuthStore {
  let store = stores.get(provider);
  if (!store) {
    store = createAuthStore({
      subscribe: (observer) => provider.subscribe(observer),
      onUserChange: () => resetSession(),
    });
    stores.set(provider, store);
  }
  return store;
}
