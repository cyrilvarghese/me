# About Cluster Archetypes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Each About-page chapter lays its pictures out the way that kind of object actually sits — poster wall, sticker-covered laptop, sketchbook pile, screen cascade, one hero card — and each chapter row centres on the spine.

**Architecture:** `src/lib/scatter.ts` is replaced by `src/lib/cluster-layout.ts`, one seeded `layout(kind, ratios, boxRatio, seed)` with five composition archetypes that all pack to fit the cluster box. `Cluster.tsx` maps `Card[]` to the existing `.fx-hidden`/`whileInView` reveal, adding a scale-pop arrival for sticker cards and a `bare` (chromeless) card variant. `about-story.ts` names each chapter's `kind`.

**Tech Stack:** Next.js App Router static export, Framer Motion (`m` via LazyMotion strict), CSS Modules, Vitest.

**Spec:** `docs/superpowers/specs/2026-08-22-about-cluster-archetypes-design.md`

## Global Constraints

- Static export: layout must be identical on server and client — seeded PRNG only, never `Math.random()`.
- Reveal contract: hidden states live in `.fx-hidden`/`--fx-from` (globals.css, behind `prefers-reduced-motion: no-preference`); components use `initial={false}`; never move hidden states into `initial` props.
- Import `m` from `motion/react`, never `motion.*` (LazyMotion strict mode).
- Animate only `transform` and `opacity`; pass Framer a string transform, not `x`/`y`.
- Rotation belongs to paper: `wall`, `single`, `cascade` cards are 0°; `pile` ≤ ±9°, sticker cards ≤ ±6°.
- No copy changes; placeholder-slot mechanism unchanged; `public/assets/New folder/` untouched.
- Commit each verified task; never push.

---

### Task 1: The layout module

**Files:**
- Create: `src/lib/cluster-layout.ts`
- Rewrite (draft exists, untracked): `src/lib/cluster-layout.test.ts`
- Leave alone for now: `src/lib/scatter.ts` (still imported by `Cluster.tsx`; deleted in Task 3)

**Interfaces:**
- Produces: `layout(kind: LayoutKind, ratios: number[], boxRatio: number, seed: number): Card[]`, `type LayoutKind = "wall" | "single" | "pile" | "cascade" | "stickers"`, `type Card = { left, top, width, rotate, z: number; from: {x,y}; pop?: true }` (all box-%, `from` px), `TRAVEL_PX = 64`, `MAX_ROTATE = 9`.

- [ ] **Step 1: Write the failing test** — overwrite `src/lib/cluster-layout.test.ts` with:

