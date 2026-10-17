# Mobile Responsive UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the mobile layout of the menu, profile, tree, roadmap and achievements pages and disable viewport zoom.

**Architecture:** Pure Tailwind responsive-utility changes across five components plus the Next.js `viewport` export. Mobile layouts stack into columns; `nav-md:` (600px) restores the existing tablet/desktop layouts. `grid-cols-1` is added wherever a `md:grid-cols-2` grid currently has no column below `md`, which is what causes the achievements overflow.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Motion, Vitest.

**Spec:** `docs/superpowers/specs/2026-10-17-mobile-responsive-ui-design.md`

## Global Constraints

- Breakpoints: `nav-md` = 600px, `nav-lg` = 840px (from `src/app/globals.css`).
- Do not change desktop/tablet navigation appearance.
- Do not touch domain logic (`src/lib`), data (`src/data`) or hooks.
- Keep every interactive control's accessible name (add `aria-label` when a visible label is hidden).
- No new dependencies.
- These are presentational changes; existing Vitest suites must stay green.

---

### Task 1: Menu icons only (bottom bar)

**Files:**
- Modify: `src/components/shared/Header.tsx` (`MobileNavItem`, ~lines 237-267)

**Interfaces:**
- Consumes: `NAV_ITEMS` entries `{ href, label, shortLabel?, icon }`.
- Produces: nothing consumed elsewhere.

- [ ] **Step 1: Replace the `MobileNavItem` return markup**

Replace the whole `MobileNavItem` component body with:

```tsx
function MobileNavItem({
  item,
  active,
  onNavigate,
}: {
  item: (typeof NAV_ITEMS)[number];
  active: boolean;
  onNavigate: (href: string) => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={() => onNavigate(item.href)}
      aria-label={item.label}
      title={item.label}
      className={`relative flex flex-col items-center justify-center py-2.5 transition-colors duration-150 ${
        active ? "text-blue-600" : "text-slate-400 hover:text-white"
      }`}
    >
      {active && (
        <motion.span
          layoutId="nav-active-mobile"
          className="absolute top-1 h-0.5 w-6 bg-blue-600"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          initial={false}
        />
      )}
      <item.icon className="relative h-6 w-6" />
      <PendingIndicator className="right-1.5 top-1.5" />
    </Link>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/shared/Header.tsx
git commit -m "fix(mobile): show icons only in bottom navigation"
```

---

### Task 2: Profile theme buttons — icon only on mobile

**Files:**
- Modify: `src/components/profile/ThemeSetting.tsx` (~lines 53-74)

**Interfaces:**
- Consumes: `OPTIONS` entries `{ value, label, icon }`, `useTheme()`.
- Produces: nothing consumed elsewhere.

- [ ] **Step 1: Hide the label below `nav-md` and add `aria-label`**

In the `<button>` element, add `aria-label={option.label}` right after
`onClick={() => setTheme(option.value)}`, and change the label span line

```tsx
            <span>{option.label}</span>
```

to

```tsx
            <span className="hidden nav-md:inline">{option.label}</span>
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/profile/ThemeSetting.tsx
git commit -m "fix(mobile): icon-only theme buttons in profile"
```

---

### Task 3: Tree — two-line skill rows

**Files:**
- Modify: `src/components/tree/SkillRow.tsx`
- Modify: `src/components/tree/SkillRowReadonly.tsx`
- Modify: `src/components/tree/TreeClient.tsx` (two `grid gap-4 md:grid-cols-2` containers, ~lines 64 and 143)

**Interfaces:**
- Consumes: `SkillRow` props `{ skillId, name, description, subtopics, required, disabled? }`; `SkillRowReadonly` props `{ skillId, name, description, subtopics }`.
- Produces: unchanged public props (callers unaffected).

- [ ] **Step 1: Restructure the `SkillRow` button into mobile column / `nav-md` row**

Replace the `<button>` block in `SkillRow.tsx` with:

