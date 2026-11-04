export interface OnceStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/**
 * Builds a guard that returns `true` exactly once per key.
 * Falls back to an in-memory set when storage is missing or throws
 * (private mode, SSR, blocked cookies).
 */
export function createOncePerSession(
  storage: OnceStorage | null,
): (key: string) => boolean {
  const memory = new Set<string>();

  return (key: string): boolean => {
    const storageKey = `once-per-session:${key}`;

    if (storage) {
      try {
        if (storage.getItem(storageKey) !== null) return false;
        storage.setItem(storageKey, "1");
        return true;
      } catch {
        // fall through to the in-memory guard
      }
    }

    if (memory.has(storageKey)) return false;
    memory.add(storageKey);
    return true;
  };
}

function getSessionStorage(): OnceStorage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export const oncePerSession = createOncePerSession(getSessionStorage());