```ts
import { describe, it, expect } from "vitest";
import { layout, MAX_ROTATE, type LayoutKind } from "./cluster-layout";

/** the real clusters from about-story.ts, one per kind */
const SAMPLES: { kind: LayoutKind; ratios: number[]; box: number; seed: number }[] = [
  { kind: "wall", ratios: [2 / 3, 2 / 3, 2 / 3, 2 / 3, 2 / 3, 2 / 3], box: 4 / 3, seed: 1701 },
  { kind: "wall", ratios: [3 / 2, 3 / 2, 3 / 2, 3 / 2, 3 / 2], box: 3 / 2, seed: 6091 },
  { kind: "single", ratios: [16 / 10], box: 16 / 10, seed: 4177 },
  { kind: "pile", ratios: [3 / 2, 4 / 3, 3 / 2, 4 / 3], box: 4 / 3, seed: 3313 },
  { kind: "cascade", ratios: [16 / 10, 3 / 4, 4 / 3], box: 4 / 3, seed: 5051 },
  { kind: "cascade", ratios: [16 / 10, 16 / 10], box: 4 / 3, seed: 7013 },
  { kind: "stickers", ratios: [3 / 2, 1, 1, 1, 1, 1], box: 3 / 2, seed: 2029 },
];

const heightOf = (width: number, shot: number, box: number) => (width * box) / shot;

describe("cluster layout", () => {
  it("is deterministic for a given seed", () => {
    for (const s of SAMPLES) {
      expect(layout(s.kind, s.ratios, s.box, s.seed)).toEqual(
        layout(s.kind, s.ratios, s.box, s.seed)
      );
    }
  });

  it("keeps every card inside the box", () => {
    for (const s of SAMPLES) {
      for (const [i, card] of layout(s.kind, s.ratios, s.box, s.seed).entries()) {
        const h = heightOf(card.width, s.ratios[i], s.box);
        expect(card.left, `${s.kind} left`).toBeGreaterThanOrEqual(-0.01);
        expect(card.top, `${s.kind} top`).toBeGreaterThanOrEqual(-0.01);
        expect(card.left + card.width, `${s.kind} right`).toBeLessThanOrEqual(100.01);
        expect(card.top + h, `${s.kind} bottom`).toBeLessThanOrEqual(100.01);
      }
    }
  });

  it("only paper tilts: pile and stickers rotate, nothing else", () => {
    for (const s of SAMPLES) {
      for (const card of layout(s.kind, s.ratios, s.box, s.seed)) {
        if (s.kind === "pile" || s.kind === "stickers") {
          expect(Math.abs(card.rotate)).toBeLessThanOrEqual(MAX_ROTATE);
        } else {
          expect(card.rotate).toBe(0);
        }
      }
    }
  });

  it("a single fills the box", () => {
    const [card] = layout("single", [3 / 2], 3 / 2, 1);
    expect(card).toMatchObject({ left: 0, top: 0, width: 100, rotate: 0 });
  });

  it("a wall is flush: no two cards overlap", () => {
    for (const s of SAMPLES.filter((s) => s.kind === "wall")) {
      const cards = layout(s.kind, s.ratios, s.box, s.seed);
      for (let a = 0; a < cards.length; a++) {
        for (let b = a + 1; b < cards.length; b++) {
          const ha = heightOf(cards[a].width, s.ratios[a], s.box);
          const hb = heightOf(cards[b].width, s.ratios[b], s.box);
          const apart =
            cards[a].left + cards[a].width <= cards[b].left + 0.01 ||
            cards[b].left + cards[b].width <= cards[a].left + 0.01 ||
            cards[a].top + ha <= cards[b].top + 0.01 ||
            cards[b].top + hb <= cards[a].top + 0.01;
          expect(apart, `wall cards ${a} and ${b} overlap`).toBe(true);
        }
      }
    }
  });

  it("stickers: the surface holds still and the rest pop", () => {
    const cards = layout("stickers", [3 / 2, 1, 1, 1, 1, 1], 3 / 2, 2029);
    expect(cards[0].pop).toBeUndefined();
    expect(cards[0].rotate).toBe(0);
    for (const sticker of cards.slice(1)) {
      expect(sticker.pop).toBe(true);
      expect(sticker.width).toBeLessThanOrEqual(20);
    }
  });

  it("empty in, empty out", () => {
    expect(layout("pile", [], 4 / 3, 1)).toEqual([]);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/lib/cluster-layout.test.ts`
Expected: FAIL — cannot resolve `./cluster-layout`.

- [ ] **Step 3: Implement** — create `src/lib/cluster-layout.ts`:

