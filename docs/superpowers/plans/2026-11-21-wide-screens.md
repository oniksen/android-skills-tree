# Wide-Screen Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every existing page the same full-width, card-grid treatment the skills tree already uses, without changing layouts below 1280 px.

**Architecture:** One pure route→width helper drives `Header`/`main` widths. Two shared UI pieces (`PageHero`, `PageSummaryCard`) plus two CSS grid utilities (`content-grid`, `content-grid-wide`) carry the tree pattern into each page. Each page keeps its mobile markup and only adds `xl`/`2xl` structure; skeletons mirror the new grids.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4 (`@utility` in `src/app/globals.css`), motion, Vitest.

**Spec:** `docs/superpowers/specs/2026-11-21-wide-screens-design.md`

## Global Constraints

- Do not change data, Firestore, routing, auth/proxy, nav items, colors, themes or glass tokens.
- Do not change layouts below 1280 px; existing `sm:`/`md:` grids stay.
- Do not revert uncommitted tree work (`GapList` keeps its `openSkill` logic).
- No horizontal scrolling at 390/768/1440/1920/2560.
- `Header` and `main` must use the same `max-w` cap per route.
- UI copy is Russian; identifiers and code are English.
- Verify each task with `npm run lint` and `npm run typecheck`; final with `npm test` and `npm run build`.

## Review Focus

- `/study` and `/quiz` must not inherit the collection-wide container: overflow or content under the sticky header is the likely failure.
- Long skills/projects/achievements must not produce a single 2000 px line: auto-fill minima are what prevent it.
- `GapList` rows must stay readable at a 34rem column (badge + XP + progress bar): overflow here is the most likely visual break.
- Profile must stay single-column inside `ProfileModal` even though the page becomes two-column.
- Skill-detail `loading.tsx` must match the widened page box, otherwise the skeleton visibly jumps.

---

### Task 1: Route width helper, header alignment and grid utilities

**Files:**
- Create: `src/lib/layout.ts`
- Create: `src/lib/layout.test.ts`
- Modify: `src/shared/ui/Header.tsx:207-213`, `src/shared/ui/Header.tsx:304-313`
- Modify: `src/app/globals.css:489-495`

**Interfaces:**
- Produces: `pageWidthFor(pathname: string): "wide" | "study" | "quiz" | "default"` — used by `Header`.
- Produces CSS utilities `content-grid` and `content-grid-wide`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { pageWidthFor } from "./layout";

