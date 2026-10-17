# Profile Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a profile screen that hosts account info, progress stats, achievements, section links, and settings (theme + logout), shown as a real page on mobile and a modal on large screens.

**Architecture:** One shared client component `ProfileContent` renders the profile body. A thin server route `/profile` renders it as a page (mobile / direct link); `ProfileModal` renders the same component in a portal for `≥600px`. The `Header` nav gains a `профиль` item that is a `Link` on mobile and a `Button` (opens the modal) on the rail/sidebar. Theme selection and logout move out of the header into `ProfileContent`.

**Tech Stack:** Next.js 16 (App Router) + React 19, TypeScript, Tailwind CSS v4, `motion` (motion/react), `lucide-react`, Firebase 12 (Auth + Firestore), Vitest (node env).

## Global Constraints

- Breakpoints (from `src/app/globals.css`): `nav-md` = 600px, `nav-lg` = 840px. Profile page↔modal boundary is **600px** (`nav-md`).
- Tests: `npm test` (vitest, `environment: "node"`, include `src/**/*.test.ts`, no jsdom/tsx). Only pure logic is unit-tested; UI is verified manually in `npm run dev`.
- `npm run lint` and `npm run typecheck` must pass.
- Do **not** add code comments.
- UI copy is Russian; visual style is `font-mono`, palette classes (`bg-slate-950` = page bg, `text-white` = primary text). Theme dark scope already exists.
- Domain logic lives in `src/lib` with a co-located `*.test.ts`.
- Commit style matches repo: `feat:`, `docs:`, `fix:`.
- Next.js is v16 with breaking changes: read `node_modules/next/dist/docs/` before using any Next API.

---

### Task 1: Branch + profile domain logic

**Files:**
- Create: `src/lib/profile.ts`
- Test: `src/lib/profile.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `ProfileInputs` = `{ xp: number; levelName: string; crystals: number; currentStreak: number; longestStreak: number; assessedSkills: number; totalSkills: number; completedProjects: number; totalProjects: number }`
  - `MatchableAchievement` = `{ id: string; matches: (a: { type: string; metadata: Record<string, unknown> }) => boolean }`
  - `ProfileSummary` = `ProfileInputs & { earnedAchievements: number; totalAchievements: number; earnedAchievementIds: string[] }`
  - `summarizeProfile(inputs: ProfileInputs, catalog: MatchableAchievement[], earned: { type: string; metadata: Record<string, unknown> }[]): ProfileSummary`

- [ ] **Step 1: Create the feature branch**

```bash
git checkout main
git pull --ff-only
git checkout -b feat/profile-page
```

Expected: `Switched to a new branch 'feat/profile-page'`

- [ ] **Step 2: Write the failing test**

Create `src/lib/profile.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { summarizeProfile, type ProfileInputs } from "./profile";

const inputs: ProfileInputs = {
  xp: 1200,
  levelName: "Middle",
  crystals: 40,
  currentStreak: 3,
  longestStreak: 9,
  assessedSkills: 12,
  totalSkills: 227,
  completedProjects: 2,
  totalProjects: 30,
};

const catalog = [
  { id: "level-up:junior-middle", matches: (a: { type: string }) => a.type === "level_up" },
  {
    id: "streak:7",
    matches: (a: { type: string; metadata: Record<string, unknown> }) =>
      a.type === "streak" && a.metadata.days === 7,
  },
  { id: "path-complete", matches: (a: { type: string }) => a.type === "path_complete" },
];