```ts
/** Placement for a cluster of pictures, by what the pictures are.
 *
 * The About page's chapters are illustrated by very different objects —
 * a wall of film posters, one laptop, a spill of sketchbooks, a run of
 * product screens, stickers slapped on a lid — and one scatter cannot
 * play all of them. Each `LayoutKind` is a composition: how that kind
 * of object actually sits when you put a handful of them down.
 *
 * Rotation belongs to paper. Posters in a grid and screenshots in a
 * cascade sit straight; only the pile (and the stickers, slightly)
 * tilt, because those are the ones a hand put down.
 *
 * Seeded, never `Math.random()`. Two reasons, both load-bearing: the
 * page is a static export prerendered on the server and hydrated in the
 * browser, so a layout that rolled dice would mismatch and be thrown
 * away on hydration; and a scatter that changed on every build would
 * make every deploy a visual diff nobody asked for. Same seed, same
 * arrangement, forever — pass a different seed to reshuffle a chapter.
 */

export type LayoutKind =
  /** a set of like things — even grid, even gaps, straight */
  | "wall"
  /** one picture that is the whole figure */
  | "single"
  /** physical paper strewn about — overlap and tilt */
  | "pile"
  /** screens stepping down the diagonal, big to small */
  | "cascade"
  /** card 0 is the surface; the rest pop onto it */
  | "stickers";

export type Card = {
  /** all in % of the cluster box, so the box can be any size */
  left: number;
  top: number;
  width: number;
  /** degrees; zero everywhere but the pile and the stickers */
  rotate: number;
  /** paint order */
  z: number;
  /** Where the card comes in from, as a `translate()` argument in px.
      Taken from where the card sits — one on the left of the cluster
      arrives from the left — so a cluster assembles from the outside
      in rather than every piece sliding the same way. */
  from: { x: number; y: number };
  /** arrives by scaling up in place (a sticker slapped on) rather
      than by sliding — the translate above is zeroed */
  pop?: true;
};

/** how far a card travels on the way in — far enough to have a
    direction, short enough to still be a reveal rather than a journey */
export const TRAVEL_PX = 64;

export const MAX_ROTATE = 9;

/** mulberry32 — small, fast, and identical across every JS engine,
    which is what "the server and the browser must agree" requires */
function prng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(Math.max(v, lo), Math.max(lo, hi));
const round = (v: number) => Number(v.toFixed(2));

/** a card's height in box-% — width is % of box width, height % of box
    height, and the two scales differ by the box's own ratio */
const heightOf = (width: number, shotRatio: number, boxRatio: number) =>
  (width * boxRatio) / shotRatio;

/** outside-in: the direction a card arrives from is the side of the
    cluster it already sits on; a card at dead centre rises instead */
function arrival(left: number, top: number, width: number, height: number) {
  const offX = clamp((left + width / 2 - 50) / 30, -1, 1);
  const offY = clamp((top + height / 2 - 50) / 30, -1, 1);
  if (Math.abs(offX) < 0.15 && Math.abs(offY) < 0.15)
    return { x: 0, y: round(TRAVEL_PX * 0.45) };
  return {
    x: round(offX * TRAVEL_PX),
    /* the vertical share is smaller: a card that comes mostly from the
       side reads as sliding in, one that comes mostly from below reads
       as the page's own scroll */
    y: round(offY * TRAVEL_PX * 0.45),
  };
}

/** one picture, as large as the box lets it be, centred */
function single(shotRatio: number, boxRatio: number): Card[] {
  let width = 100;
  let height = heightOf(width, shotRatio, boxRatio);
  if (height > 100) {
    width = (100 * shotRatio) / boxRatio;
    height = 100;
  }
  return [
    {
      left: round((100 - width) / 2),
      top: round((100 - height) / 2),
      width: round(width),
      rotate: 0,
      z: 0,
      from: { x: 0, y: round(TRAVEL_PX * 0.45) },
    },
  ];
}

/** an even grid that fills the box — the character is in the artwork,
    so the placement stays out of the way. A full grid gets a slight
    per-column shift (the middle column rides high, the way a poster
    wall is actually pinned); a short last row centres instead. */
function wall(count: number, ratios: number[], boxRatio: number, seed: number): Card[] {
  const rnd = prng(seed);
  const cols = count <= 2 ? count : Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);
  /* a wall is a set of like things — the first shape speaks for all */
  const shotRatio = ratios[0];

  /* only a full grid can shift whole columns; a short last row is
     centred, and staggering columns above it reads as misregistration */
  const canStagger = rows > 1 && count % cols === 0;
  /* room reserved above and below so the shifted columns stay inside */
  const staggerRoom = canStagger ? 7 : 0;

  let gapX = 4;
  let gapY = gapX * boxRatio;
  let cardW = (100 - gapX * (cols - 1)) / cols;
  let cardH = heightOf(cardW, shotRatio, boxRatio);
  const totalH = rows * cardH + gapY * (rows - 1);
  if (totalH > 100 - staggerRoom) {
    const s = (100 - staggerRoom) / totalH;
    gapX *= s;
    gapY *= s;
    cardW *= s;
    cardH *= s;
  }

  const gridW = cols * cardW + gapX * (cols - 1);
  const gridH = rows * cardH + gapY * (rows - 1);
  const offsetX = (100 - gridW) / 2;
  const offsetY = (100 - gridH) / 2;
  const amp = canStagger ? Math.min(offsetY, 3.5) : 0;

  return Array.from({ length: count }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const inRow = Math.min(cols, count - row * cols);
    const rowShift = ((cols - inRow) * (cardW + gapX)) / 2;
    const colShift = amp === 0 ? 0 : (col % 2 === 1 ? -amp : amp * 0.4) + (rnd() - 0.5);

    const left = offsetX + rowShift + col * (cardW + gapX);
    const top = clamp(offsetY + row * (cardH + gapY) + colShift, 0, 100 - cardH);
    return {
      left: round(left),
      top: round(top),
      width: round(cardW),
      rotate: 0,
      z: i,
      from: arrival(left, top, cardW, cardH),
    };
  });
}

/** paper strewn about: a loose grid pushed hard enough off itself that
    the cards overlap and tilt, without ever burying one */
function pile(count: number, ratios: number[], boxRatio: number, seed: number): Card[] {
  const rnd = prng(seed);
  const cols = count <= 2 ? count : Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);
  const cellW = 100 / cols;
  const cellH = 100 / rows;
  /* cards wider than their cell — the difference is the overlap */
  const cardW = cellW * (count === 1 ? 1 : 1.18);

  return Array.from({ length: count }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    /* the last row is centred when it is short, or a three-of-four
       pile hangs off to one side and reads as a mistake */
    const inRow = Math.min(cols, count - row * cols);
    const rowShift = ((cols - inRow) * cellW) / 2;

    const jitterX = (rnd() - 0.5) * cellW * 0.22;
    const jitterY = (rnd() - 0.5) * cellH * 0.22;
    const rotate = round((rnd() - 0.5) * 2 * MAX_ROTATE);

    const height = heightOf(cardW, ratios[i], boxRatio);
    const left = clamp(
      rowShift + col * cellW + (cellW - cardW) / 2 + jitterX,
      0,
      100 - cardW
    );
    const top = clamp(row * cellH + jitterY, 0, Math.max(0, 100 - height));
    return {
      left: round(left),
      top: round(top),
      width: round(cardW),
      rotate,
      /* alternating, so a card is as likely to sit under its neighbour
         as over it — a monotonic stack always leans the same way */
      z: i % 2 === 0 ? i : count - i,
      from: arrival(left, top, cardW, height),
    };
  });
}

/** screens stepping down the diagonal, largest first, each overlapping
    the one before — the order of the shots is the order of the walk */
function cascade(count: number, ratios: number[], boxRatio: number, seed: number): Card[] {
  const rnd = prng(seed);
  const base = count === 2 ? 72 : 62;

  return Array.from({ length: count }, (_, i) => {
    /* shrink down the walk, but never let a tall shape blow the box —
       a portrait screen at half width is most of the height */
    const width = Math.min(base * 0.82 ** i, (68 * ratios[i]) / boxRatio);
    const height = heightOf(width, ratios[i], boxRatio);
    const t = i / (count - 1);
    const left = clamp(t * (100 - width) + (rnd() - 0.5) * 4, 0, 100 - width);
    const top = clamp(t * (100 - height) + (rnd() - 0.5) * 4, 0, 100 - height);
    return {
      left: round(left),
      top: round(top),
      width: round(width),
      rotate: 0,
      /* later steps sit on top — the walk moves toward the reader */
      z: i,
      from: arrival(left, top, width, height),
    };
  });
}

/** card 0 is the surface (a laptop lid, a case); the rest are stickers
    scattered over its middle, arriving by popping on rather than
    sliding — nobody slides a sticker into place */
function stickers(count: number, ratios: number[], boxRatio: number, seed: number): Card[] {
  const surface = single(ratios[0], boxRatio)[0];
  if (count === 1) return [surface];
  const rnd = prng(seed);
  const n = count - 1;
  const cols = n <= 2 ? n : Math.ceil(Math.sqrt(n));
  const rows = Math.ceil(n / cols);

  /* the region stickers land in: the middle of the surface, clear of
     its edges, so none reads as peeling off */
  const insetX = 14;
  const insetY = 16;
  const regionW = surface.width - insetX * 2;
  const regionH = heightOf(surface.width, ratios[0], boxRatio) - insetY * 2;
  const cellW = regionW / cols;
  const cellH = regionH / rows;

  const cards: Card[] = [surface];
  for (let i = 0; i < n; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const inRow = Math.min(cols, n - row * cols);
    const rowShift = ((cols - inRow) * cellW) / 2;

    const width = Math.min(cellW * 0.72, 20);
    const height = heightOf(width, ratios[i + 1], boxRatio);
    const left =
      surface.left + insetX + rowShift + col * cellW + (cellW - width) / 2 +
      (rnd() - 0.5) * cellW * 0.3;
    const top =
      surface.top + insetY + row * cellH + (cellH - height) / 2 +
      (rnd() - 0.5) * cellH * 0.3;
    cards.push({
      left: round(clamp(left, 0, 100 - width)),
      top: round(clamp(top, 0, 100 - height)),
      width: round(width),
      /* a slapped-on sticker is a few degrees off true, never more */
      rotate: round((rnd() - 0.5) * 12),
      z: i + 1,
      from: { x: 0, y: 0 },
      pop: true,
    });
  }
  return cards;
}

/** Lay a cluster out. `ratios` are the shots' own width/height numbers
    in source order; `boxRatio` is the cluster box the percentages are
    relative to. */
export function layout(
  kind: LayoutKind,
  ratios: number[],
  boxRatio: number,
  seed: number
): Card[] {
  const count = ratios.length;
  if (count < 1) return [];
  if (count === 1 && kind !== "stickers") return single(ratios[0], boxRatio);
  switch (kind) {
    case "wall":
      return wall(count, ratios, boxRatio, seed);
    case "single":
      return single(ratios[0], boxRatio);
    case "pile":
      return pile(count, ratios, boxRatio, seed);
    case "cascade":
      return cascade(count, ratios, boxRatio, seed);
    case "stickers":
      return stickers(count, ratios, boxRatio, seed);
  }
}
```

