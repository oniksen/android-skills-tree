# XP & Achievements Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign XP formula (non-linear), update level thresholds, add per-category level-up check, category/level locking, achievements system, and achievements page.

**Architecture:** Modify server action scoring logic, add client-side category locking state, seed data update, new `/achievements` route with static fetch of achievement records.

**Tech Stack:** Next.js 16 (App Router), Supabase, Tailwind CSS v4, TypeScript

## Global Constraints
- Use `floor()` for all XP calculations (integer XP)
- SCORE_MULTIPLIER: `{1: 0.1, 2: 0.25, 3: 0.5, 4: 0.8, 5: 1.0}`
- No new database tables — use existing `achievements` table
- No TypeScript type changes — existing `Database` types sufficient
- Follow existing code conventions, no comments added

---

### Task 1: Update XP formula in `recalculateScore()`

**Files:**
- Modify: `src/app/actions/assessments.ts:20-31`

**Interfaces:**
- Consumes: existing Supabase client pattern
- Produces: `recalculateScore()` returns integer `totalScore` using new non-linear formula

- [ ] **Step 1: Replace `recalculateScore()` formula**

In `src/app/actions/assessments.ts`, replace the function with the non-linear formula using `SCORE_MULTIPLIER` map and `Math.floor()`.

- [ ] **Step 2: Verify build** — run `npx tsc --noEmit`

---

### Task 2: Update `CategoryCard` with non-linear formula

**Files:**
- Modify: `src/components/tree/CategoryCard.tsx:11`

**Interfaces:**
- Consumes: same props, `SCORE_MULTIPLIER` mapping (defined inline)
- Produces: correct `catScore` using new formula

- [ ] **Step 1: Add multiplier constant and update catScore calculation**
- [ ] **Step 2: Verify build**

---

### Task 3: Update `CategoryCardReadonly` with non-linear formula

**Files:**
- Modify: `src/components/tree/CategoryCardReadonly.tsx`

- [ ] **Step 1: Find and update the readonly category score display to use the same non-linear formula**
- [ ] **Step 2: Verify build**

---

### Task 4: Update level thresholds in seed data

**Files:**
- Modify: `scripts/seed.sql:2-6`

- [ ] **Step 1: Update `levels` INSERT with new min_score/max_score**
- [ ] **Step 2: Apply to Supabase via migration** — use `supabase_apply_migration` with a migration name like `update_level_thresholds`

---

### Task 5: Add per-category check to `checkLevelUp()`

**Files:**
- Modify: `src/app/actions/assessments.ts:33-92`

**Interfaces:**
- Consumes: `SCORE_MULTIPLIER` from Task 1
- Produces: level-up blocked unless each category in current level >= 80% of max_score

- [ ] **Step 1: Fetch categories for current level and compute category scores using non-linear formula**
- [ ] **Step 2: Add the per-category ≥80% check before existing total_score check**

---

### Task 6: Add `checkAchievements()` function

**Files:**
- Modify: `src/app/actions/assessments.ts` (add after `recalculateScore()`)

- [ ] **Step 1: Implement `checkAchievements()`** that checks for:
  - `category_perfect` — all skills in a category scored 5
  - `level_master` — all categories in a level at max_score
  - `path_complete` — all 4 levels maxed
- [ ] **Step 2: Call `checkAchievements()` from `saveAssessment()` after `recalculateScore()`**

---

### Task 7: Add locked state to CategoryCard

**Files:**
- Modify: `src/components/tree/CategoryCard.tsx`
- Modify: `src/app/tree/[slug]/page.tsx`

- [ ] **Step 1: Add `isLocked` prop to CategoryCard and show lock overlay when true**
- [ ] **Step 2: In page.tsx, compute whether each category is at max_score and pass `isLocked`**

---

### Task 8: Create Achievements page

**Files:**
- Create: `src/app/achievements/page.tsx`
- Create: `src/components/achievements/AchievementCard.tsx`
- Possibly modify: navigation component to add link

- [ ] **Step 1: Create `/achievements` page** — fetch achievements from DB, render grid
- [ ] **Step 2: Create `AchievementCard` component** — display icon, title, subtitle, date
- [ ] **Step 3: Add link to achievements in navigation**

---

### Task 9: Verify Build

- [ ] **Step 1: Run full build** — `npm run build` or `npx tsc --noEmit`
- [ ] **Step 2: Fix any type errors**
