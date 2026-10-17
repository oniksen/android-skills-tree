"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  DEFAULT_PREFERENCE,
  parseStoredTheme,
  resolveTheme,
  THEME_COLORS,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemePreference,
} from "@/lib/theme";

interface ThemeContextValue {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setTheme: (preference: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const listeners = new Set<() => void>();

function getSystemMediaQuery(): MediaQueryList | null {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)");
  } catch {
    return null;
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const mql = getSystemMediaQuery();
  mql?.addEventListener("change", listener);
  return () => {
    listeners.delete(listener);
    mql?.removeEventListener("change", listener);
  };
}

function systemPrefersDark(): boolean {
  return getSystemMediaQuery()?.matches ?? false;
}

function readPreference(): ThemePreference {
  try {
    return parseStoredTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return DEFAULT_PREFERENCE;
  }
}

function getPreferenceSnapshot(): ThemePreference {
  return readPreference();
}

function getResolvedSnapshot(): ResolvedTheme {
  return resolveTheme(readPreference(), systemPrefersDark());
}

function getServerPreferenceSnapshot(): ThemePreference {
  return DEFAULT_PREFERENCE;
}

function getServerResolvedSnapshot(): ResolvedTheme {
  return "light";
}

function applyTheme(theme: ResolvedTheme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;

  let meta = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]:not([media])'
  );
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  meta.content = THEME_COLORS[theme];
}

function clearOverrideMeta() {
  document
    .querySelectorAll('meta[name="theme-color"]:not([media])')
    .forEach((el) => el.remove());
}

function writePreference(next: ThemePreference) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    return;
  }
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const preference = useSyncExternalStore(
    subscribe,
    getPreferenceSnapshot,
    getServerPreferenceSnapshot
  );
  const resolvedTheme = useSyncExternalStore(
    subscribe,
    getResolvedSnapshot,
    getServerResolvedSnapshot
  );

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", resolvedTheme);
    root.style.colorScheme = resolvedTheme;

    if (preference === "system") {
      clearOverrideMeta();
    } else {
      applyTheme(resolvedTheme);
    }
  }, [preference, resolvedTheme]);

  const setTheme = useCallback((next: ThemePreference) => {
    writePreference(next);
    listeners.forEach((listener) => listener());
  }, []);

  const value = useMemo(
    () => ({ preference, resolvedTheme, setTheme }),
    [preference, resolvedTheme, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
