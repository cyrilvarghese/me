# Case-Study Detail Pages — Design

**Date:** 2026-08-16 · **Status:** approved-pending-review · **Builds on:** `2026-08-11-swiss-army-knife-portfolio-design.md` (this was its explicit "Later: case detail pages" item)

## Goal

Each case-study card on the home page opens into a full detail page. The three
case studies are different kinds of stories, so what is **common** is the way
in — the card's preview visual expands to take up the whole viewport and
becomes the detail page's hero (Cyril's sketch: arrows from the visual's
corners to the screen corners) — while the page **content** composes freely
per case from shared primitives.

## Decisions (user-approved 2026-08-16)

1. **Real URLs.** Each case is a statically-exported route — shareable,
   refresh and back button work. Not an in-page overlay.
2. **Shared shell + free sections.** Same hero (expanded visual +
   num/category/headline) and closing CTA on every page; between them each
   case composes its own sections (01: problem / pain points / solutions;
   02: user journey / system thinking; 03: prose + stats + screens).
   Unwritten content ships as clearly-marked "Mock" placeholder copy.
3. **Real covers now.** All three covers exist:
   `/assets/CreativeOS/cover.png`, `/assets/CaseChat/thumbnail.png`,
   `/assets/MSIG/cover.png`.

## Transition mechanism

**React `ViewTransition` shared-element morph** — first-class in the
installed Next 16.3 (verified in `node_modules/next/dist/docs/01-app/02-guides/view-transitions.md`;
no config flag; `import { ViewTransition } from "react"` resolves via Next's
compiled React canary).

- Both endpoints wrap the *same* visual component in
  `<ViewTransition name={`case-visual-${slug}`} share="morph" default="none">`.
  `default="none"` stops unrelated transitions from crossfading every named
  visual; **it must always be paired with the explicit `share`** — with
  `default="none"` and no `share`, the pair silently stops morphing (guide
  warning, worth restating wherever this code is touched).
- Morph plays only when the destination renders in the same commit as the
  navigation — true for **prefetched** static routes. Prefetch is
  production-only, so dev never morphs; judge only against `next build`.
- Intercepting routes are unsupported under `output: "export"` — the modal
  interception pattern is off the table by construction.
- Supporting CSS in `globals.css`: `::view-transition { pointer-events: none }`,
  a `.morph` group duration (~420ms), the site-header pin (below), and a
  reduced-motion block zeroing all `::view-transition-*` durations —
  consistent with the repo rule that reduced-motion is handled in CSS.
- Scroll gotcha (Next 16 behavior change): the router no longer overrides
  CSS `scroll-behavior: smooth` during navigation, so the scroll-to-top
  would animate *during* the morph. Fix: `data-scroll-behavior="smooth"`
  on `<html>` in `layout.tsx`.
- TypeScript: `ViewTransition` types live behind `@types/react`'s canary
  entry. Opt in with a single `src/types/react-canary.d.ts` containing
  `/// <reference types="react/canary" />`. (A tsconfig `types` array would
  silently disable automatic `@types/*` inclusion — rejected.)
- Reverse morph (detail → home) is best-effort: it needs the card rendered
  in-viewport in the same commit. Failure degrades to a plain crossfade —
  acceptable, by design of `default="none"`.

## Routes and chrome

- Route: `src/app/work/[slug]/page.tsx`. Static export requires
  `generateStaticParams()` **and** `export const dynamicParams = false`.
  `params` is a Promise in Next 16 — `PageProps<'/work/[slug]'>` + `await`.
  Per-page `generateMetadata` from case data (headline title, `built` as
  description, cover as OG image).
- **Chrome is page-owned, not layout-owned** (matches `page.tsx` today; no
  route group). Reason: header nav must render `/#work`-style links on
  detail pages (no `#work` target exists there) but keep raw `#work`
  anchors on home where SmoothAnchors/GSAP own the glide. A shared layout
  would force a client conversion (`usePathname`). `/design` stays bare;
  ScrollRuler stays home-only.
- `Header` gains `sub?: boolean` (link variants) and
  `style={{ viewTransitionName: "site-header" }}`; globals pin it during
  transitions (`::view-transition-group(site-header) { animation: none }`,
  old snapshot hidden) so the fixed header never appears to move.

## Data model

`CaseStudy` in `src/lib/data/cases.ts` gains:

- `slug: string` — `creative-os` · `case-chat` · `msig` (1:1 with asset folders)
- `cover?: string` — public path to the card/hero image