- [ ] **Step 4: Run the tests, verify they pass**

Run: `npx vitest run src/lib/cluster-layout.test.ts`
Expected: all 7 tests PASS. If a bounds test fails, the fix belongs in the archetype's packing maths (clamps and width caps), never in loosening the test.

- [ ] **Step 5: Commit**

```bash
git add src/lib/cluster-layout.ts src/lib/cluster-layout.test.ts
git commit -m "about: a cluster learns what its pictures are"
```

---

### Task 2: The data names each chapter's kind

**Files:**
- Modify: `src/lib/data/about-story.ts`

**Interfaces:**
- Consumes: `LayoutKind` from `@/lib/cluster-layout` (Task 1).
- Produces: `Chapter["gallery"]` gains `kind: LayoutKind`; `Shot` (in `Cluster.tsx`, extended in Task 3) gains `bare?: boolean` — this task sets `bare: true` on sticker/logo shots ahead of the renderer honouring it.

- [ ] **Step 1: Add `kind` to the gallery type.** In `about-story.ts`, add the import and extend the type:

```ts
import type { LayoutKind } from "@/lib/cluster-layout";
```

and in `Chapter["gallery"]`, after `ratio`:

```ts
    /** which composition the shots take — what the pictures are */
    kind: LayoutKind;
```

