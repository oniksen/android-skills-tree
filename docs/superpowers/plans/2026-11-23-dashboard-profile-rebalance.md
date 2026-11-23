# Dashboard/Profile Rebalance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebalance the Dashboard and Profile pages so the Dashboard is the single home of progress metrics and the Profile is the home of identity, earned achievements, and settings.

**Architecture:** Add a pure domain helper that mirrors `checkLevelUp` and returns the full four-condition level-up checklist. Move the level progress ring and the crystals card to the Dashboard, replace `NextMilestone` with a checklist card, and strip the duplicated progress cards and progress metrics from the Profile. Skeletons follow both pages.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, `motion`, Vitest (`node` environment; component tests use `renderToStaticMarkup`).

**Spec:** `docs/superpowers/specs/2026-11-23-dashboard-profile-rebalance-design.md`

## Global Constraints

- UI copy is Russian; identifiers, code, and comments-in-code are English.
- Tailwind v4 palette is remapped: `slate-950` is light paper, `blue-*` is the coral accent, `emerald-*` is terminal green. Do not assume default Tailwind colors.
- Do not add new Firestore listeners. `useCurrency` and `useStreak` already read the shared `useUserState` store.
- Pages stay thin server components; do not add `cookies()`/`headers()` under `(app)`.
- Component tests run in the `node` environment and use `renderToStaticMarkup` (see `src/shared/ui/PageSummaryCard.test.tsx`).
- Do not touch the study-material pipeline, generated registry, `/achievements`, `/shop`, `/tree`, `/roadmap`, `Header`, or `protectedRoutes`.
- Verify every task with `npm run lint`, `npm run typecheck`, and `npm test` where the task changes source.
- Use conventional commit subjects (they become release notes).

## Review Focus

- **Senior / max level:** `getNextLevel("senior")` returns `null`; the requirements helper returns `[]`; the Dashboard must not render an empty checklist. Tested in Task 1.
- **New user / empty state:** every requirement is `done: false` with `current: 0`. Tested in Task 1.
- **Category gate:** the categories item is done only when every current-level category reaches 80%. Tested in Task 1.
- **Skills/project gates:** required skills and projects report correct `current/target` and `done`. Tested in Task 1.
- **Profile identity only:** after simplification the Profile hero must not render XP, crystals, or streak. Tested in Task 4.

---

### Task 1: Domain level-up requirements helper

**Files:**
- Create: `src/core/domain/level-requirements.ts`
- Create: `src/core/domain/level-requirements.test.ts`

**Interfaces:**
- Consumes: `levels` (`@/data/levels`), `getCategoriesByLevelId` (`@/data/categories`), `getSkillsByLevelId` (`@/data/skills`), `LEVEL_UP_THRESHOLD`, `getCategoryMaxScore`, `getLevelMinScore` (`./weights`), `calcCategoryScore`, `calcTotalScore` (`./scoring`), `AssessmentData` (`@/types`).
- Produces:
  - `getNextLevel(currentLevelId: string): Level | null`
  - `interface LevelRequirement { id: "categories" | "xp" | "skills" | "projects"; label: string; done: boolean; current?: number; target?: number }`
  - `getLevelUpRequirements(params: { currentLevelId: string; nextLevel: Level | null; assessmentMap: Record<string, AssessmentData>; projectMap: Record<string, boolean> }): LevelRequirement[]`

- [ ] **Step 1: Write the failing test**

