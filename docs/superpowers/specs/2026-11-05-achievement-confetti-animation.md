# Design: Achievement Tier Confetti (Advanced Animation)

Date: 2026-11-05  
Branch: `feat/advanced-animations`  
Status: Draft for implementation

## 1. Goal

When a user earns a **new** achievement, show a full-screen celebration overlay:

- Center: icon of the **tier** the achievement reached.
- Around it, in **left and right side sectors**: confetti particles.
- Particle count grows from lower tiers to higher tiers.
- Rendering should be GPU-friendly (WebGL point sprites), with a Canvas 2D fallback.

This is an exploration of advanced animation capabilities in the current Next.js project without changing backend/data contracts.

## 2. Non-goals

- No changes to Firestore schema, repositories, or achievement evaluation logic.
- No persistence of celebration state.
- No sound effects.
- No animation for achievements that already existed before page load.
- No changes to protected routing or static page behavior.

## 3. Compatibility constraints (from project rules)

Every design decision below must remain compatible with these existing constraints:

1. **Static/SSG pages**: `(app)` pages must stay static/prefetchable. The celebration is a client-only component rendered through an existing client component (`Header`), not a server data fetch.
2. **Firestore listener quota**: Reuse existing `useAchievements` listener. Do not create a new `onSnapshot`. The watcher consumes already-shared state.
3. **Live store lifecycle**: `useAchievements`, `useAssessments`, `useStreak` remain the single sources of truth. The watcher does not subscribe independently.
4. **Client bundle size**: Keep WebGL/Canvas code in a client component only. Do not import it from server components or study material modules.
5. **Reduced motion**: Respect `prefers-reduced-motion: reduce`.
6. **Accessibility**: Overlay must not trap focus or block interaction (`pointer-events-none`).
7. **No generated-file edits**: No changes to `study-materials.generated.ts` or similar generated artifacts.
8. **TypeScript/lint/test gate**: Implementation must pass `npm run lint`, `npm run typecheck`, `npm test`.

## 4. High-level architecture

```
Header (client)
  └── AchievementUnlockWatcher (client)
        ├── reads useAchievements / useAssessments / useStreak
        ├── detects newly added achievement ids
        ├── maintains a FIFO queue of celebration items
        └── renders AchievementCelebration (portal)
              ├── center tier icon (motion)
              └── <canvas> rendered by particle-burst runner (WebGL/Canvas2D)
```

The watcher is mounted once in `Header` when `showNav` is true, so it is active for all authenticated app pages.

## 5. Detection of a new achievement

### 5.1 State

In `AchievementUnlockWatcher`:

- `knownIdsRef: React.MutableRefObject<Set<string> | null>`
- `latestRef` holding latest `assessmentMap` and `longestStreak`
- `queue: CelebrationItem[]`
- `current: CelebrationItem | null`

### 5.2 Algorithm

On `achievements` change:

1. Build `ids = new Set(achievements.map(a => a.id))`.
2. If `knownIdsRef.current === null`:
   - set `knownIdsRef.current = ids`
   - return (no celebration for pre-existing achievements)
3. Compute `added = [...ids].filter(id => !knownIdsRef.current.has(id))`.
4. If `added.length === 0`:
   - update `knownIdsRef.current = ids`
   - return
5. For each added id:
   - find `achievement` in current list
   - find `def` in `getAchievementCatalog()` using `def.matches(achievement)`
   - compute `status = getAchievementProgress(def, { assessmentMap: latestRef.assessmentMap, streakDays: latestRef.longestStreak })`
   - `tier = status.tier ?? achievement.tier ?? null`
   - `tierIndex = ACHIEVEMENT_TIERS.findIndex(t => t.name === tier)`
   - `count = tierIndex < 0 ? 48 : Math.min(48 + (tierIndex + 1) * 24, 432)`
   - `icon = tier ? ACHIEVEMENT_TIER_ICONS[tier] : (def?.icon ?? "🏆")`
   - push `CelebrationItem { id, title: def?.title ?? "Достижение", tier, icon, count }`
6. Append items to `queue`.
7. Update `knownIdsRef.current = ids`.

### 5.3 Queue processing

- If `current === null` and `queue.length > 0`, set `current = queue[0]`, remove it from queue.
- `AchievementCelebration` calls `onDone` after animation completes.
- `onDone` sets `current = null`, allowing next item.

### 5.4 Compatibility notes

- Uses existing `useAchievements` subscription; no extra Firestore reads.
- `assessmentMap`/`longestStreak` may load after achievements; `latestRef` ensures latest values are used at detection time.
- Detection is id-based, so reordering or metadata updates do not trigger duplicate celebrations.

## 6. Celebration overlay

### 6.1 Component: `AchievementCelebration`

Props:

```ts
interface AchievementCelebrationProps {
  item: CelebrationItem;
  onDone: () => void;
}
```

Behavior:

- Render through `createPortal(..., document.body)`.
- `fixed inset-0 z-[80]`, `pointer-events-none`.
- Center icon:
  - large emoji/text
  - motion spring scale/opacity
  - subtle backdrop glow
- Canvas covers full viewport.
- Auto-close after animation duration (~3.4s), then `onDone()`.
- Respect reduced motion: skip particles and canvas; show icon fade only; shorter close timeout.

### 6.2 Accessibility

- Canvas has `aria-hidden="true"`.
- Overlay has `role="status"` and `aria-live="polite"` with text like `Получено достижение: {title}`.
- No focus trapping.

## 7. Particle system