- [ ] **Step 2: Set each chapter's kind.** Add a `kind` line to every `gallery` right after `ratio`:

- 01 childhood → `kind: "wall",`
- 02 ropes → `kind: "stickers",`
- 03 sabbatical → `kind: "pile",`
- 04 vr → `kind: "single",`
- 05 product → `kind: "cascade",`
- 06 solo → `kind: "wall",`
- 07 casechat → `kind: "cascade",`
- 08 yuvabe → `kind: "cascade",`
- sparetime → `kind: "pile",`

- [ ] **Step 3: Rebuild chapter 02 as surface + stickers.** Replace 02's `gallery.shots` value with:

```ts
      shots: shots(
        "02-ropes",
        ["3 / 2", "1 / 1", "1 / 1", "1 / 1", "1 / 1", "1 / 1"],
        "A sticker from the stack of those years"
      ).map((s, i) =>
        i === 0
          ? { ...s, alt: "The laptop those interfaces were built on" }
          : { ...s, bare: true }
      ),
```

and mark 06's logos bare by appending to its `shots(...)` call:

```ts
      shots: shots(
        "06-solo",
        ["3 / 2", "3 / 2", "3 / 2", "3 / 2", "3 / 2"],
        "A client of those years"
      ).map((s) => ({ ...s, bare: true })),
```