Create `src/core/domain/level-requirements.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getLevelUpRequirements, getNextLevel } from "./level-requirements";
import { getCategoriesByLevelId } from "@/data/categories";
import { getSkillsByLevelId } from "@/data/skills";
import {
  getCategoryMaxScore,
  getLevelMinScore,
  LEVEL_UP_THRESHOLD,
} from "./weights";
import { calcCategoryScore } from "./scoring";
import type { Level } from "@/data/levels";
import type { AssessmentData } from "@/types";

function fullyDone(skillId: string, subtopics: string[]): AssessmentData {
  return {
    score: 0,
    subtopics: Object.fromEntries(subtopics.map((name) => [name, true])),
  };
}

describe("getNextLevel", () => {
  it("returns the next level in order", () => {
    expect(getNextLevel("junior")?.id).toBe("middle");
    expect(getNextLevel("middle")?.id).toBe("strong-middle");
    expect(getNextLevel("strong-middle")?.id).toBe("senior");
  });

  it("returns null at the maximum level", () => {
    expect(getNextLevel("senior")).toBeNull();
  });

  it("returns null for an unknown level id", () => {
    expect(getNextLevel("unknown")).toBeNull();
  });
});

describe("getLevelUpRequirements", () => {
  it("returns no requirements without a next level", () => {
    expect(
      getLevelUpRequirements({
        currentLevelId: "senior",
        nextLevel: null,
        assessmentMap: {},
        projectMap: {},
      }),
    ).toEqual([]);
  });

  it("returns categories, xp, skills and projects for junior -> middle", () => {
    const requirements = getLevelUpRequirements({
      currentLevelId: "junior",
      nextLevel: getNextLevel("junior"),
      assessmentMap: {},
      projectMap: {},
    });

    expect(requirements.map((item) => item.id)).toEqual([
      "categories",
      "xp",
      "skills",
      "projects",
    ]);
    const byId = Object.fromEntries(requirements.map((item) => [item.id, item]));
    expect(byId.categories).toMatchObject({
      current: 0,
      target: getCategoriesByLevelId("junior").length,
      done: false,
    });
    expect(byId.xp).toMatchObject({
      current: 0,
      target: getLevelMinScore("middle"),
      done: false,
    });
    expect(byId.skills).toMatchObject({
      current: 0,
      target: getSkillsByLevelId("middle").filter((s) => s.requiredForLevelUp)
        .length,
      done: false,
    });
    expect(byId.projects).toMatchObject({
      current: 0,
      target: 2,
      done: false,
    });
  });

  it("marks the categories item done only when every category reaches the threshold", () => {
    const juniorSkills = getSkillsByLevelId("junior");
    const assessmentMap = Object.fromEntries(
      juniorSkills.map((skill) => [
        skill.id,
        fullyDone(skill.id, skill.subtopics),
      ]),
    );
    const categories = getCategoriesByLevelId("junior");
    const expectedCurrent = categories.filter(
      (category) =>
        calcCategoryScore(category.id, assessmentMap) >=
        getCategoryMaxScore(category.id) * LEVEL_UP_THRESHOLD,
    ).length;

    const item = getLevelUpRequirements({
      currentLevelId: "junior",
      nextLevel: getNextLevel("junior"),
      assessmentMap,
      projectMap: {},
    }).find((requirement) => requirement.id === "categories");

    expect(item).toMatchObject({
      current: expectedCurrent,
      target: categories.length,
      done: expectedCurrent === categories.length,
    });
  });

  it("marks required skills done when each has a score of at least 1", () => {
    const required = getSkillsByLevelId("middle").filter(
      (skill) => skill.requiredForLevelUp,
    );
    const assessmentMap = Object.fromEntries(
      required.map((skill) => [skill.id, { score: 1, subtopics: {} }]),
    );

    const item = getLevelUpRequirements({
      currentLevelId: "junior",
      nextLevel: getNextLevel("junior"),
      assessmentMap,
      projectMap: {},
    }).find((requirement) => requirement.id === "skills");

    expect(item).toMatchObject({
      current: required.length,
      target: required.length,
      done: true,
    });
  });

  it("counts completed projects against the next level requirement", () => {
    const item = getLevelUpRequirements({
      currentLevelId: "junior",
      nextLevel: getNextLevel("junior"),
      assessmentMap: {},
      projectMap: { a: true, b: true },
    }).find((requirement) => requirement.id === "projects");

    expect(item).toMatchObject({ current: 2, target: 2, done: true });
  });

  it("omits requirements whose target is zero", () => {
    const synthetic: Level = {
      id: "synthetic",
      name: "Synthetic",
      slug: "synthetic",
      description: "",
      levelOrder: 99,
      requiredProjectCount: 0,
    };

    const requirements = getLevelUpRequirements({
      currentLevelId: "junior",
      nextLevel: synthetic,
      assessmentMap: {},
      projectMap: {},
    });

    expect(requirements.map((item) => item.id)).toEqual(["categories", "xp"]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/core/domain/level-requirements.test.ts`
Expected: FAIL — cannot resolve `./level-requirements`.

- [ ] **Step 3: Implement `src/core/domain/level-requirements.ts`**

Use these labels exactly: `"Категории текущего уровня"`, `"Общий XP"`, `"Обязательные навыки следующего уровня"`, `"Проекты"`.

