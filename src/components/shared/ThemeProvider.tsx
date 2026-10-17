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

interface ThemeContextValue {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
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
  const [preference, setPreference] =
    useState<ThemePreference>(DEFAULT_PREFERENCE);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  useEffect(() => {
    const stored = parseStoredTheme(
      window.localStorage.getItem(THEME_STORAGE_KEY)
    );
    const resolved = resolveTheme(stored, systemPrefersDark());
    setPreference(stored);
    setResolvedTheme(resolved);

    if (stored === "system") {
      clearOverrideMeta();
      const root = document.documentElement;
      root.setAttribute("data-theme", resolved);
      root.style.colorScheme = resolved;
    } else {
      applyTheme(resolved);
    }
  }, []);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (preference !== "system") return;
      const resolved = resolveTheme("system", mql.matches);
      setResolvedTheme(resolved);
      const root = document.documentElement;
      root.setAttribute("data-theme", resolved);
      root.style.colorScheme = resolved;
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [preference]);

  const setTheme = useCallback((next: ThemePreference) => {
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
    setPreference(next);
    const resolved = resolveTheme(next, systemPrefersDark());
    setResolvedTheme(resolved);

    if (next === "system") {
      clearOverrideMeta();
      const root = document.documentElement;
      root.setAttribute("data-theme", resolved);
      root.style.colorScheme = resolved;
    } else {
      applyTheme(resolved);
    }
  }, []);

  const value = useMemo(
    () => ({ preference, resolvedTheme, setTheme }),
    [preference, resolvedTheme, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
