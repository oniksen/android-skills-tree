# Instant menu navigation + route-matched placeholder

Date: 2026-10-16
Status: implemented

## Problem

Clicking any header menu item (`/dashboard`, `/tree/junior`, `/projects`, `/roadmap`,
`/achievements`) could hang for a long time — the old page stayed on screen with only the
`useLinkStatus` pending dot spinning, then the new page appeared all at once.

## Root cause

Every target page is dynamic (`getCurrentUser()` reads `cookies()`), and each has a
`loading.tsx`. On a client navigation Next only renders the target's `loading.tsx` if the
target shell was prefetched. Two facts in this Next version:

- `next/dist/client/app-dir/link.js` disables automatic prefetch unless
  `NODE_ENV === 'production'` (~L110, ~L334).
- Even in production, dynamic routes only prefetch "layout to the first loading boundary".

So in `next dev` every click waits for a server roundtrip (on an uncompiled route, also for
Turbopack's on-demand compile) before anything swaps, with no fallback shown.

Measured on the equivalent dynamic route: cold nav committed at 661 ms with a 630 ms RSC
request and no placeholder; warm navs ~80 ms.

## Fix

Optimistic placeholder in the client `Header`, reusing the existing per-route skeletons.

- `src/components/shared/Header.tsx`
  - `ROUTE_SKELETONS` maps href -> existing skeleton
    (`DashboardSkeleton`, `TreeSkeleton`, `ProjectsSkeleton`, `RoadmapSkeleton`,
    `AchievementsSkeleton`, `ShopSkeleton`; fallback `TreeSkeleton`).
  - `RoutePlaceholder` renders the mapped skeleton.
  - Nav items take an `onNavigate(href)` prop; `handleNavigate` records
    `pending = { href, startedPath: pathname }` unless the link is already the current path.
  - `isNavigating` is derived (`pending.startedPath === pathname`) — no reset effect needed;
    when the route commits, `pathname` changes and `isNavigating` becomes false.
  - A `setTimeout(120)` (no synchronous `setState` in the effect body) marks the pending
    object ready; the placeholder shows only while `readyPending === pending`, giving a
    120 ms delay so fast production navigations don't flash a skeleton.
  - `<main>` renders the placeholder instead of `children` while navigating-and-ready.

## Behavior

- Click -> old page for ~120 ms -> route-matched skeleton -> real page when the RSC arrives.
- Clicking the active item does nothing. Browser back/forward clears the pending state
  because `pathname` changes. Revisiting the same destination re-arms the delay because
  readiness is tied to the pending object's identity.

## Verification

- `npm run typecheck` — pass.
- `npx eslint src/components/shared/Header.tsx` — clean.
- `npm test` — 124 tests pass.
- Manual dev check: click each nav item; skeleton appears ~120 ms after the click and the
  real page swaps in when the server responds.

Note: repo-wide `npm run lint` still reports 4 pre-existing `react-hooks/set-state-in-effect`
errors in `src/hooks/*` (untouched by this change).

## Deferred / alternative

Official Next mechanism (`cacheComponents: true` + `export const unstable_instant`) was not
used: project-wide change, and dev prefetch is production-only so it would not help the dev
hang.
