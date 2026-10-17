# Dark Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить переключатель оформления (светлая / тёмная / системная) в топ-бар приложения, применив тёмную тему через переопределение CSS-переменных Tailwind v4 без правок 36 компонентов-потребителей цвета.

**Architecture:** Светлая тема остаётся в `@theme`/`:root`; тёмная живёт в скоупе `:root[data-theme="dark"]`, где переопределяются те же `--color-*` и семантические переменные. CSS знает только `light`/`dark`; «система» разрешается в JS. No-flash скрипт через `next/script` `beforeInteractive`. Переключатель — своя SVG-иконка + меню из трёх пунктов, через React-контекст.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, `motion`, `lucide-react`, Vitest (node).

## Global Constraints

- Никаких новых зависимостей. Использовать существующие: `motion`, `lucide-react`, `next/script`.
- Тесты: только `src/**/*.test.ts`, окружение `node` (без jsdom/tsx). Компоненты тестируются вручную.
- Не комментировать код (в проекте нет комментариев в TSX/CSS).
- Не менять 36 компонентов-потребителей цветов.
- Не трогать `src/app/icon.svg`, `src/app/app-icons.test.ts`, `src/app/manifest.ts`.
- UI-копирайтинг — на русском, как в проекте.
- Ключ localStorage: `theme`. Значение по умолчанию: `system`. Варианты: `light` | `dark` | `system`.
- No-flash скрипт ставит `data-theme` и `color-scheme` на `<html>`.
- Проверка каждой задачи заканчивается `npm run lint && npm run typecheck && npm test` там, где задача меняет TS/TSX/CSS.
- Файлы спеки: `docs/superpowers/specs/2026-10-17-dark-theme-design.md`.

---

### Task 1: Логика темы

**Files:**
- Create: `src/lib/theme.ts`
- Test: `src/lib/theme.test.ts`

**Interfaces:**
- Consumes: ничего.
- Produces:
  - `type ThemePreference = "light" | "dark" | "system"`
  - `type ResolvedTheme = "light" | "dark"`
  - `const THEME_STORAGE_KEY = "theme"`
  - `const DEFAULT_PREFERENCE: ThemePreference = "system"`
  - `const THEME_COLORS: Record<ResolvedTheme, string>`
  - `function isThemePreference(v: unknown): v is ThemePreference`
  - `function parseStoredTheme(raw: string | null): ThemePreference`
  - `function resolveTheme(p: ThemePreference, prefersDark: boolean): ResolvedTheme`
  - `const NO_FLASH_SCRIPT: string`

- [ ] **Step 1: Написать падающий тест**

Create `src/lib/theme.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  DEFAULT_PREFERENCE,
  NO_FLASH_SCRIPT,
  THEME_COLORS,
  THEME_STORAGE_KEY,
  isThemePreference,
  parseStoredTheme,
  resolveTheme,
} from "@/lib/theme";

describe("isThemePreference", () => {
  it("accepts the three preferences", () => {
    expect(isThemePreference("light")).toBe(true);
    expect(isThemePreference("dark")).toBe(true);
    expect(isThemePreference("system")).toBe(true);
  });

  it("rejects other values", () => {
    expect(isThemePreference("blue")).toBe(false);
    expect(isThemePreference(null)).toBe(false);
    expect(isThemePreference(undefined)).toBe(false);
    expect(isThemePreference(1)).toBe(false);
  });
});

describe("parseStoredTheme", () => {
  it("returns a valid stored value", () => {
    expect(parseStoredTheme("dark")).toBe("dark");
  });

  it("falls back to the default for invalid or missing values", () => {
    expect(parseStoredTheme(null)).toBe(DEFAULT_PREFERENCE);
    expect(parseStoredTheme("garbage")).toBe(DEFAULT_PREFERENCE);
    expect(DEFAULT_PREFERENCE).toBe("system");
  });
});

describe("resolveTheme", () => {
  it("resolves explicit preferences regardless of system", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("follows the system preference", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
  });
});

describe("THEME_COLORS", () => {
  it("exposes a color per resolved theme", () => {
    expect(THEME_COLORS.light).toBe("#faf9f5");
    expect(THEME_COLORS.dark).toBe("#16140f");
  });
});

describe("NO_FLASH_SCRIPT", () => {
  it("reads the storage key and handles system", () => {
    expect(NO_FLASH_SCRIPT).toContain(THEME_STORAGE_KEY);
    expect(NO_FLASH_SCRIPT).toContain("prefers-color-scheme: dark");
    expect(NO_FLASH_SCRIPT).toContain("data-theme");
  });
});
```