describe("pageWidthFor", () => {
  it("marks tree pages as wide", () => {
    expect(pageWidthFor("/tree/junior")).toBe("wide");
    expect(pageWidthFor("/tree/senior/skill/senior-arch")).toBe("wide");
  });
  it("keeps study pages separate even under /tree", () => {
    expect(pageWidthFor("/tree/junior/skill/junior-osnovy-perem/study")).toBe("study");
    expect(pageWidthFor("/tree/junior/category/junior-osnovy/study")).toBe("study");
  });
  it("marks the collection pages as wide", () => {
    for (const path of ["/dashboard", "/roadmap", "/projects", "/shop", "/achievements", "/profile"]) {
      expect(pageWidthFor(path)).toBe("wide");
    }
  });
  it("gives quiz and login their own widths", () => {
    expect(pageWidthFor("/quiz")).toBe("quiz");
    expect(pageWidthFor("/login")).toBe("default");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/layout.test.ts`
Expected: FAIL — `Failed to resolve import "./layout"`.

- [ ] **Step 3: Implement `src/lib/layout.ts`**

```ts
export type PageWidth = "wide" | "study" | "quiz" | "default";

const WIDE_PAGES = new Set([
  "/dashboard",
  "/roadmap",
  "/projects",
  "/shop",
  "/achievements",
  "/profile",
]);

export function pageWidthFor(pathname: string): PageWidth {
  const path = (pathname || "/").split("?")[0];

  if (/\/study(\/|$)/.test(path)) return "study";
  if (path === "/quiz" || path.startsWith("/quiz/")) return "quiz";
  if (path === "/tree" || path.startsWith("/tree/")) return "wide";
  if (WIDE_PAGES.has(path)) return "wide";
  return "default";
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/layout.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Wire `Header.tsx` to the helper**

Replace `isStudying`/`isTree`-derived width classes with:

```tsx
const width = pageWidthFor(pathname ?? "");
const headerWidthClass =
  width === "study" ? "max-w-none" : width === "quiz" ? "max-w-[1200px]" : width === "wide" ? "max-w-[2000px]" : "max-w-6xl";
```

`main` classes: `study` → unchanged `"w-full flex-1 p-3"`; `quiz` → `"w-full max-w-[1200px] mx-auto flex-1 p-3"`; `wide` → `` `w-full max-w-[2000px] mx-auto flex-1 nav-md:px-6 ${mainClassName}` ``; default unchanged.

- [ ] **Step 6: Add grid utilities to `globals.css`**

```css
@utility content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(24rem, 100%), 1fr));
  align-items: start;
  gap: 1rem;
}

@utility content-grid-wide {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(34rem, 100%), 1fr));
  align-items: start;
  gap: 0.5rem;
}
```

- [ ] **Step 7: Verify**

Run: `npm run lint`, `npm run typecheck`, `npx vitest run src/lib/layout.test.ts`
Expected: clean, tests pass.

- [ ] **Step 8: Commit**

```bash
git add src/lib/layout.ts src/lib/layout.test.ts src/shared/ui/Header.tsx src/app/globals.css
git commit -m "feat(ui): share the wide page container across sections"
```

---

### Task 2: Shared hero and summary card

**Files:**
- Create: `src/shared/ui/PageHero.tsx`
- Create: `src/shared/ui/PageSummaryCard.tsx`

**Interfaces:**
- `PageHero({ title, prefix = "#", description, meta, leading, aside })` — `ReactNode` for `meta`, `leading`, `aside`.
- `PageSummaryCard({ title, meta, value, valueLabel, progress, stats, children })` where `progress?: { current: number; max: number; tone?: ProgressTone }` and `stats?: { label: string; value: ReactNode }[]`.

- [ ] **Step 1: Implement `PageHero.tsx`**

`<section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,380px)] xl:items-start">`; left block: optional `leading` beside an `<h1 className="text-2xl font-bold tracking-tight text-white"><span className="text-blue-600">{prefix}</span> {title}</h1>`, `description` as `text-sm text-slate-400`, then `meta`. Render `aside` only when provided, as the second grid child. No animation.

- [ ] **Step 2: Implement `PageSummaryCard.tsx`**

`<div className="card-surface relative overflow-hidden rounded-lg p-5">` with the hairline `bg-gradient-to-r from-transparent via-blue-400/40 to-transparent`, a `title` (`text-xs font-semibold uppercase tracking-wide text-slate-500`) + `meta` row, optional `value`/`valueLabel` line, optional `<ProgressBar current max tone showLabel={false} />`, optional `stats` as `dl` with `dt`/`dd`, and `children`.

- [ ] **Step 3: Verify**

Run: `npm run lint`, `npm run typecheck`
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add src/shared/ui/PageHero.tsx src/shared/ui/PageSummaryCard.tsx
git commit -m "feat(ui): add shared wide-page hero and summary card"
```

---

### Task 3: Dashboard

**Files:**
- Modify: `src/features/dashboard/components/DashboardClient.tsx`
- Modify: `src/shared/ui/skeletons/DashboardSkeleton.tsx`

**Interfaces:** consumes `PageHero`, `content-grid`? No — dashboard uses an explicit column grid.

- [ ] **Step 1: Rework `DashboardClient`**

Use `PageHero` with `title="Дашборд"`, `description="Ваш прогресс на пути к senior."` and `aside={<LevelProgressCard …/>}`. Below: `grid gap-4 md:grid-cols-2 2xl:grid-cols-3` with `QuickStats`, `StreakCard`, `NextMilestone` (the latter full-width on mobile as now). Remove the old two-card grid that held `LevelProgressCard`.

- [ ] **Step 2: Match `DashboardSkeleton`**

Same hero grid (`xl:grid-cols-[…]`), then `grid gap-4 md:grid-cols-2 2xl:grid-cols-3` with three card skeletons.

- [ ] **Step 3: Verify**

Run: `npm run lint`, `npm run typecheck`

- [ ] **Step 4: Commit**

```bash
git add src/features/dashboard/components/DashboardClient.tsx src/shared/ui/skeletons/DashboardSkeleton.tsx
git commit -m "feat(dashboard): use the full width on large screens"
```

---

### Task 4: Roadmap

**Files:**
- Modify: `src/features/roadmap/components/RoadmapClient.tsx`
- Modify: `src/features/roadmap/components/GapList.tsx:55-56` (outer wrapper only)
- Modify: `src/shared/ui/skeletons/RoadmapSkeleton.tsx`

**Interfaces:** consumes `PageHero`, `PageSummaryCard`, `content-grid-wide`.

- [ ] **Step 1: Add hero and summary**

`PageHero` title `Roadmap`, description, `meta` = existing focus chip. `aside` = `PageSummaryCard` with `title="Текущий грейд"`, `value={currentLevel.name}`, `progress={{ current: completedSkills, max: items.length }}`, stats «Навыков N/M», «Средний прогресс N%». Compute `completedSkills = items.filter(i => i.completionPercent === 100).length` and the average.

- [ ] **Step 2: Move controls into a toolbar row**

Wrap the sort buttons and «Скрыть пройденные» in `<div className="flex flex-wrap items-center gap-3 border-b border-white/[0.06] pb-4">` directly under the hero (same treatment as tree).

- [ ] **Step 3: Widen `GapList`**

Change only the outer `<div className="space-y-2">` to `<div className="content-grid-wide">`. Do not touch `openSkill`, handlers, animation or row markup.

- [ ] **Step 4: Match `RoadmapSkeleton`**

Hero grid + toolbar line + `content-grid-wide` with six row skeletons (keep the current row skeleton markup).

- [ ] **Step 5: Verify**

Run: `npm run lint`, `npm run typecheck`

- [ ] **Step 6: Commit**

```bash
git add src/features/roadmap/components/RoadmapClient.tsx src/features/roadmap/components/GapList.tsx src/shared/ui/skeletons/RoadmapSkeleton.tsx
git commit -m "feat(roadmap): widen the roadmap and its gap list"
```

---

### Task 5: Projects

**Files:**
- Modify: `src/features/projects/components/ProjectsClient.tsx`
- Modify: `src/shared/ui/skeletons/ProjectsSkeleton.tsx`

**Interfaces:** consumes `PageHero`, `PageSummaryCard`, `content-grid`.

- [ ] **Step 1: Add hero and summary**

`PageHero` title `Проекты`, existing description; `aside` = `PageSummaryCard` `title="Проекты"`, `value={`${completedProjects}/${projects.length}`}`, `progress={{ current: completedProjects, max: projects.length, tone: "green" }}`, stat «Грейдов: 4».

- [ ] **Step 2: Put level groups into a grid**

Replace each group's `<div className="space-y-3">` with `<div className="content-grid">`; keep per-card motion wrappers and the `index % 5` delay.

- [ ] **Step 3: Match `ProjectsSkeleton`**

Hero + per-group `content-grid` with card skeletons.

- [ ] **Step 4: Verify**

Run: `npm run lint`, `npm run typecheck`

- [ ] **Step 5: Commit**

```bash
git add src/features/projects/components/ProjectsClient.tsx src/shared/ui/skeletons/ProjectsSkeleton.tsx
git commit -m "feat(projects): lay project cards out in a wide grid"
```

---

### Task 6: Shop

**Files:**
- Modify: `src/features/shop/components/ShopClient.tsx`
- Modify: `src/shared/ui/skeletons/ShopSkeleton.tsx`

**Interfaces:** consumes `PageHero`, `PageSummaryCard`.

- [ ] **Step 1: Add hero and balance summary**

`PageHero` title `Магазин`, existing description; `aside` = `PageSummaryCard` `title="Баланс"`, `value={`${balance} ${CURRENCY_ICON}`}`, stats «Заморозки {freezes}/3», «Цена {SHOP_ITEMS[0].price} 💎».

- [ ] **Step 2: Two-column body**

Wrap items and the earn-table section in `<div className="grid gap-4 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)] xl:items-start">`; items keep `grid gap-4 sm:grid-cols-2`, the table section keeps its card. Mobile stacks as before.

- [ ] **Step 3: Match `ShopSkeleton`**

Hero + the same two-column body with item and table skeletons.

- [ ] **Step 4: Verify**

Run: `npm run lint`, `npm run typecheck`

- [ ] **Step 5: Commit**

```bash
git add src/features/shop/components/ShopClient.tsx src/shared/ui/skeletons/ShopSkeleton.tsx
git commit -m "feat(shop): use a wide two-column shop layout"
```

---

### Task 7: Achievements

**Files:**
- Modify: `src/features/achievements/components/AchievementsClient.tsx`
- Modify: `src/shared/ui/skeletons/AchievementsSkeleton.tsx`

**Interfaces:** consumes `PageHero`, `PageSummaryCard`, `content-grid`.

- [ ] **Step 1: Add hero and summary**

`PageHero` title `Достижения`, `meta` = `[{earned}/{total}]`; `aside` = `PageSummaryCard` `title="Открыто"`, `value={`${earnedIds.size}/${catalog.length}`}`, `progress={{ current: earnedIds.size, max: catalog.length }}`.

- [ ] **Step 2: Widen group grids**

Replace `grid grid-cols-1 gap-4 md:grid-cols-2` with `content-grid`; keep group headings and animations.

- [ ] **Step 3: Match `AchievementsSkeleton`**

Hero + group headings + `content-grid`.

- [ ] **Step 4: Verify**

Run: `npm run lint`, `npm run typecheck`

- [ ] **Step 5: Commit**

```bash
git add src/features/achievements/components/AchievementsClient.tsx src/shared/ui/skeletons/AchievementsSkeleton.tsx
git commit -m "feat(achievements): fill the width with achievement grids"
```

---

### Task 8: Profile

**Files:**
- Modify: `src/features/profile/components/ProfileContent.tsx`
- Modify: `src/features/profile/components/ProfileModal.tsx:98`
- Modify: `src/shared/ui/skeletons/ProfileSkeleton.tsx`

**Interfaces:**
- `ProfileContent` gains `variant?: "page" | "modal"` (default `"page"`); `ProfileModal` passes `variant="modal"`.

- [ ] **Step 1: Add the page/modal variant**

`const isPage = variant === "page";` Root `<div className={isPage ? "space-y-6" : "space-y-6"}>`; only the body layout differs.

- [ ] **Step 2: Rework the page body**

Keep the identity header, but on `isPage` wrap it with `PageSummaryCard` `title="Уровень"`, `value={summary.levelName}`, `progress={{ current: xp, max: nextThreshold }}`, stat «До {nextLevel}: {remaining} XP» using the same `PageHero` grid (`leading` = avatar). Then `<div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] xl:items-start">`: left = `ProfileStats` + `ProfileAchievements`; right = `ProfileLinks` + AI section + appearance section. `variant="modal"` keeps the current single `space-y-6` flow.

- [ ] **Step 3: Pass the variant from the modal**

`<ProfileContent variant="modal" … />`.

- [ ] **Step 4: Match `ProfileSkeleton`**

Add `variant?: "page" | "modal"`; page renders hero + two-column body, modal renders the current skeleton. `profile/loading.tsx` keeps the default.

- [ ] **Step 5: Verify**

Run: `npm run lint`, `npm run typecheck`

- [ ] **Step 6: Commit**

```bash
git add src/features/profile/components/ProfileContent.tsx src/features/profile/components/ProfileModal.tsx src/shared/ui/skeletons/ProfileSkeleton.tsx
git commit -m "feat(profile): add a wide two-column profile layout"
```

---

### Task 9: Quiz

**Files:**
- Modify: `src/features/quiz/components/QuizConsole.tsx:136-137`
- Modify: `src/app/(app)/quiz/loading.tsx`

**Interfaces:** none new; `Header` already gives `/quiz` `max-w-[1200px]` and `p-3`.

- [ ] **Step 1: Center the console**

Root: `mx-auto flex h-full w-full max-w-[1200px] flex-1 flex-col font-mono text-sm`. Keep the message area, input, and bottom bar untouched.

- [ ] **Step 2: Match the loading shell**

Wrap the existing skeleton block in `mx-auto w-full max-w-[1200px]` and keep its padding.

- [ ] **Step 3: Verify**

Run: `npm run lint`, `npm run typecheck`

- [ ] **Step 4: Commit**

```bash
git add src/features/quiz/components/QuizConsole.tsx "src/app/(app)/quiz/loading.tsx"
git commit -m "feat(quiz): centre the console on wide screens"
```

---

### Task 10: Skill detail

**Files:**
- Modify: `src/app/(app)/tree/[slug]/skill/[skillId]/SkillDetailPageClient.tsx:46`
- Modify: `src/app/(app)/tree/[slug]/skill/[skillId]/loading.tsx`
- Modify: `src/features/tree/components/SkillDetailContent.tsx`
- Modify: `src/shared/ui/skeletons/SkillDetailSkeleton.tsx`

**Interfaces:**
- `SkillDetailContent` gains `wide?: boolean` (default `false`); `SkillDetailSkeleton` gains `wide?: boolean`.

- [ ] **Step 1: Widen the page box**

`SkillDetailPageClient` wrapper → `mx-auto w-full max-w-4xl space-y-4 2xl:max-w-5xl`; pass `wide` to `SkillDetailContent`.

- [ ] **Step 2: Add the wide layout to `SkillDetailContent`**

When `wide`, the outer body becomes `xl:grid xl:grid-cols-2 xl:gap-6 xl:items-start`: left = description + meta, right = subtopics + progress. The heading block stays full width above the grid. When `!wide`, markup is unchanged.

- [ ] **Step 3: Update the skeleton and loading shell**

`SkillDetailSkeleton` repeats the same wide grid when `wide`; `loading.tsx` uses `max-w-4xl 2xl:max-w-5xl` and `<SkillDetailSkeleton wide />`.

- [ ] **Step 4: Verify**

Run: `npm run lint`, `npm run typecheck`

- [ ] **Step 5: Commit**

```bash
git add "src/app/(app)/tree/[slug]/skill/[skillId]/SkillDetailPageClient.tsx" "src/app/(app)/tree/[slug]/skill/[skillId]/loading.tsx" src/features/tree/components/SkillDetailContent.tsx src/shared/ui/skeletons/SkillDetailSkeleton.tsx
git commit -m "feat(tree): use two columns for skill details on large screens"
```

---

### Task 11: Study content column

**Files:**
- Modify: `src/app/globals.css` (study rules near `.study-hero` and `.study-section`)

**Interfaces:** none; CSS only, no markup or class-name changes.

- [ ] **Step 1: Cap the content column**

```css
.study-hero,
.study-section,
.study-footer {
  width: 100%;
  max-width: 72rem;
  margin-inline: auto;
}
```

Keep existing padding, `scroll-margin-top` and `overflow-x: clip`.

- [ ] **Step 2: Verify no study contract broke**

Run: `npx vitest run src/features/study/model/study-blocks.test.ts src/features/study/components/study-render-golden.test.tsx`
Expected: PASS (golden HTML unchanged).

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(study): keep the reading column comfortable on wide screens"
```

---

### Task 12: Login

**Files:**
- Modify: `src/app/login/page.tsx:63-70`

**Interfaces:** none.

- [ ] **Step 1: Two-column shell on `lg`**

Outer: `flex min-h-dvh items-center justify-center px-4 py-10`. Inner content wrapper: `grid w-full max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_28rem] lg:items-center`. Left (`hidden lg:block`): `BrandMark`, `<p className="text-gradient text-2xl font-bold">android/skill-tree</p>`, a short sentence and three bullets: «Дерево навыков», «XP, кристаллы и стрики», «Учебные материалы и квиз». Right: the existing `motion.div` card (`max-w-md` → `w-full`). Below `lg` the left column is hidden and the card is centred as now.

- [ ] **Step 2: Verify**

Run: `npm run lint`, `npm run typecheck`

- [ ] **Step 3: Commit**

```bash
git add src/app/login/page.tsx
git commit -m "feat(login): add a wide-screen intro column"
```

---

### Task 13: Final QA

- [ ] **Step 1: Run all gates**

Run: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`
Expected: lint/typecheck/build clean; test failures match the pre-existing baseline only.

- [ ] **Step 2: Visual matrix**

Widths 390/768/1440/1920/2560, both themes, pages `/tree/junior`, `/dashboard`, `/roadmap`, `/projects`, `/shop`, `/achievements`, `/profile`, `/quiz`, skill detail, a study page, `/login`. Check no horizontal scroll and header/main caps match.

- [ ] **Step 3: Commit any QA fixes**

```bash
git add -A
git commit -m "fix(ui): tidy wide-screen spacing after QA"
```