```tsx
        <button
          type="button"
          onClick={handleOpen}
          disabled={!hasContent}
          aria-haspopup={hasContent ? "dialog" : undefined}
          className="flex w-full cursor-pointer flex-col gap-1.5 px-2 py-2 text-left disabled:cursor-default nav-md:flex-row nav-md:items-center nav-md:justify-between nav-md:gap-0"
        >
          <div className="flex min-w-0 items-center gap-2">
            <span
              className={`w-3 shrink-0 text-center font-mono ${
                subtopicPercent === 100
                  ? "text-emerald-600"
                  : subtopicPercent > 0
                    ? "text-blue-500"
                    : "text-slate-600"
              }`}
            >
              {subtopicPercent === 100 ? "+" : subtopicPercent > 0 ? "·" : "-"}
            </span>
            <span className="text-base text-slate-300 nav-md:truncate">{name}</span>
            {required && (
              <span className="shrink-0 rounded border border-blue-500/40 bg-blue-500/10 px-1.5 py-0.5 font-mono text-xs text-blue-600">
                required
              </span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2 pl-5 nav-md:pl-0">
            <AnimatePresence>
              {award && (
                <motion.span
                  key={award.id}
                  initial={{ opacity: 0, y: 8, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="whitespace-nowrap font-mono text-xs text-cyan-600"
                >
                  +{award.amount} 💎
                </motion.span>
              )}
            </AnimatePresence>
            {subtopics.length > 0 && (
              <motion.span
                key={completedCount}
                initial={{ scale: 1.35 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 22 }}
                className={`rounded px-1.5 py-0.5 font-mono text-sm ${
                  subtopicPercent === 100
                    ? "bg-emerald-500/10 text-emerald-600"
                    : subtopicPercent > 0
                      ? "bg-blue-500/10 text-blue-600"
                      : "text-slate-600"
                }`}
              >
                {completedCount}/{subtopics.length}
              </motion.span>
            )}
            <DifficultyBadge skillId={skillId} />
          </div>
        </button>
```

Key change: `flex-col` by default, `nav-md:flex-row nav-md:items-center
nav-md:justify-between` at ≥600px; the name loses `truncate` on mobile
(`nav-md:truncate` only).

- [ ] **Step 2: Restructure `SkillRowReadonly` the same way**

Replace the `<button>` block in `SkillRowReadonly.tsx` with:

```tsx
        <button
          type="button"
          onClick={handleOpen}
          disabled={!hasContent}
          aria-haspopup={hasContent ? "dialog" : undefined}
          className="flex w-full cursor-pointer flex-col gap-1.5 px-3 py-1 text-left disabled:cursor-default nav-md:flex-row nav-md:items-center nav-md:justify-between nav-md:gap-0"
        >
          <div className="flex min-w-0 items-center gap-2">
            <span className="w-3 shrink-0 text-center font-mono text-slate-600">·</span>
            <span className="text-base text-slate-300 nav-md:truncate">{name}</span>
          </div>
          <div className="pl-5 nav-md:pl-0">
            <DifficultyBadge skillId={skillId} />
          </div>
        </button>
```

- [ ] **Step 3: Add defensive `grid-cols-1` in `TreeClient.tsx`**

Change both occurrences of

```tsx
        <div className="grid gap-4 md:grid-cols-2">
```

to

```tsx
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
```

(both the readonly branch ~line 64 and the interactive branch ~line 143).