describe("summarizeProfile", () => {
  it("passes through the raw inputs", () => {
    const summary = summarizeProfile(inputs, [], []);
    expect(summary).toMatchObject(inputs);
  });

  it("counts earned achievements and returns their ids", () => {
    const earned = [
      { type: "level_up", metadata: {} },
      { type: "streak", metadata: { days: 7 } },
    ];
    const summary = summarizeProfile(inputs, catalog, earned);
    expect(summary.earnedAchievementIds).toEqual(["level-up:junior-middle", "streak:7"]);
    expect(summary.earnedAchievements).toBe(2);
    expect(summary.totalAchievements).toBe(3);
  });

  it("returns zeros for an empty catalog", () => {
    const summary = summarizeProfile(inputs, [], [{ type: "level_up", metadata: {} }]);
    expect(summary.earnedAchievementIds).toEqual([]);
    expect(summary.earnedAchievements).toBe(0);
    expect(summary.totalAchievements).toBe(0);
  });

  it("does not double count a definition matched by several achievements", () => {
    const earned = [
      { type: "streak", metadata: { days: 7 } },
      { type: "streak", metadata: { days: 7 } },
    ];
    const summary = summarizeProfile(inputs, catalog, earned);
    expect(summary.earnedAchievementIds).toEqual(["streak:7"]);
    expect(summary.earnedAchievements).toBe(1);
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test -- src/lib/profile.test.ts`
Expected: FAIL — cannot resolve `./profile` / `summarizeProfile is not a function`.

- [ ] **Step 4: Write the minimal implementation**

Create `src/lib/profile.ts`:

```ts
export interface ProfileInputs {
  xp: number;
  levelName: string;
  crystals: number;
  currentStreak: number;
  longestStreak: number;
  assessedSkills: number;
  totalSkills: number;
  completedProjects: number;
  totalProjects: number;
}

export interface MatchableAchievement {
  id: string;
  matches: (achievement: {
    type: string;
    metadata: Record<string, unknown>;
  }) => boolean;
}

export interface ProfileSummary extends ProfileInputs {
  earnedAchievements: number;
  totalAchievements: number;
  earnedAchievementIds: string[];
}

export function summarizeProfile(
  inputs: ProfileInputs,
  catalog: MatchableAchievement[],
  earned: { type: string; metadata: Record<string, unknown> }[],
): ProfileSummary {
  const earnedAchievementIds = catalog
    .filter((def) => earned.some((achievement) => def.matches(achievement)))
    .map((def) => def.id);

  return {
    ...inputs,
    earnedAchievements: earnedAchievementIds.length,
    totalAchievements: catalog.length,
    earnedAchievementIds,
  };
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- src/lib/profile.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 6: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/lib/profile.ts src/lib/profile.test.ts
git commit -m "feat: add profile summary domain logic"
```

---

### Task 2: Expose email from the auth hook

**Files:**
- Modify: `src/hooks/useFirebaseAuth.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `useFirebaseAuth(): { uid: string | null; email: string | null; loading: boolean }`

- [ ] **Step 1: Add email state and return it**

Replace the whole body of `src/hooks/useFirebaseAuth.ts` with:

```ts
"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export function useFirebaseAuth() {
  const [uid, setUid] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid ?? null);
      setEmail(user?.email ?? null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { uid, email, loading };
}
```

- [ ] **Step 2: Typecheck and lint**

Run: `npm run typecheck && npm run lint`
Expected: no errors. (`email` is additive; existing `{ uid, loading }` consumers are unaffected.)

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useFirebaseAuth.ts
git commit -m "feat: expose email from useFirebaseAuth"
```

---

### Task 3: Profile skeleton

**Files:**
- Create: `src/components/shared/skeletons/ProfileSkeleton.tsx`
- Modify: `src/components/shared/skeletons/index.ts`

**Interfaces:**
- Consumes: `Skeleton` from `./Skeleton`.
- Produces: default export `ProfileSkeleton` (no props), re-exported from `@/components/shared/skeletons`.

- [ ] **Step 1: Create the skeleton**

Create `src/components/shared/skeletons/ProfileSkeleton.tsx`:

```tsx
import { Skeleton } from "./Skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="space-y-6" aria-busy>
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3.5 w-56" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="card-surface rounded-lg p-4">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="mt-3 h-6 w-14" />
          </div>
        ))}
      </div>
      <div className="card-surface rounded-lg p-5">
        <Skeleton className="h-5 w-40" />
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="aspect-square w-full rounded-lg" />
          ))}
        </div>
      </div>
      <div className="card-surface rounded-lg p-5">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-4 h-3.5 w-40" />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Export it**

In `src/components/shared/skeletons/index.ts`, append the export line so the file reads:

```ts
export { Skeleton } from "./Skeleton";
export { default as DashboardSkeleton } from "./DashboardSkeleton";
export { default as TreeSkeleton } from "./TreeSkeleton";
export { default as ProjectsSkeleton } from "./ProjectsSkeleton";
export { default as RoadmapSkeleton } from "./RoadmapSkeleton";
export { default as AchievementsSkeleton } from "./AchievementsSkeleton";
export { default as ShopSkeleton } from "./ShopSkeleton";
export { default as SkillDetailSkeleton } from "./SkillDetailSkeleton";
export { default as ProfileSkeleton } from "./ProfileSkeleton";
```

- [ ] **Step 3: Typecheck and lint**

Run: `npm run typecheck && npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/shared/skeletons/ProfileSkeleton.tsx src/components/shared/skeletons/index.ts
git commit -m "feat: add profile skeleton"
```

---

### Task 4: ThemeSetting component

**Files:**
- Create: `src/components/profile/ThemeSetting.tsx`

**Interfaces:**
- Consumes: `useTheme()` from `@/components/shared/ThemeProvider` → `{ preference: ThemePreference; setTheme: (p: ThemePreference) => void }`; `ThemePreference` from `@/lib/theme`.
- Produces: default export `ThemeSetting` (no props).