- [ ] **Step 2: Запустить тест — убедиться, что падает**

Run: `npx vitest run src/lib/theme.test.ts`
Expected: FAIL — `Failed to resolve import "@/lib/theme"`.

- [ ] **Step 3: Реализовать модуль**

Create `src/lib/theme.ts`:

```ts
export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";
export const DEFAULT_PREFERENCE: ThemePreference = "system";

export const THEME_COLORS: Record<ResolvedTheme, string> = {
  light: "#faf9f5",
  dark: "#16140f",
};

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

export function parseStoredTheme(raw: string | null): ThemePreference {
  return isThemePreference(raw) ? raw : DEFAULT_PREFERENCE;
}

export function resolveTheme(
  preference: ThemePreference,
  prefersDark: boolean
): ResolvedTheme {
  if (preference === "system") {
    return prefersDark ? "dark" : "light";
  }
  return preference;
}

export const NO_FLASH_SCRIPT = `(function(){try{var k=${JSON.stringify(
  THEME_STORAGE_KEY
)};var p=localStorage.getItem(k);if(p!=="light"&&p!=="dark"&&p!=="system"){p="system";}var d=window.matchMedia("(prefers-color-scheme: dark)").matches;var t=p==="system"?(d?"dark":"light"):p;var e=document.documentElement;e.setAttribute("data-theme",t);e.style.colorScheme=t;}catch(e){}})();`;
```

- [ ] **Step 4: Запустить тест — убедиться, что проходит**

Run: `npx vitest run src/lib/theme.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/theme.ts src/lib/theme.test.ts
git commit -m "feat: add theme preference logic and no-flash script"
```

---

### Task 2: CSS — семантические переменные и тёмный скоуп

**Files:**
- Modify: `src/app/globals.css`
- Test: `src/app/globals-theme.test.ts`

**Interfaces:**
- Consumes: ничего (значения темы).
- Produces: CSS-переменные `--bg`, `--fg`, `--surface`, `--surface-border`,
  `--panel-border`, `--grid-line`, `--scroll-track`, `--scroll-thumb`,
  `--scroll-thumb-hover`, `--focus-ring`, `--selection-bg`; тёмный скоуп
  `:root[data-theme="dark"], :root.dark`.

- [ ] **Step 1: Написать падающий тест**

Create `src/app/globals-theme.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const css = readFileSync(resolve(process.cwd(), "src", "app", "globals.css"), "utf8");

describe("globals.css theming", () => {
  it("defines a dark theme scope", () => {
    expect(css).toContain('[data-theme="dark"]');
  });

  it("overrides the neutral scale inside the dark scope", () => {
    expect(css).toContain("--color-slate-950: #16140f;");
    expect(css).toContain("--color-white: #f2f0e9;");
  });

  it("drives body from semantic variables", () => {
    expect(css).toContain("background-color: var(--bg);");
    expect(css).toContain("color: var(--fg);");
  });

  it("declares a color-scheme per theme", () => {
    expect(css).toContain("color-scheme: light;");
    expect(css).toContain("color-scheme: dark;");
  });
});
```

- [ ] **Step 2: Запустить тест — убедиться, что падает**

Run: `npx vitest run src/app/globals-theme.test.ts`
Expected: FAIL — нет `[data-theme="dark"]`, нет `--color-slate-950: #16140f;`.

- [ ] **Step 3: Добавить семантические переменные и тёмный скоуп**

In `src/app/globals.css`, replace the entire `@layer base { ... }` block
(currently lines 253–314) with:

