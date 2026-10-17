"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
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

interface ThemeState {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
}

interface ThemeContextValue extends ThemeState {
  setTheme: (preference: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function systemPrefersDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
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

function readPreference(): ThemePreference {
  if (typeof window === "undefined") return DEFAULT_PREFERENCE;
  return parseStoredTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
}

function initialState(): ThemeState {
  const preference = readPreference();
  return {
    preference,
    resolvedTheme: resolveTheme(preference, systemPrefersDark()),
  };
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<ThemeState>(initialState);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", state.resolvedTheme);
    root.style.colorScheme = state.resolvedTheme;

    if (state.preference === "system") {
      clearOverrideMeta();
    } else {
      applyTheme(state.resolvedTheme);
    }
  }, [state]);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (event: MediaQueryListEvent) => {
      setState((prev) =>
        prev.preference === "system"
          ? {
              preference: prev.preference,
              resolvedTheme: resolveTheme("system", event.matches),
            }
          : prev
      );
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const setTheme = useCallback((next: ThemePreference) => {
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
    setState({
      preference: next,
      resolvedTheme: resolveTheme(next, systemPrefersDark()),
    });
  }, []);

  const value = useMemo(
    () => ({
      preference: state.preference,
      resolvedTheme: state.resolvedTheme,
      setTheme,
    }),
    [state.preference, state.resolvedTheme, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