Rules (must mirror `checkLevelUp` in `src/lib/firestore-actions.ts`):
- `getNextLevel`: `levels.findIndex`; return `levels[index + 1]`, or `null` when not found or last.
- If `nextLevel` is `null`, return `[]`.
- `categories`: current-level categories where `calcCategoryScore(id, assessmentMap) >= getCategoryMaxScore(id) * LEVEL_UP_THRESHOLD`; `done` when all pass.
- `xp`: `current = calcTotalScore(assessmentMap)`, `target = getLevelMinScore(nextLevel.id)`, `done = current >= target`.
- `skills`: `getSkillsByLevelId(nextLevel.id)` filtered by `requiredForLevelUp`; pass when `(assessmentMap[skill.id]?.score ?? 0) >= 1`; push only when the filtered list is non-empty.
- `projects`: `current = Object.values(projectMap).filter(Boolean).length`, `target = nextLevel.requiredProjectCount`; push only when `target > 0`.
- Always push `categories` and `xp`, in that order, before `skills` and `projects`.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/core/domain/level-requirements.test.ts`
Expected: PASS (9 tests).

- [ ] **Step 5: Run typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/core/domain/level-requirements.ts src/core/domain/level-requirements.test.ts
git commit -m "feat: add level-up requirements domain helper"
```

---

### Task 2: Dashboard level requirements card

**Files:**
- Create: `src/features/dashboard/components/LevelRequirementsCard.tsx`
- Create: `src/features/dashboard/components/LevelRequirementsCard.test.tsx`

**Interfaces:**
- Consumes: `LevelRequirement` from `@/core/domain/level-requirements`.
- Produces: default export `LevelRequirementsCard({ requirements, nextLevelName }: { requirements: LevelRequirement[]; nextLevelName: string })`.

- [ ] **Step 1: Write the failing test**

Create `src/features/dashboard/components/LevelRequirementsCard.test.tsx`:

```tsx
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import LevelRequirementsCard from "./LevelRequirementsCard";

const requirements = [
  {
    id: "categories" as const,
    label: "Категории текущего уровня",
    done: true,
    current: 2,
    target: 4,
  },
  {
    id: "xp" as const,
    label: "Общий XP",
    done: false,
    current: 200,
    target: 1000,
  },
];

describe("LevelRequirementsCard", () => {
  it("renders every requirement with its progress", () => {
    const html = renderToStaticMarkup(
      <LevelRequirementsCard requirements={requirements} nextLevelName="Middle" />,
    );

    expect(html).toContain("Категории текущего уровня");
    expect(html).toContain("Общий XP");
    expect(html).toContain("2/4");
    expect(html).toContain("200/1000");
  });

  it("renders the ready state when every requirement is done", () => {
    const html = renderToStaticMarkup(
      <LevelRequirementsCard
        requirements={requirements.map((item) => ({ ...item, done: true }))}
        nextLevelName="Middle"
      />,
    );

    expect(html).toContain("условия выполнены");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/features/dashboard/components/LevelRequirementsCard.test.tsx`
Expected: FAIL — cannot resolve `./LevelRequirementsCard`.

- [ ] **Step 3: Implement `LevelRequirementsCard.tsx`**

