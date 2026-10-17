# Mobile Responsive UI — Design

**Date:** 2026-10-17
**Branch:** `fix/mobile-responsive-ui`
**Status:** Approved

## Problem

The mobile (< 600px) experience is broken in several places, verified against the
running dev server at a 390px viewport:

1. **Menu labels** — the bottom navigation bar renders icon **and** text label
   for all six items, crowding the bar.
2. **Profile theme buttons** — `ThemeSetting` renders icon + label + check inside
   a `grid-cols-3`; at 390px it is tight and overflows on narrower phones.
3. **Tree rows compressed** — the skill name and the `DifficultyBadge`
   (`легко 4 XP`) share one flex line, so long skill names truncate
   (`Условные конструкц…`).
4. **Roadmap squeezed** — each `GapList` row is a single `flex justify-between`
   line; the skill name, `category · level`, difficulty badge, XP counter and
   progress bar wrap and overlap each other.
5. **Achievements broken** — the group grid is `grid gap-4 md:grid-cols-2`. Below
   `md` (768px) **no column is defined**, so the single auto track grows to the
   content's max-content width: cards render at **483px** while the viewport is
   **390px** (document scroll width **500px**). The page title is genuinely
   `text-2xl` (24px, same as Roadmap) but mobile browsers shrink-to-fit the
   overflowing page, so the title *appears* much smaller.
6. **Zoom allowed** — the Next.js `viewport` export does not disable pinch zoom.
7. **Branch** — work must happen on a dedicated branch.

## Goals

- No horizontal overflow (`document.scrollWidth <= window.innerWidth`) on any
  affected page at 320px, 360px and 390px.
- Readable, non-truncated skill rows on mobile in both the tree and the roadmap.
- Icons-only mobile navigation without losing accessible names.
- Pinch zoom disabled on the viewport.

## Non-goals

- No change to desktop (`nav-lg`, ≥ 840px) or tablet (`nav-md`, 600–840px)
  navigation appearance.
- No change to domain logic, data, scoring or Firestore code.
- No redesign of the terminal/"paper" visual language.

## Approach

Breakpoints already defined in `globals.css`:

```
--breakpoint-nav-md: 600px;
--breakpoint-nav-lg: 840px;
```

All changes are Tailwind responsive utilities and markup, applied file by file.

### 1. Menu icons only — `src/components/shared/Header.tsx`

`MobileNavItem` (bottom bar, rendered only below `nav-md`) drops its label
`<span>`. The icon grows to `h-6 w-6` and the link gains
`aria-label={item.label}` and `title={item.label}` so the icon-only control keeps
an accessible name. `TabletNavItem` and `DesktopNavItem` are untouched.

### 2. Profile theme icons only — `src/components/profile/ThemeSetting.tsx`

The option label becomes `<span className="hidden nav-md:inline">…</span>`.
Icon and `Check` stay. Each button already carries an accessible name through
its visible label text node; when the label is hidden it must expose
`aria-label={option.label}`. Desktop/tablet layout is unchanged.

### 3. Tree two-line rows — `src/components/tree/SkillRow.tsx`,
`src/components/tree/SkillRowReadonly.tsx`

Default (mobile) layout is a column:

- line 1: status marker + skill name (full width, no truncation) + `required`
  tag (interactive variant only);
- line 2: subtopic counter + `DifficultyBadge` (interactive variant), or just
  `DifficultyBadge` (readonly variant).

At `nav-md:` the current single horizontal line is restored. Both
`grid gap-4 md:grid-cols-2` containers in `TreeClient.tsx` gain `grid-cols-1`
so the columns are clamped with `minmax(0, 1fr)` and can never overflow.

### 4. Roadmap stacked card — `src/components/roadmap/GapList.tsx`

Default (mobile) layout is a column inside the row card:

- line 1: status icon + skill name;
- line 2: `categoryName · levelName`;
- line 3: `DifficultyBadge` + `currentScore/maxScore XP` + a full-width
  progress bar.

At `nav-md:` the current single horizontal row (name/meta left, badge + XP + bar
right) is restored. The `truncate` on the meta line is removed in favour of
wrapping.

### 5. Achievements fit width — `src/components/achievements/AchievementsClient.tsx`

The group grid becomes `grid grid-cols-1 gap-4 md:grid-cols-2`. `grid-cols-1`
compiles to `repeat(1, minmax(0, 1fr))`, which clamps the track to the container
width and removes the 500px overflow. Cards therefore span the full width. The
`h1` is already `text-2xl`; once overflow is gone the shrink-to-fit scaling
disappears and the title renders at its true size. No heading class change is
expected — verified visually after the fix.

### 6. Disable zoom — `src/app/layout.tsx`

Add to the `viewport` export:

```ts
initialScale: 1,
maximumScale: 1,
userScalable: false,
```

**Tradeoff:** this removes pinch zoom, which is an accessibility affordance. It is
applied deliberately at the product owner's request.

## Verification

- `npm run lint`
- `npm run typecheck`
- `npm test`
- Playwright at 320 / 360 / 390 / 768px: assert
  `document.documentElement.scrollWidth <= window.innerWidth` on `/tree/junior`,
  `/roadmap`, `/achievements` and the profile view, and screenshot each.

## Risks

- The dev/preview client Firebase session is not authenticated in an automated
  browser, so the bottom bar is not rendered there; item 1 is verified by code
  inspection and screenshots where a session exists.
- Icon-only navigation relies on `aria-label` for screen readers.