- [ ] **Step 4: Type the sparetime export.** So its `kind` narrows to `LayoutKind` rather than `string`, change its declaration to:

```ts
export const sparetime: Omit<Chapter, "num"> = {
```

- [ ] **Step 5: Verify.** `bare` does not exist on `Shot` yet, so only confirm the file parses; the full `npm run check` gate lands at the end of Task 3, which adds the field. Run: `npx vitest run src/lib/data/data.test.ts` — expected PASS (data invariants untouched).

- [ ] **Step 6: Commit**

```bash
git add src/lib/data/about-story.ts
git commit -m "about: each chapter says what its pictures are"
```

---

### Task 3: The renderer plays each kind

**Files:**
- Modify: `src/components/about/Cluster.tsx`
- Modify: `src/components/about/Cluster.module.css`
- Modify: `src/app/about/page.tsx` (both `<Cluster …>` call sites)
- Delete: `src/lib/scatter.ts`

**Interfaces:**
- Consumes: `layout`, `LayoutKind`, `Card` from `@/lib/cluster-layout` (Task 1); `kind` in the gallery data (Task 2).
- Produces: `Cluster` props gain `kind: LayoutKind`; `Shot` gains `bare?: boolean`.

- [ ] **Step 1: Rewrite `Cluster.tsx`:**