```css
@layer base {
  :root {
    color-scheme: light;
    --bg: #faf9f5;
    --fg: #1a1915;
    --surface: #fdfcf9;
    --surface-border: rgba(26, 25, 21, 0.12);
    --panel-border: rgba(26, 25, 21, 0.2);
    --grid-line: rgba(26, 25, 21, 0.035);
    --scroll-track: #f0eee6;
    --scroll-thumb: #dbd8cc;
    --scroll-thumb-hover: #c9c5b6;
    --focus-ring: rgba(193, 95, 60, 0.7);
    --selection-bg: rgba(217, 119, 87, 0.28);
  }

  :root[data-theme="dark"],
  :root.dark {
    color-scheme: dark;

    --color-white: #f2f0e9;
    --color-slate-50: #faf9f5;
    --color-slate-100: #f2f0e9;
    --color-slate-200: #e9e6dc;
    --color-slate-300: #dbd8cc;
    --color-slate-400: #b0ac9f;
    --color-slate-500: #8f8b7e;
    --color-slate-600: #6f6c64;
    --color-slate-700: #3a3831;
    --color-slate-800: #2a2823;
    --color-slate-900: #201e1a;
    --color-slate-950: #16140f;

    --color-blue-300: #f0c3b0;
    --color-blue-400: #dd8263;
    --color-blue-500: #d97757;
    --color-blue-600: #e08968;

    --color-emerald-400: #7fc99f;
    --color-emerald-500: #5fb886;
    --color-emerald-600: #6fbf8f;
    --color-green-400: #7fc99f;

    --color-orange-400: #e0995c;
    --color-orange-500: #dd8a4f;
    --color-orange-600: #e89a5c;

    --color-cyan-500: #3f9d9d;
    --color-cyan-600: #4fb0b0;

    --color-sky-300: #7fb0cf;

    --color-amber-400: #e0b451;
    --color-amber-500: #e0b451;
    --color-amber-600: #d9a93f;

    --color-yellow-400: #dcb455;
    --color-yellow-500: #d9b23f;

    --color-purple-400: #bd8fd6;

    --color-red-300: #e58b80;
    --color-red-400: #e07a6e;
    --color-red-500: #e07a6e;

    --bg: #16140f;
    --fg: #f2f0e9;
    --surface: #1c1b17;
    --surface-border: rgba(242, 240, 233, 0.1);
    --panel-border: rgba(242, 240, 233, 0.18);
    --grid-line: rgba(242, 240, 233, 0.04);
    --scroll-track: #201e1a;
    --scroll-thumb: #3a3831;
    --scroll-thumb-hover: #4a4842;
    --focus-ring: rgba(224, 138, 104, 0.8);
    --selection-bg: rgba(217, 119, 87, 0.3);
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: var(--font-sans);
    isolation: isolate;
    background-color: var(--bg);
    color: var(--fg);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-y: scroll;
  }

  body::before {
    content: "";
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background-image:
      linear-gradient(var(--grid-line) 1px, transparent 1px),
      linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
    background-size: 24px 24px;
  }

  ::selection {
    background: var(--selection-bg);
    color: var(--fg);
  }

  :focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: 2px;
  }

  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  ::-webkit-scrollbar-track {
    background: var(--scroll-track);
  }
  ::-webkit-scrollbar-thumb {
    background: var(--scroll-thumb);
    border-radius: 9999px;
    border: 2px solid var(--scroll-track);
  }
  ::-webkit-scrollbar-thumb:hover {
    background: var(--scroll-thumb-hover);
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: var(--scroll-thumb) transparent;
  }
}
```

- [ ] **Step 4: Var-ифицировать утилиты**

In `src/app/globals.css`, replace the `card-surface`, `term-panel` and `prompt`
utility blocks (lines 323–336) with:

```css
@utility card-surface {
  background-color: var(--surface);
  border: 1px solid var(--surface-border);
}

@utility term-panel {
  background-color: var(--surface);
  border: 1px dashed var(--panel-border);
}

@utility prompt {
  color: var(--color-blue-600);
  font-weight: 600;
}
```

- [ ] **Step 5: Запустить тест — убедиться, что проходит**

Run: `npx vitest run src/app/globals-theme.test.ts`
Expected: PASS (4 теста).

- [ ] **Step 6: Проверить сборку CSS Tailwind**

Run: `npm run build`
Expected: сборка успешна.

Run: `rg -n "var\(--color-slate-950\)" .next/static/css | head`
Expected: строки найдены — утилиты ссылаются на `var(--color-*)`, значит
переопределение переменных в тёмном скоупе перекрашивает весь UI.

- [ ] **Step 7: Commit**

```bash
git add src/app/globals.css src/app/globals-theme.test.ts
git commit -m "feat: add dark theme palette via CSS variable overrides"
```

---

### Task 3: ThemeProvider и wiring корневого layout

