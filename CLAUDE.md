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
- **Do not create new one-off probe/debug scripts without asking Cyril first**
  (user rule, 2026-08-15). Use the two scripts above; if a new script seems
  needed, ask before writing it, and delete any temporary script in the same
  change that stops needing it.

## Architecture

**Everything is driven by `src/lib/data/capabilities.ts`** — id, label,
statement, tags, hover copy, `openAngle`, and back/front layer for the six
tools. The knife layers, GSAP rotations, orbit labels, and narrative panels
all render from this one array; `scroll.ts` holds the
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
unfold), `OutcomeTransition` (625vh morph: knife dissolves → six discipline
circles converge/overlap → merge into one ring → compass whose needle finds
north, then ~105vh of snap-free runway where the time-based needle hunt
plays without blocking scroll; travel/navigation is the metaphor from there
on), `FinalCTA` (300vh fold-back in reverse order). The compass (`src/components/compass/CompassRose`)
shares the knife's element language, including the identical center pin.
`Career` is a fourth knife scene without GSAP: a sticky knife reconfigures via
CSS transitions (`animated` prop) as IntersectionObserver activates experience
entries — each role opens only the blades in its `caps`
(`src/lib/data/experience.ts`; entries are one-liners + one impact line by
user rule). Each builds one GSAP timeline
inside `useGSAP` with a `duration: 1` spacer tween so tween positions are
literally the scroll fractions from `scroll.ts` (OutcomeTransition's spacer
is `DUR = 1.25`: positions 0–0.97 are the story at unchanged pacing, the
rest is compass runway — snap beats and `onUpdate` thresholds there live in
timeline time, ÷ `DUR` to get progress). All timelines live inside
`gsap.matchMedia`: mobile (≤768px) compresses angles ×0.8 and hides orbit
labels; reduced-motion builds **no** timelines — CSS renders the story static
and open via the `--open` custom property (`rmOpen`/`rmClosed` in
`knife.module.css`) and `!important` overrides in the section modules.

**Animation library split** (deliberate — keep it): GSAP ScrollTrigger owns the
three scrubbed pinned sections and the hover-dim; Framer Motion (`motion`
package via `LazyMotion`/`m` in `MotionProvider.tsx`, strict mode — always
import `m`, never `motion.*`) owns the time-based `whileInView` once-reveals
(OperatingModel, CaseStudies, Career, UnknownProblem). Reveal starting states
live in the `.fx-hidden` class in `globals.css`, gated behind
`@media (prefers-reduced-motion: no-preference)` with the per-element offset in
`--fx-from` — components use `initial={false}` so reduced-motion users get
visible content straight from CSS. Don't move hidden states into `initial`
props (breaks reduced motion) and don't add framer to the scrubbed sections.

**Visual system**: tokens in `src/app/tokens.css` — black/white/red Swiss
palette (bg `#151111`, fg `#f8f4f2`, accent `#ea0000`). Every neutral —
including the knife steels in `placeholders/common.ts` and compass strokes —
carries a ~2% tinge of the accent; never plain black or plain white (user
rule, 2026-08-16, dialed down 30% same day). Red is decorative and large-type only; it fails AA
contrast for small text on this background. Type
is Fraunces + Work Sans + JetBrains Mono via `next/font`; the display face has
hand-tuned baked axes (`'opsz' 56, 'SOFT' 30, 'WONK' 0.9`, weight 380 in
`.serif-display`) — Cyril chose these deliberately, don't normalize them.
Sizes come from a **ten-rung ladder** in `tokens.css` (`--text-display` →
`--text-fine`, 11 px floor), set for reading rather than UI density; a size
between rungs carries a comment saying why. The SVG diagrams can't read the
vars, so the same rungs are restated in viewBox units in the
`case-study-diagrams` skill. All ten are shown at true size on `/design`.

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
- **Copy follows the `portfolio-copy` skill** (`.claude/skills/portfolio-copy/`)
  — clarity first, never performed cleverness; titles name their content
  plainly. Invoke it before writing or editing any user-facing copy.
- **Case-study diagrams follow the `case-study-diagrams` skill**
  (`.claude/skills/case-study-diagrams/`) — one hue (red only on the moment
  that matters), mono text, markers at 246 units/second, finished states
  hold, no inner frames. Its Scenes section covers drawings of rooms and
  figures — flat fills separated by value, a `#c98080` tinge on the object
  that needs attention — and Supplied marks covers figures built from given
  artwork: light disc, HTML when the text wraps, rails that point. Every
  wide diagram is drawn twice — a `-mobile.svg` laid out again for the
  width, passed as `CaseFigure`'s `diagramMobile`. `/labs` is the drafting
  route. Invoke it before drawing or editing any diagram.
- **Controls all come from the `.btn` voices in `globals.css`** — accent
  outline, square corners (`--radius: 0`), accent fill on hover; variants
  `.btn-ghost` (hairline border) and `.btn-icon` (square, `--control-size`).
  Never hand-roll a button in a module; geometry tokens (`--radius`,
  `--radius-sm`, `--control-*`) live in `tokens.css` and both are shown live
  on `/design`, which is the reference for anything new.