- [ ] **Step 1: Create the component**

Create `src/components/profile/ThemeSetting.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { Check, Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { useTheme } from "@/components/shared/ThemeProvider";
import type { ThemePreference } from "@/lib/theme";

const OPTIONS: { value: ThemePreference; label: string; icon: LucideIcon }[] = [
  { value: "light", label: "Светлая", icon: Sun },
  { value: "dark", label: "Тёмная", icon: Moon },
  { value: "system", label: "Системная", icon: Monitor },
];

export default function ThemeSetting() {
  const { preference, setTheme } = useTheme();
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number) => {
    const count = OPTIONS.length;
    const next = ((index % count) + count) % count;
    setTheme(OPTIONS[next].value);
    itemsRef.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const current = itemsRef.current.findIndex(
      (el) => el === document.activeElement,
    );
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      select(current + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      select(current - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      select(0);
    } else if (event.key === "End") {
      event.preventDefault();
      select(OPTIONS.length - 1);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label="Тема оформления"
      onKeyDown={onKeyDown}
      className="grid grid-cols-3 gap-1 rounded-md border border-slate-700/70 bg-white/[0.02] p-1"
    >
      {OPTIONS.map((option, index) => {
        const active = preference === option.value;
        return (
          <button
            key={option.value}
            ref={(el) => {
              itemsRef.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => setTheme(option.value)}
            className={`flex items-center justify-center gap-1.5 rounded-sm px-2.5 py-2 font-mono text-xs transition-colors ${
              active
                ? "border border-blue-500/40 bg-blue-500/10 text-blue-600"
                : "border border-transparent text-slate-400 hover:bg-blue-500/10 hover:text-blue-600"
            }`}
          >
            <option.icon className="h-3.5 w-3.5 shrink-0" />
            <span>{option.label}</span>
            {active && <Check className="h-3.5 w-3.5 shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck and lint**

Run: `npm run typecheck && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/profile/ThemeSetting.tsx
git commit -m "feat: add profile theme setting control"
```

---

### Task 5: ProfileStats component

**Files:**
- Create: `src/components/profile/ProfileStats.tsx`

**Interfaces:**
- Consumes: `AnimatedNumber` from `@/components/shared/AnimatedNumber`.
- Produces: default export `ProfileStats` with props `{ xp: number; levelName: string; crystals: number; currentStreak: number; longestStreak: number; assessedSkills: number; totalSkills: number; completedProjects: number; totalProjects: number; earnedAchievements: number; totalAchievements: number }`.

- [ ] **Step 1: Create the component**

Create `src/components/profile/ProfileStats.tsx`:

```tsx
"use client";

import type { ReactNode } from "react";
import AnimatedNumber from "@/components/shared/AnimatedNumber";

interface ProfileStatsProps {
  xp: number;
  levelName: string;
  crystals: number;
  currentStreak: number;
  longestStreak: number;
  assessedSkills: number;
  totalSkills: number;
  completedProjects: number;
  totalProjects: number;
  earnedAchievements: number;
  totalAchievements: number;
}