### 7.1 File: `src/features/achievements/lib/particle-burst.ts`

Responsibilities:

- Generate particle attributes.
- Run animation using WebGL if available, else Canvas 2D.
- Cancel animation on cleanup.

### 7.2 Particle attributes

For each particle `i` in `0..count-1`:

- `originX`, `originY`: viewport center in CSS pixels.
- `angle`:
  - if `i % 2 === 0`: right sector `-60°..60°`
  - else: left sector `120°..240°`
- `speed`: `120 + random * 260` px/s
- `delay`: `random * 0.25` s
- `life`: `1.6 + random * 1.2` s
- `size`: `4 + random * 6` px
- `color`: from a palette; optionally bias by tier index.
- Gravity: `180` px/s² downward.

### 7.3 Count by tier

| Tier index | Approx count |
|---|---:|
| unknown / no tier | 48 |
| 0 (Камень) | 72 |
| 1 (Агат) | 96 |
| ... | +24 per tier |
| 13 (Алмаз) | 432 |

Formula: `48 + (tierIndex + 1) * 24`, capped at `432`.

### 7.4 WebGL renderer

- Context: `canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false })`.
- One draw call per frame: `gl.drawArrays(gl.POINTS, 0, count)`.
- Vertex shader updates position from `u_time` and per-particle attributes.
- Fragment shader draws circular point sprite and applies alpha.
- Blending: `SRC_ALPHA, ONE_MINUS_SRC_ALPHA`.
- Handle device pixel ratio and resize.
- Cleanup: cancel RAF, delete buffers/programs, lose context if needed.

### 7.5 Canvas 2D fallback

- Same attribute generation.
- Per frame: clear canvas, draw each particle as filled circle with global alpha.
- Used only if WebGL unavailable.

### 7.6 Compatibility notes

- Canvas/WebGL code is client-only and dynamically used inside `useEffect`.
- No server-side execution.
- No new dependencies.
- Reduced motion disables particle generation entirely.

## 8. Sectors

"Side sectors" means two wedges, leaving top/bottom visually cleaner:

- Right wedge: angles `-60° to 60°`.
- Left wedge: angles `120° to 240°`.

This keeps the center icon readable and matches the requested "по боковым секторам".

## 9. Temporary dev/test button

For manual testing on `feat/advanced-animations`:

- Render a small floating button only when `process.env.NODE_ENV !== "production"` or URL has `?debug=confetti`.
- Button: "Тест конфети (random)".
- Action:
  - pick random `AchievementDef`
  - pick random tier from `ACHIEVEMENT_TIERS`
  - enqueue a `CelebrationItem` with computed count/icon
- Optional second button: "Все тиры по очереди" (enqueue all 14 tiers with spacing).
- Remove button and dev branching before merge to `main`, or guard with `NEXT_PUBLIC_DEBUG_CONFETTI=false` by default.

This button does not affect production behavior.

## 10. Files to add/modify

Add:

- `src/features/achievements/components/AchievementUnlockWatcher.tsx`
- `src/features/achievements/components/AchievementCelebration.tsx`
- `src/features/achievements/lib/particle-burst.ts`
- `src/features/achievements/lib/particle-burst.test.ts` (pure helpers)
- `src/features/achievements/components/AchievementUnlockWatcher.test.tsx` (detection logic if extracted)

Modify:

- `src/shared/ui/Header.tsx` — mount watcher when `showNav`
- (optional) `src/app/globals.css` — only if a small CSS fallback is needed; prefer canvas-only.

No changes to Firestore, routes, or generated files.

## 11. Testing plan

Unit tests:

- `detectNewAchievementIds(prev, next)` returns only new ids.
- `getConfettiCount(tier)` increases monotonically by tier index.
- `getTierIcon(tier, fallback)` returns correct icon.
- Reduced-motion helper returns `false` for particle rendering when enabled.

Manual tests:

- Earn a new achievement → overlay appears once.
- Multiple new achievements → sequential overlays.
- Reload page → no celebration for existing achievements.
- Test each tier via dev button → count visibly grows.
- Disable WebGL (DevTools) → Canvas 2D fallback works.
- Enable reduced motion → no particles, icon still appears.

Quality gate:

- `npm run lint`
- `npm run typecheck`
- `npm test`

## 12. Risks and mitigations

| Risk | Mitigation |
|---|---|
| WebGL unavailable | Canvas 2D fallback |
| Too many particles on low-end devices | Cap at 432; RAF cancels on unmount |
| Overlay blocks interaction | `pointer-events-none` |
| Duplicate celebrations on re-render | id-diff with `knownIdsRef` |
| Memory leaks from GL resources | explicit cleanup in effect |
| Bundle bloat | client-only dynamic import inside component |

## 13. Implementation order

1. Pure helpers (`detectNewAchievementIds`, `getConfettiCount`, `getTierIcon`).
2. `particle-burst.ts` with WebGL + Canvas 2D.
3. `AchievementCelebration.tsx`.
4. `AchievementUnlockWatcher.tsx`.
5. Mount in `Header.tsx`.
6. Dev test button.
7. Tests and quality gate.
8. Remove dev-only code before merge.

## 14. Open questions

- Should the center icon use tier emoji only, or combine achievement icon + tier badge? Current plan uses tier emoji only, as requested ("его иконку" = тира).
- Should confetti colors be tier-themed? Current plan uses shared palette; can be enhanced later.
- Should celebration also trigger from achievements page initial load in dev mode? Dev button covers testing; production remains new-only.