```tsx
"use client";

import { m } from "motion/react";
import { EASE_OUT_CUBIC } from "@/lib/motion";
import { layout, type LayoutKind } from "@/lib/cluster-layout";
import styles from "./Cluster.module.css";

export type Shot = {
  /** the file this card is waiting for */
  src: string;
  ready: boolean;
  alt: string;
  /** the picture's own shape — the cards in a cluster are not one size */
  ratio: string;
  /** no card chrome: a logo or a sticker floats on the page rather
      than sitting in a photograph's frame */
  bare?: boolean;
};

/** longer than the 0.5s block reveal: these travel further than 10px,
    and duration follows distance or the movement reads as a snap */
const DURATION = 0.62;
/** each card behind the one before it, so the cluster assembles rather
    than appearing — small enough that the last card is not a wait */
const STAGGER = 0.07;
/** a sticker lands with a slap: shorter than the slide, with a little
    overshoot, because a pop that eases out reads as inflation */
const POP_DURATION = 0.38;
const EASE_POP = [0.34, 1.56, 0.64, 1] as const;
/** stickers wait for their surface to land first */
const POP_DELAY = 0.3;

/** "4 / 3" → 4/3 — the CSS aspect-ratio strings, as numbers */
const parseRatio = (r: string) => {
  const [w, h] = r.split("/").map(Number);
  return h ? w / h : w;
};

/**
 * A handful of pictures laid out by what they are, and the way they
 * arrive.
 *
 * Placement comes from `layout()` — seeded, so the server and the
 * browser agree and the arrangement survives a rebuild. Sliding cards
 * come in from the side of the cluster they already sit on; sticker
 * cards pop on in place, after the surface beneath them has landed.
 *
 * Reduced motion is handled the way the whole site handles it: the
 * hidden state is `.fx-hidden` in globals.css, which only exists under
 * `prefers-reduced-motion: no-preference`. A reader who has asked for
 * less gets the finished cluster, rotations and all, with no tween to
 * undo — which is why `initial` stays false and the rotation lives in a
 * custom property on the card rather than in the animation.
 */
export default function Cluster({
  shots,
  ratio,
  seed,
  kind,
}: {
  shots: Shot[];
  /** the box the cards are scattered inside */
  ratio: string;
  seed: number;
  kind: LayoutKind;
}) {
  const cards = layout(
    kind,
    shots.map((s) => parseRatio(s.ratio)),
    parseRatio(ratio),
    seed
  );

  return (
    <div className={styles.cluster} data-kind={kind} style={{ aspectRatio: ratio }}>
      {shots.map((shot, i) => {
        const card = cards[i];
        const file = shot.src.slice(shot.src.lastIndexOf("/") + 1);
        return (
          <div
            key={shot.src}
            className={styles.card}
            /* custom properties, not a direct transform: a media query
               cannot override an inline style, and the stacked layout
               below has to be able to straighten these out */
            style={
              {
                "--l": `${card.left}%`,
                "--t": `${card.top}%`,
                "--w": `${card.width}%`,
                "--rot": `${card.rotate}deg`,
                zIndex: card.z,
              } as React.CSSProperties
            }
          >
            <m.div
              className={`${styles.arrive} fx-hidden`}
              style={
                {
                  "--fx-from": card.pop
                    ? "scale(0.4)"
                    : `translate(${card.from.x}px, ${card.from.y}px)`,
                } as React.CSSProperties
              }
              initial={false}
              /* a string transform, not x/y — only the string form is
                 handed to the compositor by Framer */
              whileInView={
                card.pop
                  ? { opacity: 1, transform: "scale(1)" }
                  : { opacity: 1, transform: "translate(0px, 0px)" }
              }
              transition={
                card.pop
                  ? {
                      duration: POP_DURATION,
                      ease: EASE_POP,
                      delay: POP_DELAY + i * STAGGER,
                    }
                  : { duration: DURATION, ease: EASE_OUT_CUBIC, delay: i * STAGGER }
              }
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            >
              <figure
                className={`${styles.shot}${shot.bare ? ` ${styles.bare}` : ""}`}
                style={{ aspectRatio: shot.ratio }}
              >
                {shot.ready ? (
                  <img src={shot.src} alt={shot.alt} className={styles.img} />
                ) : (
                  /* The frame is drawn at the exact shape its picture
                     will have, with the filename it wants inside it — so
                     the layout is finished before the photographs are,
                     and dropping them in moves nothing. */
                  <span className={styles.slot} aria-hidden="true">
                    <span className={`mono-label ${styles.slotName}`}>{file}</span>
                    <span className={`mono-label ${styles.slotRatio}`}>{shot.ratio}</span>
                  </span>
                )}
              </figure>
            </m.div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Add the bare variant and scope the stacked fallback.** In `Cluster.module.css`, add after the `.img` rule:

```css
/* a logo or a sticker is not a photograph: no frame, no paper, no
   shadow — the artwork's own silhouette is the card */
.bare {
	border: 0;
	border-radius: 0;
	box-shadow: none;
	background: transparent;
}
```

and replace the whole `@media (max-width: 900px)` block at the bottom with:

```css
/* Stacked: strewn paper needs room to overlap, and a phone has none —
   the pile straightens into a plain two-up grid; the personality is in
   the pictures by then, not in the angles. The other kinds keep their
   composition: they are packed inside the box, in percentages, so they
   fit any width. */
