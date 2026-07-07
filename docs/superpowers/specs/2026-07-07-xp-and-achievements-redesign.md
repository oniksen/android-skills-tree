# XP & Achievements Redesign

## Problem

Currently, category max_score is reachable even at minimum skill score (1/5). For example, "Основы программирования" (8 skills × 5 weight × score 1 = 40 XP = max_score). This means a user can "close" a block without demonstrating any real proficiency. Level transitions are purely numeric (total XP >= threshold) without requiring balanced knowledge across topics.

## 1. Non-linear XP Formula

Score-to-weight conversion (replaces the current linear `score × max_weight`):

| Score | % of max_weight | Example (weight=5) |
|-------|----------------|-------------------|
| 1     | 10%            | floor(5 × 0.1) = 0 |
| 2     | 25%            | floor(5 × 0.25) = 1 |
| 3     | 50%            | floor(5 × 0.5) = 2 |
| 4     | 80%            | floor(5 × 0.8) = 4 |
| 5     | 100%           | floor(5 × 1.0) = 5 |

Rounding: **floor** (integer XP). XP = `floor(score × max_weight × percentage)`.

This ensures:
- Score 1 contributes almost nothing (0 XP per 5-weight skill)
- Score 4 gives 80% — meaningful progress
- Score 5 gives 100% — full mastery required for max

### Implementation

Replace `recalculateScore()` in `assessments.ts`:

```
SCORE_MULTIPLIER = { 1: 0.1, 2: 0.25, 3: 0.5, 4: 0.8, 5: 1.0 }
skillXp = floor(assessment.score × skill.max_weight × SCORE_MULTIPLIER[assessment.score])
totalScore = sum(skillXp)
```

Category score (client-side in CategoryCard) also uses the same formula.

## 2. Level Thresholds

New cumulative max_score per level with the non-linear formula:

| Level | Max XP (all 5s) | Min XP for next (80% per block) |
|-------|----------------|----------------------------------|
| Junior | 0 — 290 | 232 (80% of 290) |
| Middle | 290 — 645 | 574 (Junior full + 80% Middle = 290 + 284) |
| Strong Middle | 645 — 885 | 837 (Junior+Middle full + 80% SM = 645 + 192) |
| Senior | 885 — 1210 | N/A (terminal) |

Seed data update for `levels` table:

```
Junior:   min_score=0,   max_score=290
Middle:   min_score=232, max_score=645
Strong M: min_score=574, max_score=885
Senior:   min_score=837, max_score=1210
```

These are **absolute** thresholds (total XP from all levels).

### Level-Up Condition (per-category check)

To level up from level N to N+1, ALL categories in level N must have score ≥ 80% of their max_score. Added to `checkLevelUp()`:

```
For each category in current level:
  catScore = sum(floor(skill_score × skill.max_weight × multiplier))
  if catScore < category.max_score × 0.8 → block transition
```

This replaces (or augments) the simple `totalScore >= nextLevel.min_score` check.

## 3. Category & Level Locking

### Category Lock
- When `catScore >= category.max_score` → the category is **locked**
- Locked category: assessment scores cannot be changed (read-only)
- The category card shows a "maxed" indicator (e.g., checkmark, gold border)
- XP from that category no longer contributes to total (already at cap)

### Level Lock
- When ALL categories in a level are at max_score → level is **maxed**
- Maxed level: insert `achievement` row (type: `level_master`, metadata: `{level: "Junior"}`)
- Level tab shows a mastery badge

### Post-Level-Up
- After transitioning to next level, user can **return** to previous levels and improve scores
- Previous level categories remain editable until they hit max_score

## 4. Achievements

### Types

| Type | Trigger | Metadata |
|------|---------|----------|
| `level_master` | All categories in a level at 100% | `{level: "Junior" / "Middle" / "Strong Middle" / "Senior"}` |
| `path_complete` | All 4 levels at 100% | `{total_score: 1210}` |
| `category_perfect` | All skills in a category scored 5 | `{category: "Основы программирования", level: "Junior"}` |

### Storage

Uses the existing `achievements` table (`user_id`, `type`, `metadata`, `achieved_at`). No schema changes needed.

### How they're checked

1. **`level_master`** — in `checkLevelUp()` or a new `checkAchievements()` function called after `recalculateScore()`. If all categories in a level are at max_score and no `level_master` achievement exists for that level, insert it.

2. **`path_complete`** — checked when all 4 levels are maxed.

3. **`category_perfect`** — checked after each assessment save. If all skills in a category are scored 5, and no `category_perfect` achievement exists for that category, insert it.

## 5. Achievements Page

New route: `/achievements`

Layout:
- Grid of achievement cards
- Each card: icon/emoji, title, description, date achieved (or "locked" state with condition hint)
- Grouped or filterable by type

Example cards:
- 🏆 Junior Master — "Все категории Junior на 100%"
- 🏆 Middle Master — "Все категории Middle на 100%"
- 🌟 Путь пройден — "Все 4 уровня пройдены на 100%"
- ⭐ Основы программирования — "Все скиллы раздела на 5"
- ... (similarly for each category)

### Data fetching

Query `achievements` table for the user, joined with `types` metadata. Display in order of achievement.

## 6. Seed Data Updates

Update `levels` table:
- Junior: `min_score=0, max_score=290`
- Middle: `min_score=232, max_score=645`
- Strong Middle: `min_score=574, max_score=885`
- Senior: `min_score=837, max_score=1210`

No changes needed to categories or skills seed data.

## 7. Database Schema Changes

**No new tables needed.** The existing `achievements` table supports all achievement types via `type` string and `metadata` JSONB.

## Files to Modify

| File | Change |
|------|--------|
| `src/app/actions/assessments.ts` | Non-linear formula in `recalculateScore()`; per-category check in `checkLevelUp()`; add `checkAchievements()` |
| `src/components/tree/CategoryCard.tsx` | Apply non-linear formula; show locked state when maxed |
| `src/components/tree/CategoryCardReadonly.tsx` | Apply non-linear formula for display |
| `src/app/tree/[slug]/page.tsx` | Pass category maxed/locked state |
| `src/components/dashboard/LevelProgressCard.tsx` | Use new thresholds |
| `src/app/dashboard/page.tsx` | Use new thresholds |
| `scripts/seed.sql` | Update levels min_score/max_score |
| `src/app/achievements/page.tsx` | **New** — achievements page |
| `src/components/achievements/` | **New** — achievement card components |

## Files NOT to Change

- Database types (`src/lib/types/database.ts`) — no schema changes
- Database migrations — no schema changes (achievements table already exists)
- Auth, project_progress, projects — unchanged