Implement it as a server-compatible component: no `"use client"` and no `motion` — the Dashboard already wraps each card in `motion.div`. Reuse the visual classes of the old `NextMilestone.tsx`:
- Title: `"Что нужно для {nextLevelName}"`.
- One row per requirement: a `[x]` / `[ ]` marker, the `label`, and `current/target` when both are defined.
- Done rows use the emerald tone, pending rows the slate tone.
- When `requirements.length > 0 && requirements.every((item) => item.done)`, render the READY card with the text `[ READY ] условия выполнены` and `Вы готовы перейти на уровень **{nextLevelName}**.`
- No new icons; text markers only.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/features/dashboard/components/LevelRequirementsCard.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/features/dashboard/components/LevelRequirementsCard.tsx src/features/dashboard/components/LevelRequirementsCard.test.tsx
git commit -m "feat: add dashboard level requirements checklist"
```

---

### Task 3: Dashboard integration

**Files:**
- Modify: `src/features/dashboard/components/DashboardClient.tsx`
- Modify: `src/features/dashboard/components/LevelProgressCard.tsx`
- Modify: `src/shared/ui/skeletons/DashboardSkeleton.tsx`
- Delete: `src/features/dashboard/components/NextMilestone.tsx`

**Interfaces:**
- Consumes: `getNextLevel`, `getLevelUpRequirements` (Task 1), `LevelRequirementsCard` (Task 2), `useCurrency` (`@/hooks`), `PageSummaryCard`, `ProgressRing`, `levelProgressPercent`.
- Produces: updated `/dashboard` page.

- [ ] **Step 1: Update `LevelProgressCard.tsx` to use the ring**

Replace the `ProgressBar` with `ProgressRing` (`@/shared/ui/ProgressRing`) and compute `percent` with `levelProgressPercent(currentScore, nextThreshold)` (`@/core/domain/profile-level`).
Layout: level name on the left of the ring; `"До уровня … осталось N XP"` below. Keep the max-level fallback `"Максимальный уровень достигнут!"`.
Remove the `ProgressBar` import. Keep `AnimatedNumber`.

- [ ] **Step 2: Update `DashboardClient.tsx`**

- Imports: add `useCurrency` to the `@/hooks` import; add `getNextLevel`, `getLevelUpRequirements` from `@/core/domain/level-requirements`; add `LevelRequirementsCard` from `@/features/dashboard/components/LevelRequirementsCard`; add `PageSummaryCard` from `@/shared/ui/PageSummaryCard`; add `Link` from `next/link`; remove the `NextMilestone` import.
- Read the currency loading flag and include it in the skeleton gate:
  `const { balance, loading: currencyLoading } = useCurrency();`
  `if (progressLoading || assessmentsLoading || projectsLoading || currencyLoading) return <DashboardSkeleton />;`
- Keep `currentLevel = levels.find(...) || levels[0]`.
- Replace the manual `currentIndex`/`nextLevel` block with:
  `const nextLevel = getNextLevel(currentLevel.id);`
  `const nextThreshold = nextLevel ? getLevelMinScore(nextLevel.id) : null;`
- Compute:
  `const requirements = getLevelUpRequirements({ currentLevelId: currentLevel.id, nextLevel, assessmentMap, projectMap });`
- Render the hero exactly as today, with `LevelProgressCard` in `aside`.
- In the card grid, render in this order: `LevelRequirementsCard` (only when `nextLevel`), `QuickStats`, `StreakCard`, crystals card.
- Crystals card: `PageSummaryCard` with `title="Кристаллы"`, `value={`${balance} 💎`}`, `valueLabel="баланс"`, and a child link `<Link href="/shop">в магазин →</Link>` using `mt-auto pt-3 font-mono text-xs text-blue-600 underline-offset-4 hover:underline`.
- Remove `canLevelUp` and all `NextMilestone` usage.

- [ ] **Step 3: Update `DashboardSkeleton.tsx`**

- Hero aside: replace the bar/text skeleton with a ring skeleton (`h-24 w-24 rounded-full`) plus two short lines.
- Grid: `Array.from({ length: 4 })` instead of `length: 3`.

- [ ] **Step 4: Delete `NextMilestone.tsx`**

Run: `git rm src/features/dashboard/components/NextMilestone.tsx`
Expected: no remaining imports (verify with `git grep -n "NextMilestone" -- src`).

- [ ] **Step 5: Run checks**

Run: `npm run lint`
Run: `npm run typecheck`
Run: `npm test`
Expected: all PASS.

- [ ] **Step 6: Commit**

```bash
git add -A src/features/dashboard src/shared/ui/skeletons/DashboardSkeleton.tsx
git commit -m "feat: move progress metrics to dashboard"
```

---

### Task 4: Profile simplification

**Files:**
- Modify: `src/features/profile/components/ProfileHeroCard.tsx`
- Create: `src/features/profile/components/ProfileHeroCard.test.tsx`
- Modify: `src/features/profile/components/ProfileContent.tsx`
- Modify: `src/shared/ui/skeletons/ProfileSkeleton.tsx`

**Interfaces:**
- Consumes: existing `ProfileAchievements`, `ProfileSettingsCard`, hooks.
- Produces: `ProfileHeroCard({ email, levelName, levelColor, headingId }: { email: string | null; levelName: string; levelColor: string; headingId: string })`.

- [ ] **Step 1: Write the failing hero test**

Create `src/features/profile/components/ProfileHeroCard.test.tsx`:

```tsx
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ProfileHeroCard from "./ProfileHeroCard";