- [ ] **Step 4: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/tree/SkillRow.tsx src/components/tree/SkillRowReadonly.tsx src/components/tree/TreeClient.tsx
git commit -m "fix(mobile): two-line skill rows in tree"
```

---

### Task 4: Roadmap — stacked row cards

**Files:**
- Modify: `src/components/roadmap/GapList.tsx` (row markup ~lines 42-105)

**Interfaces:**
- Consumes: `gaps: Gap[]` where `Gap = { skillId, skillName, categoryName, levelName, completionPercent, currentScore, maxScore }`.
- Produces: unchanged `GapList` props.

- [ ] **Step 1: Replace the row markup**

Replace the entire `gaps.map(...)` block (the `return (...)` inside `GapList`)
with:

```tsx
      {gaps.map((gap, i) => {
        const done = gap.completionPercent === 100;
        const critical = !done && gap.currentScore === 0;
        return (
          <motion.div
            key={`${gap.skillName}-${i}`}
            variants={{
              hidden: { opacity: 0, y: 14 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
            }}
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 transition-colors nav-md:flex-row nav-md:items-center nav-md:justify-between ${
              done
                ? "hover:border-emerald-400/40"
                : critical
                  ? "hover:border-red-400/40"
                  : "hover:border-yellow-400/40"
            }`}
          >
            <div className="flex min-w-0 items-start gap-3">
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                  done
                    ? "bg-emerald-500/15 text-emerald-400"
                    : critical
                      ? "bg-red-500/15 text-red-400"
                      : "bg-yellow-500/15 text-yellow-400"
                }`}
              >
                {done ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <AlertTriangle className="h-3.5 w-3.5" />
                )}
              </span>
              <div className="min-w-0">
                <span className="font-medium text-white">{gap.skillName}</span>
                <span className="block text-sm text-slate-500 nav-md:ml-2 nav-md:inline">
                  {gap.categoryName} · {gap.levelName}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <DifficultyBadge skillId={gap.skillId} />
              <span className="font-mono text-sm text-slate-500">
                {gap.currentScore}/{gap.maxScore} XP
              </span>
              <div className="h-1.5 w-24 flex-1 rounded-full bg-slate-800 overflow-hidden nav-md:flex-none">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    done
                      ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                      : critical
                        ? "bg-gradient-to-r from-red-500 to-orange-400"
                        : "bg-gradient-to-r from-yellow-500 to-amber-400"
                  }`}
                  style={{ width: `${gap.completionPercent}%` }}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
```

Key change: card is `flex-col` by default and `nav-md:flex-row
nav-md:items-center nav-md:justify-between` at ≥600px; the `category · level`
line becomes a block on mobile (`nav-md:ml-2 nav-md:inline`); the progress bar
grows to fill the meta row on mobile (`flex-1 nav-md:flex-none`).

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/roadmap/GapList.tsx
git commit -m "fix(mobile): stack roadmap rows on narrow screens"
```

---

### Task 5: Achievements — clamp grid to width

**Files:**
- Modify: `src/components/achievements/AchievementsClient.tsx` (~line 64)

**Interfaces:**
- Consumes: `catalog`, `achievements`, `groupKeyOf`.
- Produces: nothing consumed elsewhere.

- [ ] **Step 1: Add an explicit single column below `md`**

Change

```tsx
            <div className="grid gap-4 md:grid-cols-2">
```

to

```tsx
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
```

`grid-cols-1` = `grid-template-columns: repeat(1, minmax(0, 1fr))`, which clamps
the track to the container and removes the 483px/500px overflow.

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/achievements/AchievementsClient.tsx
git commit -m "fix(mobile): full-width achievement cards, remove overflow"
```

---

### Task 6: Disable viewport zoom

**Files:**
- Modify: `src/app/layout.tsx` (`viewport` export, ~lines 29-35)

**Interfaces:**
- Consumes: none.
- Produces: none.

- [ ] **Step 1: Extend the `viewport` export**

Replace the export with:

```tsx
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f5" },
    { media: "(prefers-color-scheme: dark)", color: "#16140f" },
  ],
  viewportFit: "cover",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors (`Viewport` already imported).

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "fix(mobile): disable viewport pinch zoom"
```

---

### Task 7: Verify

**Files:** none (verification only).

- [ ] **Step 1: Static checks**

Run: `npm run lint && npm run typecheck && npm test`
Expected: lint clean, no type errors, all Vitest suites pass.

- [ ] **Step 2: Overflow check at 320 / 360 / 390 / 768px**

With the dev server running (`npm run dev`), for each of `/tree/junior`,
`/roadmap`, `/achievements` and the profile view, resize the viewport and assert:

```js
document.documentElement.scrollWidth <= window.innerWidth
```

Expected: `true` at every width.

- [ ] **Step 3: Visual review**

Screenshot each page at 390px and confirm: bottom nav shows icons only; tree
skill names are not truncated; roadmap rows are stacked; achievement cards span
the full width and the `## Достижения` title renders at full size.

- [ ] **Step 4: Final commit (if any manual fix-ups were needed)**

```bash
git add -A
git commit -m "chore(mobile): verify responsive layouts"
```
