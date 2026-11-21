# Profile Player Card & Quiz Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `/profile` into a player-card + bento layout and give `/quiz` a two-pane workspace on wide screens, without changing data or mobile behaviour.

**Architecture:** A shared `ProgressRing` and `levelProgressPercent` feed a new `ProfileHeroCard`; the rest of the profile becomes a 12-column bento reusing `PageSummaryCard`, `StreakCard` and a compact settings card. The quiz keeps its terminal on the left and adds a pure `QuizSessionPanel` on the right at `xl`, with a compact context strip below it.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind v4, motion, Vitest (node + react-dom/server).

**Spec:** `docs/superpowers/specs/2026-11-21-profile-player-card-and-quiz-workspace-design.md`

## Global Constraints

- No data, Firestore, routing, auth/proxy, nav, theme or glass-token changes.
- Layouts below 1280 px stay as they are, except the quiz context strip.
- Profile modal stays single-column via `variant="modal"`.
- Russian UI copy, English identifiers.
- Verify each task with `npm run lint` and `npm run typecheck`; final with `npm test` and `npm run build`.

## Review Focus

- `/quiz` must fill the viewport height on desktop and still scroll messages inside the left pane.
- `ProfileModal` must keep a readable single column and its own skeleton.
- The XP ring must not divide by zero on the last level.
- Settings must stay reachable on mobile (not hidden behind `xl`).
- No duplicated actions visible at the same time on `xl` (exit/new live in the panel, not both).

---

### Task 1: Level progress helper and ProgressRing

**Files:**
- Create: `src/core/domain/profile-level.ts`
- Create: `src/core/domain/profile-level.test.ts`
- Create: `src/shared/ui/ProgressRing.tsx`

**Interfaces:**
- Produces `levelProgressPercent(xp: number, threshold: number | null): number` (0–100, 100 when `threshold` is null or `<= 0`).
- Produces `ProgressRing({ percent, label, sub, className })`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { levelProgressPercent } from "./profile-level";

