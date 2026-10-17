# Profile Earned Achievements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The «Достижения» section in the profile shows only earned achievements; the `[N/M]` counter and the «все достижения →» link are preserved.

**Architecture:** Edit a single component `ProfileAchievements` (filter the catalog by `earnedIds` and add an empty state). The props contract and the call site in `ProfileContent` are unchanged. Docs (design spec + original plan) are synced to the new behaviour.

**Tech Stack:** Next.js 16 (App Router) + React 19, TypeScript, Tailwind CSS v4, `motion` (motion/react), `lucide-react`, Vitest (node env).

**Branch:** continue on the current `feat/profile-page` (feature not merged yet).

## Global Constraints

- Do **not** add code comments.
- UI copy is Russian; visual style is `font-mono`, palette classes (`card-surface`, `border-blue-500/40 bg-blue-500/10`).
- `npm run lint` and `npm run typecheck` must pass; `npm test` = 154 tests green (the 4 pre-existing `react-hooks/set-state-in-effect` errors in `src/hooks/*` are unrelated).
- Commit style matches repo: `feat:`, `docs:`.

---

### Task 1: Show only earned achievements

**Files:**
- Modify: `src/components/profile/ProfileAchievements.tsx`

**Interfaces:**
- Consumes: `catalog: AchievementDef[]`, `earnedIds: string[]` (unchanged).
- Produces: the same `default export ProfileAchievements` with the same props contract.

- [ ] **Step 1: Replace the component body**

In `src/components/profile/ProfileAchievements.tsx`:

1. Remove the import `import { Lock } from "lucide-react";` (no longer used).
2. After `const earned = new Set(earnedIds);` add:
```tsx
  const earnedDefs = catalog.filter((def) => earned.has(def.id));
```
3. Replace the `<ul>…</ul>` block with a conditional render:
```tsx
      {earnedDefs.length === 0 ? (
        <p className="font-mono text-xs text-slate-500">
          Открытых достижений пока нет.
        </p>
      ) : (
        <ul className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
          {earnedDefs.map((def, index) => (
            <motion.li
              key={def.id}
              title={`${def.title} — ${def.condition}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "0px 0px -20px 0px" }}
              transition={{ duration: 0.3, delay: (index % 8) * 0.03, ease: EASE }}
              className="flex aspect-square items-center justify-center rounded-lg border border-blue-500/40 bg-blue-500/10 text-2xl"
            >
              <span aria-hidden>{def.icon}</span>
              <span className="sr-only">Получено: {def.title}</span>
            </motion.li>
          ))}
        </ul>
      )}
```
   Keep the heading counter `[{earned.size}/{catalog.length}]` and the `все достижения →` link unchanged.

Resulting component:
```tsx
"use client";

import Link from "next/link";
import { motion } from "motion/react";
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
  const earnedDefs = catalog.filter((def) => earned.has(def.id));

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
      {earnedDefs.length === 0 ? (
        <p className="font-mono text-xs text-slate-500">
          Открытых достижений пока нет.
        </p>
      ) : (
        <ul className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
          {earnedDefs.map((def, index) => (
            <motion.li
              key={def.id}
              title={`${def.title} — ${def.condition}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "0px 0px -20px 0px" }}
              transition={{ duration: 0.3, delay: (index % 8) * 0.03, ease: EASE }}
              className="flex aspect-square items-center justify-center rounded-lg border border-blue-500/40 bg-blue-500/10 text-2xl"
            >
              <span aria-hidden>{def.icon}</span>
              <span className="sr-only">Получено: {def.title}</span>
            </motion.li>
          ))}
        </ul>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Verify**

```bash
npm run typecheck
npm run lint
npm test
```
Expected: typecheck clean; lint — only the 4 pre-existing `react-hooks/set-state-in-effect` in `src/hooks/*` (none in this file); tests 154 green.

- [ ] **Step 3: Commit**

```bash
git add src/components/profile/ProfileAchievements.tsx
git commit -m "feat: show only earned achievements in profile"
```

---

### Task 2: Sync documentation

**Files:**
- Modify: `docs/superpowers/specs/2026-10-17-profile-page-design.md`
- Modify: `docs/superpowers/plans/2026-10-17-profile-page.md`

- [ ] **Step 1: Update spec §3.3**

Replace:
```
3. **Достижения** (`ProfileAchievements`) — компактная сетка заработанных
   значков; незаработанные приглушены. Использует `getAchievementCatalog()` и
   `useAchievements()`. Заголовок со счётчиком `[N/M]` и ссылка «все
   достижения» → `/achievements`.
```
with:
```
3. **Достижения** (`ProfileAchievements`) — компактная сетка **только
   заработанных** значков; незаработанные не рендерятся. Если открытых нет —
   строка «Открытых достижений пока нет.». Использует `getAchievementCatalog()`
   и `useAchievements()`. Заголовок со счётчиком `[N/M]` и ссылка «все
   достижения» → `/achievements`.
```

- [ ] **Step 2: Update the original plan (Task 6)**

In `docs/superpowers/plans/2026-10-17-profile-page.md`, within **Task 6 (ProfileAchievements)**, replace the component code block with the earned-only version from Task 1 and reword the step that mentions «незаработанные приглушены» to «показываются только открытые; иначе строка-заглушка». Add a footnote at the end of the file:
```
> Amendment 2026-10-17: ProfileAchievements теперь показывает только открытые достижения.
```

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/specs/2026-10-17-profile-page-design.md docs/superpowers/plans/2026-10-17-profile-page.md
git commit -m "docs: profile achievements show only earned"
```

---

## Self-Review

- Coverage: filter by `earnedIds` (Task 1 Step 1), counter + link preserved (Step 1), empty state (Step 1), docs (Task 2).
- Types: `earnedDefs` is `AchievementDef[]`; `motion.li`/`sr-only`/`def.icon`/`def.condition` are already used; no contract change.
- Placeholder scan: none.
- Verification: typecheck + lint + test (Task 1 Step 2). Optional browser check (`/profile`, 0 earned → placeholder line).
