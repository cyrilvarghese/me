# Swiss Army Knife Portfolio — Design Doc

Date: 2026-08-11
Status: Approved (user-authored spec; open decisions resolved in session)

## Source of truth

The user supplied a complete 47-section implementation spec ("Option B: 2D rendered
knife with independently animated transparent layers"). That spec is the design.
This doc records the parameters needed to build, plus the decisions resolved after
the spec was written. Where this doc and the spec conflict, the spec wins unless a
decision below explicitly overrides it.

## What we're building

A single-page portfolio for Cyril Varghese. Central interaction: a 2D Swiss Army
knife that unfolds on scroll, one tool per capability — Research, Product, Design,
Code, AI, GTM. Core message: "Give me the outcome. I'll figure out the rest."

Page flow: Hero → Knife scroll story (600vh sticky) → Outcome transition ("Tools
aren't the point / Outcomes are") → Operating model loop → 3 case studies →
Career expansion → Unknown-problem section → Final knife callback (tools fold
closed) → CTA.

## Decisions resolved in session (2026-08-11)

1. **Art path: AI-generated raster layers.** User choice. Claude writes a per-layer
   generation prompt pack + alignment guide; user generates images externally (no
   image-gen tool available in-session). Until final art exists, the knife renders
   from placeholder SVG layers.
2. **Asset-agnostic knife architecture.** Each tool layer is a component that
   renders either an inline SVG placeholder or an `<img>` raster layer, selected by
   config. Swapping placeholder → final art is a data change, not a code change.
3. **Tool iconography defaults** (regenerable later via prompts):
   - Research: magnifier lens blade
   - Product: compass/reamer
   - Design: pen-nib blade
   - Code: main blade with etched `</>`
   - AI: awl with spark tip
   - GTM: corkscrew
4. **Stack pinned:** SvelteKit 2 + Svelte 5 + TypeScript + GSAP ScrollTrigger.
   Static adapter (it's a static single page). No canvas/WebGL.

## Key build parameters (from spec)

- Canvas coordinate system: 2000×2000; shared hinge at x=1010, y=1260 →
  `transform-origin: 50.5% 63%` on every tool layer.
- Layer z-order: rear shadow 10 · research 20 · product 30 · design 40 · body 50 ·
  code 60 · ai 70 · gtm 80 · highlight 90 · labels 100. (Research/product/design
  emerge behind the body; code/ai/gtm in front.)
- Open angles (starting values, tuned visually): research 72, product 42,
  design 18, code −22, ai −48, gtm −76. Closed = 0 for all.
- Knife section: 600vh tall, stage `position: sticky; top: 0; height: 100vh`.
- Scroll windows: intro 0–.10, research .10–.23, product .23–.36, design .36–.49,
  code .49–.62, ai .62–.75, gtm .75–.88, complete .88–1.
- Easing: `power3.inOut` with small mechanical overshoot (e.g. 0→68→73→72), tied
  to scroll progress, not autonomous time.
- Palette: bg #0E0E0E, fg #F1EFEA, secondary #99958E, one muted brass/champagne
  accent (picked visually).
- Type: editorial serif (hero/statements) + grotesk (body) + mono (labels/tags,
  0.12–0.18em tracking, uppercase).
- Data model: one `capabilities` array (id, label, statement, tags, openAngle,
  z-position front/back) drives labels, copy, animation, and case-study
  capability indicators.

## Architecture

```
src/lib/data/capabilities.ts     — single source of truth for the 6 tools
src/lib/data/cases.ts            — 3 case studies
src/lib/components/knife/
    KnifeStage.svelte            — sticky stage, owns the GSAP timeline
    KnifeLayer.svelte            — one layer: SVG placeholder or raster img
    placeholders/*.svelte        — inline SVG placeholder art per layer
src/lib/components/sections/     — Hero, OutcomeTransition, OperatingModel,
                                   CaseStudy, Career, UnknownProblem, FinalCTA
src/routes/+page.svelte          — assembles the narrative
static/assets/knife/             — final raster layers land here (webp/avif)
docs/knife-art-prompts.md        — generation prompt pack + alignment guide
```

## Accessibility & performance (binding requirements)

- `prefers-reduced-motion: reduce` → knife shown fully open, no sticky scroll
  hijack, capabilities listed sequentially, opacity-only transitions.
- All knife-communicated information also exists as text.
- Initial JS < 200KB gz; hero assets < 1.5MB; full knife set < 3MB; preload body +
  first tool only; lazy-load case visuals.

## MVP boundary

Build now: hero, knife interaction, 6 tools, scroll narrative, outcome transition,
operating loop, 3 cases, career, unknown-problem, CTA, responsive, reduced-motion.
Later: case detail pages, blog, CMS, 3D, sound, filtering, custom cursors.

## Definition of done

A new visitor can answer within one minute: what Cyril does (ships ambiguous
problems), what's unusual (operates across product/design/code/AI), whether it's
proven (three shipped systems), and why it fits a Founder's Office role
(owns outcomes that don't fit a job description).
