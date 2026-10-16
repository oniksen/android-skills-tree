# App Icon Refresh — Bugdroid in Claude Code style

Date: 2026-10-17
Branch: `design/claude-terminal-paper`

## Problem

The `design/claude-terminal-paper` branch refreshed the UI to a terminal-paper
theme (warm paper / ink palette, Anthropic-coral accent, monospace type) and the
header brand became a terminal prompt. The app icon, however, was never updated:
`src/app/icon.svg`, `public/icon-*.png` and `src/app/apple-icon.png` still show
the old dark-navy tile with a blue→fuchsia gradient git-branch mark, and
`src/app/manifest.ts` still declares the old navy `#020617` theme/background.

Result: the browser tab icon, the installed PWA icon and the in-app brand no
longer match the product's visual identity.

## Goal

Replace every user-facing icon — the browser-tab favicon, the PWA / home-screen
icons (regular + maskable), and the iOS apple-touch icon — with one mark: the
Android robot head reimagined in the Claude Code / terminal-paper aesthetic. Then
align the PWA manifest colors and the in-app header brand with the same mark so
all brand surfaces are identical.

## Concept

"Bugdroid reimagined as Claude Code." The **Android robot head** (head only — the
modern Android 12+ mark: dome, two antennae, two round eyes) drawn in the
terminal-paper palette: a **coral** head on a **warm paper** canvas with **ink**
details. Flat and minimal, no literal `>_` prompt inside the mark.

## Palette

Taken from `src/app/globals.css`:

| Role | Token | Hex |
|---|---|---|
| Canvas (paper) | `slate-950` | `#faf9f5` |
| Head fill (coral) | `blue-500` | `#d97757` |
| Head fill, deeper alt | `blue-600` | `#c15f3c` |
| Details (ink) | `white` (inverted) | `#1a1915` |

Optional depth: a subtle coral gradient `#c15f3c → #d97757` echoing the header
`text-gradient`. Fallback if coral reads too faint at 16px: deepen the head to
`#c15f3c` and/or add a hairline ink outline — decided by inspecting the 16/32px
renders.

## Geometry (512×512 master, edge-to-edge)

- Full-bleed paper background, no tile edge, no border.
- Robot head centered, classic Android dome (half-disc, flat bottom) with two
  antennae angled from the top corners and two round eyes.
- Head occupies ~62% of the canvas width and is centered, keeping the whole mark
  inside the maskable safe zone (content must fit the centre 80% circle). Because
  the paper background is already full-bleed, a single master is used for every
  size, including the maskable one — no separate padding.
- Eyes and antennae in ink for legibility; head fill coral.

## Deliverables

| File | Change |
|---|---|
| `src/app/icon.svg` | Rewrite as the master mark. Serves the browser-tab favicon and the manifest `image/svg+xml` entry. |
| `public/icon-192.png` | Re-render full-bleed from the master. |
| `public/icon-512.png` | Re-render full-bleed from the master. |
| `public/icon-maskable-512.png` | Render from the same master (paper fills canvas; head is already inside the safe zone). |
| `src/app/apple-icon.png` | 180×180, opaque paper background (iOS ignores alpha). |
| `src/app/manifest.ts` | `theme_color` and `background_color`: `#020617` → `#faf9f5`. |
| `src/components/shared/Header.tsx` | Lines 59–71: replace the `>_` brand box with the coral robot mark; keep the `android / skill-tree` gradient wordmark. |
| `scripts/generate-icons.mjs` (new) | Reproducible rasterizer: `icon.svg` → PNGs at each size/mask. |
| `package.json` | Add `"icons": "node scripts/generate-icons.mjs"` script. |

Notes:
- `src/app/layout.tsx` already sets `themeColor: "#faf9f5"` in its `viewport`
  export, so browser UI theme color is already correct; only `manifest.ts`
  lags.
- No `favicon.ico` exists and none is added — Next.js serves `src/app/icon.svg`
  as the favicon automatically.

## Generation tooling

`sharp@0.34.5` is already present in `node_modules`. `scripts/generate-icons.mjs`
uses sharp to rasterize `src/app/icon.svg` into the four PNGs, with the maskable
variant rendered from a padded/zoomed copy. No new dependencies.

## Header brand

Replace the `>_` box (`Header.tsx:59-71`) with an inline robot-mark SVG sized to
the current `h-8 w-8` slot, keeping the existing gradient wordmark and the
`nav-md` responsive behaviour. The mark is extracted into a small reusable
component so the header and (optionally) other brand spots share one source.

## Testing & verification

- `npm run lint`, `npm run typecheck`, `npm test` must pass.
- Visual check: inspect the master at 16/32/192/512px and overlay the maskable
  safe-zone circle on `icon-maskable-512.png`.
- Confirm regenerating icons is deterministic (`npm run icons` reproduces the
  committed PNGs).
- Optional test: assert `manifest.ts` returns paper `theme_color` /
  `background_color` and lists the four icons, to lock the color fix.

## Out of scope

- Redesigning any other brand surface.
- Adding `favicon.ico`.
- Changing non-icon artwork (confetti, illustrations, etc.).