describe("levelProgressPercent", () => {
  it("clamps to 0..100", () => {
    expect(levelProgressPercent(0, 1000)).toBe(0);
    expect(levelProgressPercent(500, 1000)).toBe(50);
    expect(levelProgressPercent(2000, 1000)).toBe(100);
  });
  it("is 100 when there is no next threshold", () => {
    expect(levelProgressPercent(123, null)).toBe(100);
    expect(levelProgressPercent(123, 0)).toBe(100);
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/core/domain/profile-level.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the helper**

`Math.max(0, Math.min(100, Math.round((xp / threshold) * 100)))`, returning 100 for a missing/zero threshold.

- [ ] **Step 4: Run the test — PASS.**

- [ ] **Step 5: Implement `ProgressRing`**

`conic-gradient` ring with an inner `bg-[var(--surface)]` disc, centre `label` + `sub`, `role="img"` and `aria-label={`${percent}%`}`, coral accent.

- [ ] **Step 6: Commit**

```bash
git add src/core/domain/profile-level.ts src/core/domain/profile-level.test.ts src/shared/ui/ProgressRing.tsx
git commit -m "feat(profile): add a level progress ring"
```

---

### Task 2: Move StreakCard to shared UI

**Files:**
- Create: `src/shared/ui/StreakCard.tsx` (move from `src/features/dashboard/components/StreakCard.tsx`)
- Modify: `src/features/dashboard/components/DashboardClient.tsx` import

- [ ] **Step 1: Move the file unchanged** and update the dashboard import to `@/shared/ui/StreakCard`.
- [ ] **Step 2: Verify** `npm run lint`, `npm run typecheck`.
- [ ] **Step 3: Commit** `refactor(ui): share the streak card between dashboard and profile`.

---

### Task 3: ProfileHeroCard

**Files:**
- Create: `src/features/profile/components/ProfileHeroCard.tsx`

**Interfaces:**
- `ProfileHeroCard({ email, levelName, levelColor, xp, nextLevelName, nextThreshold, crystals, currentStreak, longestStreak, headingId })`.
- Consumes `levelProgressPercent`, `ProgressRing`.

- [ ] **Step 1: Implement** the card: avatar initials, email, level chip, `ProgressRing` (percent from helper), chips XP / crystals / streak, footer line with remaining XP or "максимальный уровень".
- [ ] **Step 2: Verify** lint + typecheck.
- [ ] **Step 3: Commit** `feat(profile): add the player hero card`.

---

### Task 4: Profile bento, achievements shelf, settings card

**Files:**
- Modify: `src/features/profile/components/ProfileContent.tsx`
- Modify: `src/features/profile/components/ProfileAchievements.tsx`
- Create: `src/features/profile/components/ProfileSettingsCard.tsx`
- Modify: `src/shared/ui/skeletons/ProfileSkeleton.tsx`
- Delete: `src/features/profile/components/ProfileStats.tsx`, `src/features/profile/components/ProfileLinks.tsx`

**Interfaces:**
- `ProfileSettingsCard({ freezes })` — Groq key, daily limit, theme, logout.
- `ProfileAchievements` gains `limit?: number` (default all).

- [ ] **Step 1: Achievements shelf** — sort earned by `achievedAt` desc, show up to `limit` (6 on the page), keep the "все достижения →" link and existing cards.
- [ ] **Step 2: Settings card** — extract the AI + appearance sections into one `card-surface` cell; logout stays last.
- [ ] **Step 3: ProfileContent** — replace hero + two columns with the bento grid from the spec; use `PageSummaryCard` for skills/projects/crystals, `StreakCard` for the streak. `variant="modal"` renders the same cards in one column. Pass `freezes` from `useCurrency`.
- [ ] **Step 4: Delete** `ProfileStats`/`ProfileLinks` after confirming no imports remain (`grep`).
- [ ] **Step 5: ProfileSkeleton** — mirror the 12-column bento (hero 12, three 4s, achievements 8 + crystals 4 + settings 4); modal stays single column.
- [ ] **Step 6: Verify** lint + typecheck.
- [ ] **Step 7: Commit** `feat(profile): rebuild the profile as a player card and bento grid`.

---

### Task 5: Quiz workspace

**Files:**
- Create: `src/features/quiz/components/QuizSessionPanel.tsx`
- Create: `src/features/quiz/components/QuizSessionPanel.test.tsx`
- Modify: `src/features/quiz/components/QuizConsole.tsx`
- Modify: `src/shared/ui/Header.tsx` (quiz max-width 1200 → 1400)
- Modify: `src/app/(app)/quiz/loading.tsx`

**Interfaces:**
- `QuizSessionPanel({ grade, topic, skillName, used, limit, score, reason, rubric, savedLast4, canAskNew, onNew, onExit })`.

- [ ] **Step 1: Write the failing render test** — render `<QuizSessionPanel ... />`, expect the grade, topic, `used/limit`, `[new]` and `[exit]` in the markup.
- [ ] **Step 2: Run it — FAIL (module missing).**
- [ ] **Step 3: Implement the panel** with the sections from the spec; criteria in `<details>`.
- [ ] **Step 4: Run the test — PASS.**
- [ ] **Step 5: Rework `QuizConsole`** — `xl:grid xl:grid-cols-[minmax(0,1fr)_320px]`; left terminal `min-h-0`; mobile context strip (`xl:hidden`) with grade/topic/used-limit/last score; header `[exit]`/`[new]`/`сегодня` hidden on `xl`; panel gets the actions; compute `lastAssistant` and `skillName`.
- [ ] **Step 6: Widen** quiz `Header` and `loading.tsx` to `max-w-[1400px]`, add the panel skeleton at `xl`.
- [ ] **Step 7: Verify** lint + typecheck + the panel test.
- [ ] **Step 8: Commit** `feat(quiz): add a session panel and two-pane workspace`.

---

### Task 6: Final QA

- [ ] `npm run lint`, `npm run typecheck`, `npm test` (8 pre-existing failures only), `npm run build`.
- [ ] Visual: `/login` is unaffected; `/profile` and `/quiz` need a session — verify layout by code and build, plus 390/1440/2560 for public pages.
- [ ] Commit doc updates if any: `docs: describe the profile and quiz layouts`.
