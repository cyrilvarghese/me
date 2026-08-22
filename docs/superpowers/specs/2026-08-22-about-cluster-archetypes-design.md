# About-page cluster archetypes — design

**Date:** 2026-08-22
**Status:** approved (Cyril, in conversation)
**Builds on:** the About long-version page (`src/app/about/`, commit 5573e61)

## Problem

Every chapter on `/about` lays its pictures out with the same seeded
scatter — a loose grid with ±7° of jitter. But the chapters illustrate
very different objects: a wall of film posters, one laptop with stickers,
a spill of sketchbooks, product screens, client logos. One composition
played six ways makes the seeds imperceptible and the page monotonous;
it also lets tall cards overflow the cluster box, because the scatter
never knows a card's height.

The reference (Cyril's earlier Framer site) does the opposite: each
section's pictures sit the way that kind of object actually sits —
posters in a tidy grid, sketchbooks strewn and tilted, one hero tablet —
and each chapter row is vertically centred on the page's spine.

## Decisions (Cyril, 2026-08-22)

- Chapter 02 is rebuilt as a base laptop-lid photo plus separate
  transparent sticker images that pop onto it. Assets will be supplied
  that way.
- Chapter 06's five client logos: frameless wall — even grid, no card
  chrome, sliding in. Not sticker-popped, not framed.
- Placeholder frames stay; no real photos are wired in by this change.
  `public/assets/New folder/` is left untouched.
- Chapter rows centre vertically on the spine; the red stop-dot moves to
  the row's middle.

## 1 · Layout module

`src/lib/scatter.ts` → `src/lib/cluster-layout.ts`. One export:

```ts
layout(kind: LayoutKind, ratios: number[], boxRatio: number, seed: number): Card[]
```

Seeded mulberry32, as before — the page is a static export hydrated in
the browser, so placement must be identical on server and client, and
stable across builds. `Card` keeps `left / top / width / rotate / z /
from` (all % of the cluster box; `from` in px) and gains `pop?: true`.

New invariant: the module computes each card's height in box-percent
(`h = w × boxRatio ÷ shotRatio`) and packs every archetype to fit —
overflow out of the cluster box becomes structurally impossible.

Five kinds. Rotation belongs to paper: only `pile` (±9°) and `stickers`
(±6°) tilt.

| kind | composition |
|---|---|
| `wall` | flush grid, even gaps, centred in the box, rotation 0. A full grid gets a slight alternating column shift (middle column rides high); a short last row centres instead of staggering. |
| `single` | one card fills the box, centred. |
| `pile` | the old scatter's spirit — overlap, tilt, tops clamped inside the box. |
| `cascade` | big→small down the diagonal, straight, later cards painted on top; tall shapes width-capped so a portrait screen cannot blow the box. |
| `stickers` | card 0 is the surface, laid out like `single`; the rest are small cards (≤20% width) scattered over its middle with an inset so none peels off an edge, each flagged `pop`. |

## 2 · Arrival, per kind

Everything stays inside the site's reveal contract: hidden state in
`.fx-hidden` / `--fx-from` (globals.css, behind `prefers-reduced-motion:
no-preference`), Framer `whileInView` with `initial={false}`.

- **Slide kinds** (`wall`, `pile`, `cascade`, `single`): `--fx-from:
  translate(x, y)` from the outside-in vector — a card arrives from the
  side of the cluster it sits on; a centred card rises.
- **Pop cards** (`stickers`): `--fx-from: scale(0.4)`, animated to
  `scale(1)` with a back-out ease `[0.34, 1.56, 0.64, 1]`, delayed
  ~0.3 s plus stagger so the lid is down before stickers land.

Reduced-motion readers get the finished composition: rest state carries
no scale and the rotation lives in a custom property on the card, so
there is no tween to undo.

## 3 · Data

`about-story.ts`: each `gallery` gains `kind: LayoutKind`. `Shot` gains
`bare?: boolean` — that card renders without border, shadow, radius or
background (the dashed placeholder slot still draws while `ready:
false`).

- 01 childhood → `wall` (six posters)
- 02 ropes → `stickers`: shot 1 the lid (`3 / 2`), shots 2–6 sticker
  logos (`1 / 1`), stickers `bare`
- 03 sabbatical → `pile`
- 04 vr → `single`
- 05 product → `cascade`
- 06 solo → `wall`, all five logos `bare`
- 07 casechat, 08 yuvabe → `cascade`
- 09 sparetime → `pile`

## 4 · Page alignment

`about.module.css`: `.chapter` → `align-items: center`; the stop-dot
(`.chapter::after`) moves to `top: 50%`; `.last::before` ends at the dot
(`bottom: 50%`) so the thread terminates at the final stop. The mobile
(≤900px) stacked layout is unchanged.

## 5 · Tests

`src/lib/cluster-layout.test.ts`: determinism per seed; every card
inside the box for the real chapter configurations; rotation only on
`pile`/`stickers`; `single` fills the box; `wall` cards never overlap;
empty in, empty out.

## Not changing

The reveal contract in `motion.ts`/`globals.css`, the mobile 2-up
cluster stack, copy, the placeholder-slot mechanism, anything outside
`/about`.

## Verification

`npm test`, `npm run check`, then `scroll-shots.mjs` against the running
dev server (it really scrolls, so `whileInView` reveals fire) at desktop
width and at ≤900px stacked width.