@media (max-width: 900px) {
	.cluster[data-kind="pile"] {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.75rem;
		aspect-ratio: auto !important;
	}

	.cluster[data-kind="pile"] .card {
		position: static;
		width: auto;
		transform: none;
	}

	.cluster[data-kind="pile"] .card:hover {
		transform: none;
	}
}
```

- [ ] **Step 3: Pass the kind through.** In `src/app/about/page.tsx`, add `kind={c.gallery.kind}` to the chapters' `<Cluster>` and `kind={sparetime.gallery.kind}` to the sparetime one, alongside the existing `shots`/`ratio`/`seed` props.

- [ ] **Step 4: Retire the old scatter**

```bash
rm src/lib/scatter.ts
```

- [ ] **Step 5: Verify**

Run: `npm run check` — expected: clean (this is the gate Task 2 deferred).
Run: `npm test` — expected: all suites pass, including `cluster-layout.test.ts` and the untouched `motion.test.ts`.

- [ ] **Step 6: Commit**

```bash
git add -A src/components/about src/app/about/page.tsx src/lib/scatter.ts
git commit -m "about: the clusters play their parts"
```

---

### Task 4: The row centres on the spine

**Files:**
- Modify: `src/app/about/about.module.css`

**Interfaces:** none — CSS only.

- [ ] **Step 1: Centre the chapter row.** In `.chapter`, change `align-items: start;` to:

```css
	/* picture and chapter sit level either side of the rule — the row's
	   middles align, the way the reference reads (Cyril, 2026-08-22) */
	align-items: center;
```

- [ ] **Step 2: Move the stop mark to the row's middle.** Replace the `.chapter::after` rule with:

```css
/* the stop mark, at the row's vertical middle — level with the centred
   chapter beside it rather than with the top of the column */
.chapter::after {
	content: "";
	position: absolute;
	left: 50%;
	top: 50%;
	width: 9px;
	height: 9px;
	border-radius: 50%;
	background: var(--accent);
	transform: translate(-50%, -50%);
}
```

- [ ] **Step 3: End the thread at the last stop.** Replace the `.last::before` rule with:

```css
/* the last stop ends the thread at its own dot rather than letting it
   run on into the closing block */
.last::before {
	bottom: 50%;
}
```

- [ ] **Step 4: Verify.** Run: `npm run check` (CSS Modules pass through it) and confirm the dev server compiles `/about` without warnings.

- [ ] **Step 5: Commit**

```bash
git add src/app/about/about.module.css
git commit -m "about: the chapters meet the spine at their middles"
```

---

### Task 5: Visual verification

**Files:** none created in the repo — screenshots go to the session scratchpad.

- [ ] **Step 1: Scrolled desktop pass.** With the dev server running (Cyril's instance, port 3007):

```bash
node scripts/scroll-shots.mjs http://localhost:3007/about main "0.05,0.2,0.35,0.5,0.65,0.8,0.95" <scratchpad>/about-v2 1440 900
```

Check every chapter against the spec: 01 flush poster grid (middle column high, no tilt), 02 lid with popped stickers on it, 03/09 tilted overlapping pile, 04 one hero card, 05/07/08 straight diagonal cascade, 06 chromeless logo grid; every card inside its box; rows centred on the spine with the dot at each row's middle; the thread ending at the last dot.

- [ ] **Step 2: Reduced-motion pass** (the finished composition must exist with no tween):

```bash
node scripts/shot.mjs http://localhost:3007/about <scratchpad>/about-v2-reduce.png 1440 1000 reduce full
```

Expected: all clusters visible in their final arrangement, rotations intact, no blank frames.

- [ ] **Step 3: Stacked pass** at phone width:

```bash
node scripts/scroll-shots.mjs http://localhost:3007/about main "0.1,0.4,0.7,0.95" <scratchpad>/about-v2-narrow 390 844
```

Expected: piles straightened to the 2-up grid; wall/single/cascade/stickers keeping their composition inside the column; nothing overflowing the viewport.

- [ ] **Step 4: Fix-and-reshoot.** Anything off goes back to the owning task's file, smallest change that fixes the frame, then reshoot that pass. Commit fixes with the task's message style.