describe("ProfileHeroCard", () => {
  it("shows identity only, without progress metrics", () => {
    const html = renderToStaticMarkup(
      <ProfileHeroCard
        email="dev@example.com"
        levelName="Middle"
        levelColor="text-blue-400"
        headingId="profile-heading"
      />,
    );

    expect(html).toContain("dev@example.com");
    expect(html).toContain("Middle");
    expect(html).not.toContain("XP");
    expect(html).not.toContain("Кристаллы");
    expect(html).not.toContain("Стрик");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/features/profile/components/ProfileHeroCard.test.tsx`
Expected: FAIL — the current hero still renders `XP`, `Кристаллы`, and `Стрик`.

- [ ] **Step 3: Rewrite `ProfileHeroCard.tsx`**

Keep the avatar initial, `# Профиль` heading, email, and `уровень: {levelName}`. Keep the decorative top line and blur.
Remove `ProgressRing`, the `dl` with XP / crystals / streak, the footer with `remaining` / `longestStreak`, `levelProgressPercent`, and `pluralDays`. Do not add a link to `/dashboard` (header navigation already covers it).

- [ ] **Step 4: Run the hero test to verify it passes**

Run: `npx vitest run src/features/profile/components/ProfileHeroCard.test.tsx`
Expected: PASS.

- [ ] **Step 5: Update `ProfileContent.tsx`**

- Remove imports: `PageSummaryCard`, `StreakCard`, `STREAK_FREEZE_ITEM_ID`, `getShopItem`, `getLevelMinScore`.
- Remove `nextLevel`, `nextThreshold`, `maxFreezes`, `streakCard`, `skillsCard`, `projectsCard`, `crystalsCard`.
- Keep `useCurrency` but destructure only `{ balance, loading: currencyLoading }`; keep `useStreak` for `currentStreak` and `longestStreak`.
- Keep `summarizeProfile` and pass real values, including `crystals: balance`.
- Hero props: `email`, `levelName={summary.levelName}`, `levelColor={LEVEL_COLORS[currentLevel.slug] ?? "text-blue-400"}`, `headingId`.
- `achievementsCard`: remove the `limit` prop (full collection).
- Modal branch: `hero`, `achievementsCard`, `settingsCard`.
- Page grid: `md:grid-cols-2 xl:grid-cols-12`; hero `md:col-span-2 xl:col-span-12`; achievements `md:col-span-2 xl:col-span-8`; settings `md:col-span-2 xl:col-span-4`.

- [ ] **Step 6: Update `ProfileSkeleton.tsx`**

- `HeroSkeleton`: remove the right-side ring/metrics block and the footer line; keep the avatar and three text lines.
- Delete the now-unused `StatSkeleton`.
- Page variant: hero (12), achievements (8), settings (4).
- Modal variant: `HeroSkeleton`, `AchievementsSkeleton`, `SettingsSkeleton` (delete the four `StatSkeleton` entries from `ProfileBodySkeleton`).

- [ ] **Step 7: Run checks**

Run: `npm run lint`
Run: `npm run typecheck`
Run: `npm test`
Expected: all PASS.

- [ ] **Step 8: Commit**

```bash
git add src/features/profile/components/ProfileHeroCard.tsx \
  src/features/profile/components/ProfileHeroCard.test.tsx \
  src/features/profile/components/ProfileContent.tsx \
  src/shared/ui/skeletons/ProfileSkeleton.tsx
git commit -m "refactor: simplify profile to identity and settings"
```

---

### Task 5: Verification and cleanup

**Files:**
- Verify only; no planned source changes.

- [ ] **Step 1: Run the full verification suite**

Run: `npm run lint`
Run: `npm run typecheck`
Run: `npm test`
Expected: all PASS.

- [ ] **Step 2: Confirm the old duplication is gone**

Run: `git grep -n "NextMilestone" -- src`
Expected: no matches.

Run: `git grep -nE "StreakCard|PageSummaryCard" -- src/features/profile`
Expected: no matches.

Run: `git grep -n "useCurrency" -- src/features/dashboard/components/DashboardClient.tsx`
Expected: one match (the crystals card).

- [ ] **Step 3: Manual visual check**

Check `/dashboard` and `/profile` at 390, 768, 1440, and 1920 px in both themes:
- Dashboard: hero with ring and remaining XP; checklist; stats; streak; crystals with shop link.
- Profile: identity hero only; earned achievements; settings.
- No duplicated streak/skills/projects/crystals blocks on Profile.
- Profile loading skeleton matches the new page shape.

- [ ] **Step 4: Commit any verification fixes**

If Step 1–3 required changes, commit them with a conventional subject, for example:

```bash
git add -A
git commit -m "fix: align dashboard and profile after rebalance"
```

If nothing changed, no commit is needed.

## Update (2026-11-23): level gate uses the current grade

`checkLevelUp` and `getLevelUpRequirements` now read required skills from the current
grade (`currentLevelId`), and the XP target is `getLevelCompletionMinScore(currentLevelId)`.
The dashboard's progress threshold and `LevelGate` follow the same value. This supersedes
the `getLevelMinScore(nextLevel.id)` / next-level skill references above.
