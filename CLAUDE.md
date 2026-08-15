# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this is

Cyril Varghese's single-page portfolio: a 2D Swiss Army knife that unfolds on
scroll, one tool per capability (Research · Product · Design · Code · AI · GTM).
Next.js App Router static export + GSAP ScrollTrigger. The full design spec
lives in `docs/superpowers/specs/2026-08-11-swiss-army-knife-portfolio-design.md`,
the build plan in `docs/superpowers/plans/2026-08-11-knife-portfolio.md`.

## Commands

- `npm run dev` — dev server. Cyril usually has his own instance on port 3000;
  a second instance either shifts to 3001 or refuses with "Another next dev
  server is already running" (stale/foreign lock — check the PID it prints
  before killing anything).
- `npm run build` — static export to `out/` (must stay `output: "export"`).
- `npm run check` — `tsc --noEmit`; there is no ESLint config.
- `npm test` — Vitest. Single test: `npx vitest run src/lib/data/data.test.ts -t "scroll windows"`.
- Visual verification: `node scripts/shot.mjs <url> <out.png> [w h] [reduce] [full]`
  and `node scripts/scroll-shots.mjs <url> <selector> "0.2,0.5" <prefix> [w h]`
  screenshot the running dev server via playwright-core + system Edge. Scripts
  must live inside the repo (ESM resolves `playwright-core` from here). Visual
  changes are verified by screenshotting, not assumed.

## Architecture

**Everything is driven by `src/lib/data/capabilities.ts`** — id, label,
statement, tags, hover copy, `openAngle`, and back/front layer for the six
tools. The knife layers, GSAP rotations, orbit labels, narrative panels, and
case-study ●/○ indicators all render from this one array; `scroll.ts` holds the
shared scroll-window math (intro ends 0.10, six 0.13 windows, complete at
0.88), and `data.test.ts` locks both invariants.

**The knife** (`src/components/knife/`): `KnifeCanvas` stacks full-canvas
layers on a square; every tool layer shares `transform-origin: 50.5% 63%` (the
hinge), so opening a tool is a single rotation. z-order: research/product/design
(20–40) behind `body` (50), code/ai/gtm (60–80) above it, `front-scale` (90) on
top — tools hide *between* the two scales when closed. Tools are drawn closed,
pointing left; positive angles swing up, negative down. Art is switchable:
`art.ts` `ART_MODE` flips placeholder SVGs → raster WebP from
`public/assets/knife/` (generation prompts + alignment contract in
`docs/knife-art-prompts.md`).

**Scroll choreography**: three pinned scrub sections — `KnifeStory` (600vh
unfold), `OutcomeTransition` (250vh dissolve: labels → blades → body → type),
`FinalCTA` (300vh fold-back in reverse order). Each builds one GSAP timeline
inside `useGSAP` with a `duration: 1` spacer tween so tween positions are
literally the scroll fractions from `scroll.ts`. All timelines live inside
`gsap.matchMedia`: mobile (≤768px) compresses angles ×0.8 and hides orbit
labels; reduced-motion builds **no** timelines — CSS renders the story static
and open via the `--open` custom property (`rmOpen`/`rmClosed` in
`knife.module.css`) and `!important` overrides in the section modules.

**Visual system**: tokens in `src/app/tokens.css` — black/white/red Swiss
palette (bg `#111111`, fg `#f8f8f8`, accent `#ea0000`). Red is decorative and
large-type only; it fails AA contrast for small text on this background. Type
is Fraunces + Work Sans + JetBrains Mono via `next/font`; the display face has
hand-tuned baked axes (`'opsz' 56, 'SOFT' 30, 'WONK' 0.9`, weight 380 in
`.serif-display`) — Cyril chose these deliberately, don't normalize them.

## Conventions

- Stack is Next.js + React by explicit user decision (replaced the spec's
  SvelteKit recommendation). Don't propose Svelte here.
- The `AGENTS.md` block is auto-written by `next dev`; commit it rather than
  deleting it.
- Copy rules from the spec: never write "Swiss Army knife" in site copy (the
  visitor discovers the metaphor visually); avoid "passionate", "ninja",
  "rockstar", "10x", "polymath", "jack of all trades". Keep copy compressed.
- Section styling is per-component CSS Modules; shared voices are the
  `.mono-label` / `.serif-display` / `.section-shell` classes in `globals.css`.
  Animate only `transform` and `opacity`.