**Files:**
- Create: `src/components/shared/ThemeProvider.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes из Task 1 (`@/lib/theme`): `DEFAULT_PREFERENCE`, `parseStoredTheme`,
  `resolveTheme`, `THEME_COLORS`, `THEME_STORAGE_KEY`, `NO_FLASH_SCRIPT`,
  `ThemePreference`, `ResolvedTheme`.
- Produces:
  - `export function useTheme(): { preference: ThemePreference; resolvedTheme: ResolvedTheme; setTheme: (p: ThemePreference) => void }`
  - `export default function ThemeProvider({ children }: { children: React.ReactNode })`
  - `<html>` с `suppressHydrationWarning`, no-flash `Script`, `viewport.themeColor` массив, `<ThemeProvider>` вокруг дерева.

- [ ] **Step 1: Реализовать провайдер**

Create `src/components/shared/ThemeProvider.tsx`:

```tsx
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
    document.head.prepend(meta);
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
```

- [ ] **Step 2: Обновить корневой layout**

Replace `src/app/layout.tsx` with:

```tsx
import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { NO_FLASH_SCRIPT } from "@/lib/theme";
import ThemeProvider from "@/components/shared/ThemeProvider";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Android Developer Skill Tree",
  description: "Интерактивная платформа оценки и развития Android-разработчика",
  appleWebApp: {
    capable: true,
    title: "Android Skill Tree",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f5" },
    { media: "(prefers-color-scheme: dark)", color: "#16140f" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      className={jetbrainsMono.variable}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <Script id="theme-init" strategy="beforeInteractive">
          {NO_FLASH_SCRIPT}
        </Script>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Типы, линт, тесты**

Run: `npm run lint && npm run typecheck && npm test`
Expected: всё зелёное.

- [ ] **Step 4: Проверить no-flash и системный режим вручную**

Run: `npm run dev` (отдельный терминал)

В браузере: DevTools → Application → Local Storage → добавить `theme = dark`,
перезагрузить. Ожидаемо: страница сразу тёмная, без вспышки светлого.
Повторить с `theme = light`. Удалить ключ → интерфейс следует теме ОС.

- [ ] **Step 5: Commit**

```bash
git add src/components/shared/ThemeProvider.tsx src/app/layout.tsx
git commit -m "feat: add ThemeProvider, no-flash script and viewport metadata"
```

---

### Task 4: SVG-иконка темы

**Files:**
- Create: `src/components/shared/ThemeIcon.tsx`

**Interfaces:**
- Consumes: `ResolvedTheme` из `@/lib/theme`.
- Produces: `export default function ThemeIcon({ theme, className }: { theme: ResolvedTheme; className?: string })`.

- [ ] **Step 1: Реализовать иконку**

Create `src/components/shared/ThemeIcon.tsx`:

```tsx
import type { ResolvedTheme } from "@/lib/theme";

interface ThemeIconProps {
  theme: ResolvedTheme;
  className?: string;
}

export default function ThemeIcon({ theme, className }: ThemeIconProps) {
  if (theme === "dark") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-hidden
        focusable="false"
      >
        <path
          d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
      focusable="false"
    >
      <circle cx="12" cy="12" r="4.25" stroke="currentColor" strokeWidth="1.75" />
      <g stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
        <path d="M12 2.5v2.2" />
        <path d="M12 19.3v2.2" />
        <path d="M2.5 12h2.2" />
        <path d="M19.3 12h2.2" />
        <path d="M5.2 5.2l1.6 1.6" />
        <path d="M17.2 17.2l1.6 1.6" />
        <path d="M18.8 5.2l-1.6 1.6" />
        <path d="M6.8 17.2l-1.6 1.6" />
      </g>
    </svg>
  );
}
```

- [ ] **Step 2: Типы и линт**

Run: `npm run typecheck && npm run lint`
Expected: без ошибок.

- [ ] **Step 3: Commit**

```bash
git add src/components/shared/ThemeIcon.tsx
git commit -m "feat: add custom light/dark theme icon"
```

---

### Task 5: Переключатель и интеграция в Header

**Files:**
- Create: `src/components/shared/ThemeToggle.tsx`
- Modify: `src/components/shared/Header.tsx`

**Interfaces:**
- Consumes: `useTheme` из `@/components/shared/ThemeProvider` (Task 3);
  `ThemeIcon` (Task 4); `ThemePreference` из `@/lib/theme`.
- Produces: `export default function ThemeToggle()`; `<ThemeToggle />` в правом
  кластере действий `Header`.

- [ ] **Step 1: Реализовать переключатель**

Create `src/components/shared/ThemeToggle.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import ThemeIcon from "@/components/shared/ThemeIcon";
import { useTheme } from "@/components/shared/ThemeProvider";
import type { ThemePreference } from "@/lib/theme";

const OPTIONS: {
  value: ThemePreference;
  label: string;
  icon: LucideIcon;
}[] = [
  { value: "light", label: "Светлая", icon: Sun },
  { value: "dark", label: "Тёмная", icon: Moon },
  { value: "system", label: "Системная", icon: Monitor },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ThemeToggle() {
  const { preference, resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <motion.button
        ref={buttonRef}
        type="button"
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((value) => !value)}
        aria-label="Тема оформления"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-mono text-xs text-slate-400 transition-colors hover:bg-blue-500/10 hover:text-blue-600"
      >
        <ThemeIcon theme={resolvedTheme} className="h-4 w-4" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="Тема оформления"
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14, ease: EASE }}
            className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-44 overflow-hidden rounded-md border border-slate-700/70 bg-slate-950/95 p-1 shadow-[0_10px_30px_rgba(26,25,21,0.18)] backdrop-blur-xl"
          >
            {OPTIONS.map((option) => {
              const active = preference === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => {
                    setTheme(option.value);
                    setOpen(false);
                    buttonRef.current?.focus();
                  }}
                  className={`flex w-full items-center gap-2 rounded-sm px-2.5 py-1.5 font-mono text-xs transition-colors ${
                    active
                      ? "text-blue-600"
                      : "text-slate-400 hover:bg-blue-500/10 hover:text-blue-600"
                  }`}
                >
                  <option.icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="flex-1 text-left">{option.label}</span>
                  {active && <Check className="h-3.5 w-3.5 shrink-0" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Вставить в Header**

In `src/components/shared/Header.tsx`:

1. Добавить импорт после строки
   `import BrandMark from "@/components/shared/BrandMark";`:

```tsx
import ThemeToggle from "@/components/shared/ThemeToggle";
```

2. В правом кластере действий заменить

```tsx
            <div className="ml-auto flex shrink-0 items-center gap-2">
              {!loading && user && <StreakBadge />}
```

на

```tsx
            <div className="ml-auto flex shrink-0 items-center gap-2">
              <ThemeToggle />
              {!loading && user && <StreakBadge />}
```

- [ ] **Step 3: Типы, линт, тесты**

Run: `npm run lint && npm run typecheck && npm test`
Expected: всё зелёное.

- [ ] **Step 4: Ручная проверка в браузере**

Run: `npm run dev`

Проверить матрицу:
- Три раскладки: широкий экран (`nav-lg` сайдбар), средний (`nav-md` рейл),
  телефон (нижний бар). Кнопка темы видна в топ-баре во всех.
- Меню открывается под кнопкой, 3 пункта, галочка на активном.
- «Тёмная» → весь интерфейс тёмный, `theme-color` в DevTools обновился.
- «Светлая» при тёмной ОС → светлый интерфейс.
- «Системная» → следует за ОС; смена темы ОС на лету меняет интерфейс.
- Escape и клик вне закрывают меню; фокус возвращается на кнопку.
- Перезагрузка без вспышки, выбор сохраняется.
- Страница `/login` (без переключателя) применяет выбранную тему.

- [ ] **Step 5: Commit**

```bash
git add src/components/shared/ThemeToggle.tsx src/components/shared/Header.tsx
git commit -m "feat: add theme toggle menu to header"
```

---

### Task 6: Финальная проверка

**Files:**
- No code changes expected (только если проверки выявят дефекты).

- [ ] **Step 1: Полный прогон проверок**

Run: `npm run lint && npm run typecheck && npm test`
Expected: всё зелёное, включая `theme.test.ts` и `globals-theme.test.ts`.

- [ ] **Step 2: Проверить, что компоненты-потребители цвета не изменены**

Run: `git diff --stat HEAD~5 -- src/components`
Expected: изменён только `src/components/shared/Header.tsx` (плюс новые файлы
`ThemeProvider.tsx`, `ThemeToggle.tsx`, `ThemeIcon.tsx`). Ни один из 36
компонентов с `slate-*` не затронут. (Если в истории ветки коммитов не 5 —
подставь нужное число, ориентируясь на `git log --oneline`.)

- [ ] **Step 3: Проверить продакшн-сборку**

Run: `npm run build`
Expected: успешная сборка.

- [ ] **Step 4: Сообщить о результате**

Если всё зелёное — работа завершена. Если что-то падает, зафиксировать
воспроизведение и чинить отдельным коммитом.