`data.test.ts` locks: slugs unique and URL-safe; cover paths under
`/assets/` and present on disk. Long-form detail copy does **not** live in
`cases.ts` — it stays JSX (see next section), keeping the data module as
shared shell fields only.

## Components (all server components, per-component CSS Modules)

`src/components/case/`:

- **`CaseVisual`** — the one framed visual used by *both* morph endpoints:
  hairline border, `--surface` ground, red corner brackets (moved verbatim
  from `CaseStudies.module.css`), cover `<img>` absolute-filled with
  `object-fit: cover`, or the "Interface visual — in production" caption
  when coverless. Decorative (`aria-hidden`); sizing comes from the caller.
- **`CaseShell`** — shared page template: full-bleed `100svh` hero (the
  morph target wrapping a filled `CaseVisual`), bottom scrim via
  `color-mix` with `--bg` (tokens — never plain black), hero text
  (`← Work` link, accent mono `num / category`, `serif-display` headline at
  `--text-statement`), then `{children}`, then the closing CTA (hairline,
  serif line, mailto button in FinalCTA's voice, `← All work`). No knife,
  no GSAP on detail pages.
- **`CaseSection`** — labeled prose row: mono eyebrow (muted) / content
  two-column grid, optional `serif-display` heading (`--text-h3`),
  `mock?: boolean` renders a small mono "Mock" tag. Home-card rhythm
  (`clamp(3.5rem, 8vh, 6rem)` padding, hairline top).
- **`CaseGallery`** — `CaseVisual`-framed lazy `<img>` grid (1–2 columns),
  mono captions. MSIG's webp/avif are distinct images, not format pairs —
  plain `<img>` per file (`images.unoptimized` is already the site policy).
- **`CaseStats`** — the card results grid, extracted: serif values with the
  baked Fraunces axes, mono labels, 4→2 columns at 900px.

Per-case content: `src/components/case/content/{creative-os,case-chat,msig}.tsx`
composed from the primitives, plus an `index.ts`
`Record<slug, ComponentType>` registry the route resolves. Chosen over a
data-driven block union: three consumers with deliberately different
shapes, and this repo's copy voice lives in JSX.

## Card changes (`CaseStudies.tsx`)

- The aside visual becomes
  `<Link href={/work/…} aria-label="Open case study: …">` wrapping the
  `ViewTransition` wrapping `CaseVisual` (cover-fed). `Explore →` becomes a
  real `Link` (hover to `--fg`); the "coming soon" title goes away.
- **Reveal restructure:** today's `m.article` fx-hidden reveal would leave
  the remounted card at `opacity: 0` during back-navigation, so the reverse
  pair could never form. The article becomes plain; the
  `m.div` reveal (same `fx-hidden` / `initial={false}` / `whileInView`
  contract) moves to the text column only; the visual is statically
  visible. The reduced-motion CSS pattern is untouched.

## Constraints carried forward

- Static export stays (`output: "export"`); no new dependencies; initial-JS
  budget unaffected (detail pages are all-server — the only client JS is
  Next's own Link runtime).
- Copy rules: compressed; never "Swiss Army knife"; no
  passionate/ninja/rockstar/10x/polymath/jack-of-all-trades; red is
  decorative/large-type only; every neutral keeps the ~2% accent tinge.
- Motion split: no framer on scrubbed sections, `m` only (LazyMotion
  strict), **no `domMax` upgrade** — the morph is browser-native, framer is
  not involved in it.

## Verification

1. `npm test` (data invariants), `npm run build` (must emit
   `out/work/{creative-os,case-chat,msig}.html`), then `npm run check`
   (route types regenerate on build — check before build fails on
   `PageProps<'/work/[slug]'>`).
2. Serve the export (`npx serve out -l 3100`; cleanUrls maps `/work/msig`)
   and screenshot with the existing `scripts/shot.mjs` only: each detail
   page, the home covers, one reduced-motion pass. No new probe scripts.
3. Manual production-serve check: card → expand → hero morph; browser back;
   header pinned; `/#work` from a detail page lands on the work section.
   Dev mode not morphing is expected, not a bug.

## Risks accepted

Safari/Firefox may animate differently (unsupported browsers navigate
plainly); cover crop shifts during the morph (16/10 → viewport,
`object-fit: cover` at both ends — an optional brief blur keyframe can mask
it, judge from screenshots); the header's frozen backdrop-blur may flash for
the transition's duration; `whileInView` reveals replay on back-nav
(pre-existing class of behavior).

## Out of scope

Case-study content beyond Mock-marked scaffolding (Cyril writes the real
copy); the evidence-drawer idea from spec §19 (superseded by these pages);
blog/CMS/filtering (still "later" per the original spec).