export default function ProfileStats(props: ProfileStatsProps) {
  const items: { label: string; value: ReactNode }[] = [
    { label: "XP", value: <AnimatedNumber value={props.xp} /> },
    { label: "Уровень", value: props.levelName },
    { label: "Кристаллы", value: <AnimatedNumber value={props.crystals} /> },
    { label: "Стрик", value: `${props.currentStreak} / ${props.longestStreak}` },
    {
      label: "Навыки",
      value: `${props.assessedSkills}/${props.totalSkills}`,
    },
    {
      label: "Проекты",
      value: `${props.completedProjects}/${props.totalProjects}`,
    },
    {
      label: "Достижения",
      value: `${props.earnedAchievements}/${props.totalAchievements}`,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="card-surface rounded-lg p-4">
          <p className="font-mono text-[11px] uppercase tracking-wide text-slate-500">
            {item.label}
          </p>
          <p className="mt-1 font-mono text-lg font-semibold text-white">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck and lint**

Run: `npm run typecheck && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/profile/ProfileStats.tsx
git commit -m "feat: add profile stats grid"
```

---

### Task 6: ProfileAchievements component

**Files:**
- Create: `src/components/profile/ProfileAchievements.tsx`

**Interfaces:**
- Consumes: `AchievementDef` type from `@/data/achievements`.
- Produces: default export `ProfileAchievements` with props `{ catalog: AchievementDef[]; earnedIds: string[] }`.

- [ ] **Step 1: Create the component**

Create `src/components/profile/ProfileAchievements.tsx`:

```tsx
"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Lock } from "lucide-react";
import type { AchievementDef } from "@/data/achievements";

interface ProfileAchievementsProps {
  catalog: AchievementDef[];
  earnedIds: string[];
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ProfileAchievements({
  catalog,
  earnedIds,
}: ProfileAchievementsProps) {
  const earned = new Set(earnedIds);

  return (
    <section className="card-surface rounded-lg p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-mono text-sm font-semibold text-slate-300">
          <span className="text-slate-600">##</span> Достижения{" "}
          <span className="text-slate-500">
            [{earned.size}/{catalog.length}]
          </span>
        </h2>
        <Link
          href="/achievements"
          className="font-mono text-xs text-blue-600 underline-offset-4 hover:underline"
        >
          все достижения →
        </Link>
      </div>
      <ul className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
        {catalog.map((def, index) => {
          const owned = earned.has(def.id);
          return (
            <motion.li
              key={def.id}
              title={`${def.title} — ${def.condition}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "0px 0px -20px 0px" }}
              transition={{ duration: 0.3, delay: (index % 8) * 0.03, ease: EASE }}
              className={`flex aspect-square items-center justify-center rounded-lg border text-2xl ${
                owned
                  ? "border-blue-500/40 bg-blue-500/10"
                  : "border-slate-700 bg-white/[0.02] opacity-50 grayscale"
              }`}
            >
              {owned ? (
                <span aria-hidden>{def.icon}</span>
              ) : (
                <Lock className="h-4 w-4 text-slate-500" aria-hidden />
              )}
              <span className="sr-only">
                {owned
                  ? `Получено: ${def.title}`
                  : `Не получено: ${def.title}`}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck and lint**

Run: `npm run typecheck && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/profile/ProfileAchievements.tsx
git commit -m "feat: add profile achievements grid"
```

---

### Task 7: ProfileLinks component

**Files:**
- Create: `src/components/profile/ProfileLinks.tsx`

**Interfaces:**
- Consumes: `lucide-react`.
- Produces: default export `ProfileLinks` (no props).

- [ ] **Step 1: Create the component**

Create `src/components/profile/ProfileLinks.tsx`:

```tsx
"use client";

import Link from "next/link";
import {
  FolderGit2,
  GitBranch,
  LayoutDashboard,
  Map,
  ShoppingBag,
  Trophy,
  type LucideIcon,
} from "lucide-react";

const LINKS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/dashboard", label: "Дашборд", icon: LayoutDashboard },
  { href: "/tree/junior", label: "Дерево навыков", icon: GitBranch },
  { href: "/projects", label: "Проекты", icon: FolderGit2 },
  { href: "/roadmap", label: "Роадмап", icon: Map },
  { href: "/achievements", label: "Достижения", icon: Trophy },
  { href: "/shop", label: "Магазин", icon: ShoppingBag },
];

export default function ProfileLinks() {
  return (
    <section className="card-surface rounded-lg p-5">
      <h2 className="mb-4 font-mono text-sm font-semibold text-slate-300">
        <span className="text-slate-600">##</span> Разделы
      </h2>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="flex items-center gap-2 rounded-md px-2.5 py-2 font-mono text-xs text-slate-400 transition-colors hover:bg-blue-500/10 hover:text-blue-600"
            >
              <link.icon className="h-4 w-4 shrink-0" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck and lint**

Run: `npm run typecheck && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/profile/ProfileLinks.tsx
git commit -m "feat: add profile section links"
```

---

### Task 8: ProfileContent assembly

**Files:**
- Create: `src/components/profile/ProfileContent.tsx`

**Interfaces:**
- Consumes: `useFirebaseAuth` (Task 2), `summarizeProfile` (Task 1), `ProfileSkeleton` (Task 3), `ThemeSetting` (Task 4), `ProfileStats` (Task 5), `ProfileAchievements` (Task 6), `ProfileLinks` (Task 7); hooks `useUserProgress`, `useAssessments`, `useProjectProgress`, `useCurrency`, `useStreak`, `useAchievements` from `@/hooks`; `levels`, `skills`, `projects`, `getAchievementCatalog` from `@/data/*`; `logout` server action.
- Produces: default export `ProfileContent` (no props). Renders an `<h1 id="profile-heading">` (used by the modal's `aria-labelledby`).

- [ ] **Step 1: Create the component**

Create `src/components/profile/ProfileContent.tsx`:

```tsx
"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Loader2, LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";
import {
  useAchievements,
  useAssessments,
  useCurrency,
  useProjectProgress,
  useStreak,
  useUserProgress,
} from "@/hooks";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { levels } from "@/data/levels";
import { skills } from "@/data/skills";
import { projects } from "@/data/projects";
import { getAchievementCatalog } from "@/data/achievements";
import { summarizeProfile } from "@/lib/profile";
import { ProfileSkeleton } from "@/components/shared/skeletons";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileAchievements from "@/components/profile/ProfileAchievements";
import ProfileLinks from "@/components/profile/ProfileLinks";
import ThemeSetting from "@/components/profile/ThemeSetting";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ProfileContent() {
  const router = useRouter();
  const { email, loading: authLoading } = useFirebaseAuth();
  const { progress, loading: progressLoading } = useUserProgress();
  const { assessmentMap, loading: assessmentsLoading } = useAssessments();
  const { projectMap, loading: projectsLoading } = useProjectProgress();
  const { balance, loading: currencyLoading } = useCurrency();
  const { currentStreak, longestStreak, loading: streakLoading } = useStreak();
  const { achievements, loading: achievementsLoading } = useAchievements();
  const [loggingOut, setLoggingOut] = useState(false);

  const loading =
    authLoading ||
    progressLoading ||
    assessmentsLoading ||
    projectsLoading ||
    currencyLoading ||
    streakLoading ||
    achievementsLoading;

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut(auth);
      await logout();
      router.push("/");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) return <ProfileSkeleton />;

  const levelName =
    levels.find((level) => level.id === (progress?.currentLevelId ?? levels[0].id))
      ?.name ?? levels[0].name;

  const catalog = getAchievementCatalog();
  const summary = summarizeProfile(
    {
      xp: progress?.totalScore ?? 0,
      levelName,
      crystals: balance,
      currentStreak,
      longestStreak,
      assessedSkills: Object.keys(assessmentMap).length,
      totalSkills: skills.length,
      completedProjects: Object.values(projectMap).filter(Boolean).length,
      totalProjects: projects.length,
    },
    catalog,
    achievements,
  );

  const initial = (email?.trim()?.[0] ?? "?").toUpperCase();

  return (
    <div className="space-y-6">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="flex items-center gap-4"
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-500/40 bg-blue-500/10 font-mono text-xl font-bold text-blue-600">
          {initial}
        </span>
        <div className="min-w-0">
          <h1
            id="profile-heading"
            className="text-xl font-bold tracking-tight text-white"
          >
            <span className="text-blue-600">#</span> Профиль
          </h1>
          <p className="truncate font-mono text-xs text-slate-500">
            {email ?? "—"}
          </p>
        </div>
      </motion.header>

      <ProfileStats
        xp={summary.xp}
        levelName={summary.levelName}
        crystals={summary.crystals}
        currentStreak={summary.currentStreak}
        longestStreak={summary.longestStreak}
        assessedSkills={summary.assessedSkills}
        totalSkills={summary.totalSkills}
        completedProjects={summary.completedProjects}
        totalProjects={summary.totalProjects}
        earnedAchievements={summary.earnedAchievements}
        totalAchievements={summary.totalAchievements}
      />

      <ProfileAchievements
        catalog={catalog}
        earnedIds={summary.earnedAchievementIds}
      />

      <ProfileLinks />

      <section className="card-surface rounded-lg p-5">
        <h2 className="mb-4 font-mono text-sm font-semibold text-slate-300">
          <span className="text-slate-600">##</span> Оформление
        </h2>
        <ThemeSetting />
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-md border border-red-500/40 bg-red-500/10 py-2.5 font-mono text-xs text-red-500 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loggingOut ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          выйти из аккаунта
        </button>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck and lint**

Run: `npm run typecheck && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/profile/ProfileContent.tsx
git commit -m "feat: assemble profile content"
```

---

### Task 9: ProfileModal

**Files:**
- Create: `src/components/profile/ProfileModal.tsx`

**Interfaces:**
- Consumes: `ProfileContent` (Task 8).
- Produces: default export `ProfileModal` with props `{ open: boolean; onClose: () => void }`. Focus return targets any `[data-profile-trigger]` element that is currently visible.

- [ ] **Step 1: Create the modal**

Create `src/components/profile/ProfileModal.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import ProfileContent from "@/components/profile/ProfileContent";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ProfileModal({ open, onClose }: ProfileModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const mql = window.matchMedia("(min-width: 600px)");
    const onResize = (event: MediaQueryListEvent) => {
      if (!event.matches) onClose();
    };
    mql.addEventListener("change", onResize);

    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      mql.removeEventListener("change", onResize);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      return;
    }
    if (!wasOpen.current) return;
    wasOpen.current = false;
    const triggers = Array.from(
      document.querySelectorAll<HTMLElement>("[data-profile-trigger]"),
    );
    triggers.find((element) => element.offsetParent !== null)?.focus();
  }, [open]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="profile-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-slate-950/70 p-4 pt-[max(env(safe-area-inset-top),1rem)] pb-[max(env(safe-area-inset-bottom),1rem)] backdrop-blur-md"
        >
          <motion.div
            key="profile-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-heading"
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            onClick={(event) => event.stopPropagation()}
            className="relative my-auto w-full max-w-2xl rounded-lg border border-slate-700 bg-slate-950/98 p-5 shadow-[0_20px_60px_rgba(26,25,21,0.28)] outline-none"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть профиль"
              className="absolute right-3 top-3 rounded-md p-1.5 text-slate-500 transition-colors hover:bg-blue-500/10 hover:text-blue-600"
            >
              <X className="h-4 w-4" />
            </button>
            <ProfileContent />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
```

- [ ] **Step 2: Typecheck and lint**

Run: `npm run typecheck && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/profile/ProfileModal.tsx
git commit -m "feat: add profile modal"
```

---

### Task 10: `/profile` route

**Files:**
- Create: `src/app/(app)/profile/page.tsx`

**Interfaces:**
- Consumes: `getCurrentUser` from `@/lib/auth`; `ProfileContent` (Task 8).
- Produces: the server route `/profile`.

Note: the spec's `ProfilePageClient` is folded into this route + `ProfileContent` (the page is already inside `(app)/layout.tsx` which supplies the `main` container and padding).

- [ ] **Step 1: Create the page**

Create `src/app/(app)/profile/page.tsx`:

```tsx
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import ProfileContent from "@/components/profile/ProfileContent";

export default async function ProfilePage() {
  const uid = await getCurrentUser();
  if (!uid) redirect("/login");

  return <ProfileContent />;
}
```

- [ ] **Step 2: Typecheck and lint**

Run: `npm run typecheck && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(app)/profile/page.tsx"
git commit -m "feat: add /profile route"
```

---

### Task 11: Header wiring and ThemeToggle removal

**Files:**
- Modify: `src/components/shared/Header.tsx`
- Delete: `src/components/shared/ThemeToggle.tsx`

**Interfaces:**
- Consumes: `ProfileModal` (Task 9), `ProfileSkeleton` (Task 3), `CircleUser` from `lucide-react`.
- Produces: nav item `профиль`; modal state in `Header`. No exported API.

- [ ] **Step 1: Update imports**

In `src/components/shared/Header.tsx`, replace the import block (lines 1–30) with:

```tsx
"use client";

import Link, { useLinkStatus } from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { usePathname } from "next/navigation";
import StreakBadge from "@/components/shared/StreakBadge";
import CurrencyBadge from "@/components/shared/CurrencyBadge";
import BrandMark from "@/components/shared/BrandMark";
import ProfileModal from "@/components/profile/ProfileModal";
import {
  DashboardSkeleton,
  TreeSkeleton,
  ProjectsSkeleton,
  RoadmapSkeleton,
  AchievementsSkeleton,
  ShopSkeleton,
  ProfileSkeleton,
} from "@/components/shared/skeletons";
import {
  LayoutDashboard,
  GitBranch,
  FolderGit2,
  Map,
  Trophy,
  CircleUser,
  LogIn,
} from "lucide-react";
```

- [ ] **Step 2: Add the profile nav item and skeleton mapping**

Replace `NAV_ITEMS` and `ROUTE_SKELETONS` (lines 32–47) with:

```tsx
const NAV_ITEMS = [
  { href: "/dashboard", label: "dashboard", icon: LayoutDashboard },
  { href: "/tree/junior", label: "tree", shortLabel: "tree", icon: GitBranch },
  { href: "/projects", label: "projects", icon: FolderGit2 },
  { href: "/roadmap", label: "roadmap", icon: Map },
  { href: "/achievements", label: "achievements", icon: Trophy },
  { href: "/profile", label: "профиль", icon: CircleUser },
];

const ROUTE_SKELETONS: Record<string, React.ComponentType> = {
  "/dashboard": DashboardSkeleton,
  "/tree/junior": TreeSkeleton,
  "/projects": ProjectsSkeleton,
  "/roadmap": RoadmapSkeleton,
  "/achievements": AchievementsSkeleton,
  "/shop": ShopSkeleton,
  "/profile": ProfileSkeleton,
};
```

- [ ] **Step 3: Make DesktopNavItem open the modal for the profile item**

Replace the whole `DesktopNavItem` function with:

```tsx
function DesktopNavItem({
  item,
  active,
  onNavigate,
  onOpenProfile,
}: {
  item: (typeof NAV_ITEMS)[number];
  active: boolean;
  onNavigate: (href: string) => void;
  onOpenProfile: () => void;
}) {
  const isProfile = item.href === "/profile";
  const className = `group relative flex items-center gap-2.5 rounded-md px-2.5 py-2 font-mono text-sm transition-colors duration-150 ${
    active ? "text-white" : "text-slate-400 hover:text-white"
  }`;

  const inner = (
    <>
      {active && (
        <motion.span
          layoutId="nav-active-desktop"
          className="absolute inset-0 rounded-md border border-blue-500/30 bg-blue-500/10"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          initial={false}
        />
      )}
      <span
        className={`relative shrink-0 font-bold ${
          active ? "text-blue-600" : "text-slate-600 group-hover:text-blue-500"
        }`}
      >
        {active ? "▸" : ">"}
      </span>
      <item.icon
        className={`relative h-4 w-4 shrink-0 ${
          active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
        }`}
      />
      <span className="relative">{item.label}</span>
      {!isProfile && (
        <PendingIndicator className="right-2.5 top-1/2 -translate-y-1/2" />
      )}
    </>
  );

  if (isProfile) {
    return (
      <button
        type="button"
        data-profile-trigger
        onClick={onOpenProfile}
        aria-haspopup="dialog"
        aria-expanded={active}
        className={`${className} w-full text-left`}
      >
        {inner}
      </button>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={() => onNavigate(item.href)}
      className={className}
    >
      {inner}
    </Link>
  );
}
```

- [ ] **Step 4: Make TabletNavItem open the modal for the profile item**

Replace the whole `TabletNavItem` function with:

```tsx
function TabletNavItem({
  item,
  active,
  onNavigate,
  onOpenProfile,
}: {
  item: (typeof NAV_ITEMS)[number];
  active: boolean;
  onNavigate: (href: string) => void;
  onOpenProfile: () => void;
}) {
  const isProfile = item.href === "/profile";
  const className = `relative flex flex-col items-center gap-1 rounded-md px-1.5 py-2 text-center font-mono text-[10px] leading-tight transition-colors duration-150 ${
    active ? "text-blue-600" : "text-slate-400 hover:text-white"
  }`;

  const inner = (
    <>
      {active && (
        <motion.span
          layoutId="nav-active-tablet"
          className="absolute inset-0 rounded-md border border-blue-500/30 bg-blue-500/10"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          initial={false}
        />
      )}
      <item.icon className="relative h-5 w-5" />
      <span className="relative whitespace-nowrap">
        {item.shortLabel ?? item.label}
      </span>
      {!isProfile && <PendingIndicator className="right-1.5 top-1.5" />}
    </>
  );

  if (isProfile) {
    return (
      <button
        type="button"
        data-profile-trigger
        onClick={onOpenProfile}
        aria-haspopup="dialog"
        aria-expanded={active}
        className={className}
      >
        {inner}
      </button>
    );
  }

  return (
    <Link
      href={item.href}
      title={item.label}
      onClick={() => onNavigate(item.href)}
      className={className}
    >
      {inner}
    </Link>
  );
}
```

- [ ] **Step 5: Add modal state and per-layout active logic in `Header`**

In the `Header` function, replace the state/derived/dispatch block (lines 213–250) with:

```tsx
  const pathname = usePathname();
  const [user, setUser] = useState<{ uid: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<PendingNav | null>(null);
  const [readyPending, setReadyPending] = useState<PendingNav | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ? { uid: firebaseUser.uid } : null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isNavigating = pending !== null && pending.startedPath === pathname;

  useEffect(() => {
    if (!isNavigating || !pending) return;
    const timer = setTimeout(() => setReadyPending(pending), 120);
    return () => clearTimeout(timer);
  }, [isNavigating, pending]);

  const handleNavigate = (href: string) => {
    if (pathname !== href) setPending({ href, startedPath: pathname });
  };

  const segment = (pathname ?? "").split("/")[1] || "";
  const activeHref = segment === "tree" ? "/tree/junior" : `/${segment}`;
  const isActive = (href: string) =>
    href === "/profile" ? profileOpen || activeHref === "/profile" : href === activeHref;
  const showNav = !loading && user;
```

- [ ] **Step 6: Remove theme toggle and logout from the header actions**

Replace the header actions block (the `<div className="ml-auto ...">` through its closing `</div>`, lines 314–339) with:

```tsx
            <div className="ml-auto flex shrink-0 items-center gap-2">
              {!loading && user && <StreakBadge />}
              {!loading && user && <CurrencyBadge />}
              {!loading &&
                !user &&
                pathname !== "/login" && (
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-mono text-xs text-slate-400 transition-colors hover:bg-blue-500/10 hover:text-blue-600"
                  >
                    <LogIn className="h-4 w-4" />
                    <span className="hidden nav-md:inline">login</span>
                  </Link>
                )}
            </div>
```

- [ ] **Step 7: Wire the profile item in the desktop sidebar**

In the desktop sidebar nav (the `nav-lg` `<nav>`, lines ~269–279), replace the `NAV_ITEMS.map(...)` block with:

```tsx
            {NAV_ITEMS.map((item) => (
              <div key={item.href} className="group">
                <DesktopNavItem
                  item={item}
                  active={isActive(item.href)}
                  onNavigate={handleNavigate}
                  onOpenProfile={() => setProfileOpen(true)}
                />
              </div>
            ))}
```

- [ ] **Step 8: Wire the profile item in the tablet rail**

In the tablet rail nav (the `nav-md` `<nav>`, lines ~291–298), replace the `NAV_ITEMS.map(...)` block with:

```tsx
          {NAV_ITEMS.map((item) => (
            <TabletNavItem
              key={item.href}
              item={item}
              active={isActive(item.href)}
              onNavigate={handleNavigate}
              onOpenProfile={() => setProfileOpen(true)}
            />
          ))}
```

- [ ] **Step 9: Widen the mobile bottom bar to six items**

In the mobile bottom bar (lines ~359–369), change `grid-cols-5` to `grid-cols-6` and use `isActive`:

```tsx
            <ul className="grid grid-cols-6">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <MobileNavItem
                    item={item}
                    active={isActive(item.href)}
                    onNavigate={handleNavigate}
                  />
                </li>
              ))}
            </ul>
```

- [ ] **Step 10: Render the modal**

Immediately before the closing `</div>` of the root flex container (the last line of the returned JSX, after the mobile `<nav>`), add:

```tsx
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
```

- [ ] **Step 11: Delete the now-unused ThemeToggle**

```bash
git rm src/components/shared/ThemeToggle.tsx
```

- [ ] **Step 12: Verify no stale references and typecheck/lint**

Run: `rg -n "ThemeToggle|handleLogout|signOut\(|useRouter" src/components/shared/Header.tsx`
Expected: no matches.

Run: `npm run typecheck && npm run lint`
Expected: no errors.

- [ ] **Step 13: Manual smoke test**

Run: `npm run dev`, then:
- `<600px`: bottom bar has 6 items; `профиль` navigates to `/profile`; page shows header/stats/achievements/links/theme/logout.
- `≥600px` (rail and sidebar): `профиль` opens the modal, URL does not change; Esc, backdrop click, and the X button close it; body scroll is locked while open.
- No theme toggle and no logout button in the header on any width.

- [ ] **Step 14: Commit**

```bash
git add src/components/shared/Header.tsx
git rm src/components/shared/ThemeToggle.tsx
git commit -m "feat: open profile from nav, move theme and logout out of header"
```

---

### Task 12: Full verification

**Files:** none (verification only).

- [ ] **Step 1: Run the full check suite**

Run: `npm run lint && npm run typecheck && npm test`
Expected: all pass.

- [ ] **Step 2: Run the manual matrix**

Run: `npm run dev` and verify each row:

- < 600px, user: nav item → `/profile` page; active highlight on `/profile`; theme switch works; logout returns to `/`; header has no theme/logout.
- ≥ 600px (rail 600–840px and sidebar ≥ 840px), user: nav item opens modal; `aria-expanded` toggles; focus lands in the dialog and returns to the trigger on close; modal closes when resized below 600px.
- Guest (logged out, `/login` redirect): `/profile` redirects to `/login`; no profile nav (nav hidden when `!user`).
- Light/dark/system: profile renders correctly in all three.

- [ ] **Step 3: Commit any fixes**

If fixes were needed:

```bash
git add -A
git commit -m "fix: address profile verification findings"
```

If nothing changed, skip this step.

---

## Self-Review

- **Spec coverage:** §1 nav/adaptive → Tasks 11 (nav item, grid-cols-6, modal trigger). §2 route → Task 10. §3 content sections → Tasks 5–8. §4 modal → Task 9. §5 `lib/profile.ts` → Task 1. §6 header/theme changes → Task 11. §7 skeleton → Task 3. §8 accessibility → Tasks 4, 9, 11. §9 testing → Tasks 1, 11, 12. §10 files → all tasks. §11 branch → Task 1 Step 1.
- **Deviation from spec:** `ProfilePageClient` is dropped; the `/profile` page renders `ProfileContent` directly (noted in Task 10).
- **Type consistency:** `ProfileSummary` fields (`earnedAchievementIds`, `xp`, `crystals`, etc.) are used unchanged in Tasks 5 and 8; `MatchableAchievement` matches `AchievementDef` structurally; `useFirebaseAuth` returns `email` in Task 2 and is consumed in Task 8.
- **Placeholder scan:** none.
