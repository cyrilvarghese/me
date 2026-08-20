# Hero Knife Opening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Delete the 600vh `KnifeStory` section and move its travel, zoom and blade-opening beats into a 200vh pinned Hero, so the knife comes down, takes the stage, opens one blade at a time with labels, then hands to the existing lineup.

**Architecture:** The Hero becomes a 200vh section over a `position: sticky` 100vh stage — the same construction `KnifeStory` used, not a GSAP `pin`. One scrubbed timeline drives copy-out, knife travel and the crossfade; the blade opening itself is a separate **time-based** timeline fired from `onUpdate` at a progress threshold, because natural easing must read as the object's mass rather than the user's hand. The knife's landing pose is pinned to `OutcomeTransition`'s existing entry contract (`0.135 * targetW` right-shift, `min(58vh, 54vw, 660px)` box) so that section needs no code change at all.

**Tech Stack:** Next.js App Router (static export), React, GSAP + ScrollTrigger via `@gsap/react`'s `useGSAP`, CSS Modules, Vitest.

**Spec:** `docs/superpowers/specs/2026-08-20-hero-knife-opening-design.md`

**Branch:** `no-knife-story`

## Global Constraints

- Animate only `transform` and `opacity`.
- Every timeline lives inside `gsap.matchMedia`. Reduced motion builds **no** timelines — CSS renders the static pose.
- Compact (`max-width: 768px`) compresses blade angles by `factor = 0.8` and hides orbit labels.
- Every `fromTo` needs `immediateRender: false`, or the "from" pose renders at build time and the knife starts open.
- `OutcomeTransition.tsx` and `OutcomeTransition.module.css` get **no code change**. Comment text only.
- `capabilities.ts` is the single source of truth — id, label, `openAngle`, layer. Do not inline blade data anywhere.
- Never write "Swiss Army knife" in site copy. No new user-facing copy in this plan at all — the narrative rework is a separate, deferred piece of work.
- `output: "export"` must keep working; run `npm run build` before the final commit.
- Neutrals carry a ~2% tinge of the accent. No plain black, no plain white.
- Import `m` from the motion provider, never `motion.*` — though this plan adds no Framer Motion.

## Verification commands

- `npm run check` — `tsc --noEmit`
- `npm test` — Vitest
- `npm run build` — static export
- `node scripts/shot.mjs <url> <out.png> [w h] [reduce] [full]`
- `node scripts/scroll-shots.mjs <url> <selector> "0.2,0.5" <prefix> [w h]`

Cyril usually has a dev server on port 3000. Check before starting one; if a second instance refuses with "Another next dev server is already running", read the PID it prints before killing anything. **Do not create new one-off probe scripts** — use the two above, and ask before writing any new script.

---

### Task 1: Relocate the orbit-label styles

`ToolLabels` imports `knife-story.module.css`. Nothing else can delete that file until the label rules live somewhere the labels' own component owns. Moving them into `knife.module.css` also puts them beside the knife they annotate.

**Files:**
- Modify: `src/components/knife/knife.module.css` (append)
- Modify: `src/components/knife/ToolLabels.tsx:2`
- Modify: `src/components/knife/knife-story.module.css:122-144` (remove the moved rules)

**Interfaces:**
- Consumes: nothing.
- Produces: `.labels`, `.label`, `.labelVisible` class names exported from `knife.module.css`. Task 5 targets `[data-label]` attributes, not these classes, so nothing downstream depends on the names.

- [ ] **Step 1: Append the label rules to `knife.module.css`**

Add at the end of `src/components/knife/knife.module.css`:

```css
/* ---- orbit labels around an opened knife ---- */

.labels {
	position: absolute;
	inset: 0;
	pointer-events: none;
}

.label {
	position: absolute;
	color: var(--fg-soft);
	opacity: 0;
	visibility: hidden;
	white-space: nowrap;
	/* labels catch their own pointer so hovering label text never
	   triggers the blade hover underneath */
	pointer-events: auto;
}

.labelVisible {
	opacity: 1;
	visibility: visible;
}

/* the knife is shown open and annotated when motion is off — no timeline
   ever runs to reveal these */
@media (prefers-reduced-motion: reduce) {
	.label {
		opacity: 1;
		visibility: visible;
	}
}

/* §33: no labels orbiting the object on mobile — there is not room */
@media (max-width: 768px) {
	.labels {
		display: none;
	}
}
```

- [ ] **Step 2: Point `ToolLabels` at the new module**

In `src/components/knife/ToolLabels.tsx`, change line 2 from:

```tsx
import styles from "./knife-story.module.css";
```

to:

```tsx
import styles from "./knife.module.css";
```

- [ ] **Step 3: Remove the moved rules from the story module**

Delete lines 122-144 of `src/components/knife/knife-story.module.css` (the `/* ---- labels around the knife ---- */` heading through the `.labelVisible` block). Also delete the `.labels { display: none; }` blocks inside the two media queries at the bottom of that file (the reduced-motion one around line 186 and the `max-width: 768px` one around line 231) — they now live in `knife.module.css`.

- [ ] **Step 4: Verify the type-check and tests still pass**

Run: `npm run check && npm test`
Expected: both clean. `KnifeStory` still renders and still imports the story module for its own panel styles.

- [ ] **Step 5: Screenshot the story to confirm labels still appear**

Start or reuse the dev server, then:

Run: `node scripts/scroll-shots.mjs http://localhost:3000 "section[aria-label='Capabilities']" "0.5,0.85" shots-labels 1440 900`
Expected: labels visible around the open blades in the 0.85 frame, unchanged from before.

- [ ] **Step 6: Commit**

```bash
git add src/components/knife/knife.module.css src/components/knife/ToolLabels.tsx src/components/knife/knife-story.module.css
git commit -m "refactor: the labels move in beside the knife they annotate"
```

---

### Task 2: Remove the knife story section

With the labels rehoused, nothing outside the story needs the story. Delete it.

**Note on intermediate state:** after this task the page is deliberately incomplete — the hero knife stays closed and `OutcomeTransition`'s knife is `opacity: 0` with nothing left to light it, so the lineup animates an invisible knife. That is expected and Task 6 closes it. The gate for this task is `npm run check`, `npm test` and `npm run build`, not the visuals.

**Files:**
- Delete: `src/components/knife/KnifeStory.tsx`
- Delete: `src/components/knife/knife-story.module.css`
- Modify: `src/app/page.tsx:4,20`

**Interfaces:**
- Consumes: Task 1's relocated label styles.
- Produces: `src/lib/data/scroll.ts` now has zero importers, which is what lets Task 3 replace it wholesale.

- [ ] **Step 1: Confirm nothing but `page.tsx` imports the story**

Run: `grep -rn "KnifeStory\|knife-story" src/`
Expected: matches only in `src/app/page.tsx`, `src/components/knife/KnifeStory.tsx`, `src/components/MotionProvider.tsx` (a comment) and `src/components/sections/OutcomeTransition.tsx` (comments). If any *code* outside `page.tsx` imports it, stop and report — the plan assumed otherwise.

- [ ] **Step 2: Delete the two files**

```bash
git rm src/components/knife/KnifeStory.tsx src/components/knife/knife-story.module.css
```

- [ ] **Step 3: Drop it from the page**

In `src/app/page.tsx`, remove line 4:

```tsx
import KnifeStory from "@/components/knife/KnifeStory";
```

and line 20:

```tsx
        <KnifeStory />
```

The remaining `<main>` body reads:

```tsx
      <main>
        <Hero />
        <OutcomeTransition />
        <CaseStudies />
        <Career />
        <UnknownProblem />
        {/* the method reads last, after the proof — it explains how the
            work above happened rather than promising it up front */}
        <OperatingModel />
        <FinalCTA />
      </main>
```

- [ ] **Step 4: Retarget the stale comment in `MotionProvider`**

In `src/components/MotionProvider.tsx:13`, change:

```
 * scrubbed pinned sections (KnifeStory, OutcomeTransition, FinalCTA)
```

to:

```
 * scrubbed pinned sections (Hero, OutcomeTransition, FinalCTA)
```

- [ ] **Step 5: Verify**

Run: `npm run check && npm test && npm run build`
Expected: all three clean. `scroll.ts` is now dead code that still compiles.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: the knife story section comes out"
```

---

### Task 3: Replace the scroll math with the hero's beats

`scroll.ts`'s six contiguous 0.13 windows described `KnifeStory` and nothing else. It becomes the opener's numbers, so the choreography stays data-driven rather than hiding magic numbers inside the component.

This is the one task with real unit tests — write them first.

**Files:**
- Modify: `src/lib/data/scroll.ts` (full rewrite)
- Modify: `src/lib/data/data.test.ts:5` (imports) and `:43-52` (the `scroll windows` describe block)

**Interfaces:**
- Consumes: `capabilities` (for the stagger test only).
- Produces, all from `@/lib/data/scroll`:
  - `COPY_OUT_END: number` — progress at which the hero copy has fully left
  - `TRAVEL_START: number`, `TRAVEL_END: number` — the knife's scrubbed travel window
  - `OPEN_AT: number` — progress that fires the time-based opening
  - `REARM_AT: number` — progress below which the opening re-arms
  - `STAGGER: number` — seconds between blade starts
  - `BLADE_DUR: number` — seconds one blade takes to swing and settle
  - `LABEL_DELAY: number` — seconds after a blade starts before its label fades in
  - `HANDOFF_START: number`, `HANDOFF_DUR: number` — the crossfade window
  - `bladeDelay(i: number): number` — start offset in seconds for blade `i`

- [ ] **Step 1: Write the failing tests**

In `src/lib/data/data.test.ts`, change the import on line 5 from:

```ts
import { windowFor, INTRO_END, COMPLETE_START } from "./scroll";
```

to:

```ts
import {
  COPY_OUT_END,
  TRAVEL_START,
  TRAVEL_END,
  OPEN_AT,
  REARM_AT,
  STAGGER,
  BLADE_DUR,
  LABEL_DELAY,
  HANDOFF_START,
  HANDOFF_DUR,
  bladeDelay,
} from "./scroll";
```

Then replace the whole `describe("scroll windows", ...)` block (lines 43-52) with:

```ts
describe("hero opening beats", () => {
  it("orders copy-out, travel, open and handoff inside one scroll pass", () => {
    expect(TRAVEL_START).toBeGreaterThan(0);
    expect(TRAVEL_START).toBeLessThan(COPY_OUT_END);
    expect(COPY_OUT_END).toBeLessThan(TRAVEL_END);
    expect(OPEN_AT).toBeGreaterThanOrEqual(TRAVEL_END);
    expect(HANDOFF_START).toBeGreaterThan(OPEN_AT);
    expect(HANDOFF_START + HANDOFF_DUR).toBeCloseTo(1);
  });

  it("re-arms the opening below the trigger, with hysteresis", () => {
    expect(REARM_AT).toBeLessThan(OPEN_AT);
    expect(REARM_AT).toBeGreaterThan(TRAVEL_START);
  });

  it("staggers one blade per capability, in order, with growing delay", () => {
    const delays = capabilities.map((_, i) => bladeDelay(i));
    expect(delays).toHaveLength(6);
    expect(delays[0]).toBe(0);
    for (let i = 1; i < delays.length; i++) {
      expect(delays[i]).toBeGreaterThan(delays[i - 1]);
    }
    expect(delays[delays.length - 1]).toBeCloseTo(5 * STAGGER);
  });

  it("gives every blade time to travel before the next one starts moving", () => {
    // overlapping is the point — the fan reads as one gesture, not six
    expect(STAGGER).toBeLessThan(BLADE_DUR);
    expect(LABEL_DELAY).toBeGreaterThan(0);
    expect(LABEL_DELAY).toBeLessThan(BLADE_DUR);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/lib/data/data.test.ts`
Expected: FAIL — the old `scroll.ts` exports none of these names, so the import errors before any assertion runs.

- [ ] **Step 3: Write the new `scroll.ts`**

Replace the entire contents of `src/lib/data/scroll.ts` with:

```ts
/**
 * Beats for the hero's knife opening. Progress is 0..1 across the hero's
 * 200vh section: the copy leaves, the knife travels to the stage and grows,
 * the blades fan open on their own clock, then the knife dissolves into the
 * morph section's knife.
 *
 * The blade fan is deliberately NOT on this scale — it runs in seconds, fired
 * once when the knife lands. Scrubbed easing reads as the reader's hand;
 * time-based easing reads as the object's own weight.
 */

/** The hero copy has fully cleared the stage by here. */
export const COPY_OUT_END = 0.18;

/** The knife starts moving while the copy is still leaving, and lands here. */
export const TRAVEL_START = 0.06;
export const TRAVEL_END = 0.4;

/** Landing fires the fan. Scrolling back below REARM_AT re-arms it, and the
    gap between the two is hysteresis — without it, hovering the threshold
    would retrigger the fan on every jitter. */
export const OPEN_AT = TRAVEL_END;
export const REARM_AT = 0.32;

/** Seconds between blade starts. */
export const STAGGER = 0.1;
/** Seconds for one blade to swing out and settle. */
export const BLADE_DUR = 0.75;
/** Seconds after a blade starts before its label arrives. */
export const LABEL_DELAY = 0.22;

/** The crossfade into OutcomeTransition's knife, ending exactly as the hero
    unpins and that section pins. */
export const HANDOFF_DUR = 0.1;
export const HANDOFF_START = 1 - HANDOFF_DUR;

/** Start offset, in seconds, for blade `i` of the fan. */
export function bladeDelay(i: number): number {
  return i * STAGGER;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/lib/data/data.test.ts`
Expected: PASS, all four new assertions plus the untouched `capabilities` and `cases` blocks.

- [ ] **Step 5: Verify the type-check**

Run: `npm run check`
Expected: clean. Nothing imports `scroll.ts` yet besides the test.

- [ ] **Step 6: Commit**

```bash
git add src/lib/data/scroll.ts src/lib/data/data.test.ts
git commit -m "feat: the scroll module now holds the hero opening's beats"
```

---

### Task 4: Rebuild the Hero's markup and styles

Static structure only — no GSAP yet. At the end of this task the hero is a 200vh section with a sticky stage, the copy on the left and the closed knife peeking at the right, exactly as it looks today but scrolling for two viewports.

The knife lives in **two nested elements** and this is load-bearing:

- `.knifeSlot` — absolute, `translateY(-50%)`, never touched by GSAP. Because a percentage translate resolves to pixels in the computed matrix, letting GSAP own it would break on resize. Keeping it in CSS also means the slot's `getBoundingClientRect()` is a stable, untransformed measurement Task 5 can target the landing against.
- `.knifeWrap` — the inner element GSAP animates (`x`, `y`, `scale`, `rotation`). Its CSS `rotate(-14deg)` matches the value GSAP reads on first tick, so hydration causes no flash.

**Files:**
- Modify: `src/components/sections/Hero.tsx` (full rewrite)
- Modify: `src/components/sections/Hero.module.css` (full rewrite)

**Interfaces:**
- Consumes: `KnifeCanvas`, `ToolLabels`, `TRAVEL_END` and `HANDOFF_START` from Task 3.
- Produces, for Task 5 and 6:
  - refs `sectionRef` (the `<section>`), `stageRef` (the sticky stage), `slotRef` (`.knifeSlot`), `wrapRef` (`.knifeWrap`)
  - attribute hooks `data-hero-copy` on the copy column, `data-hero-knife` on `.knifeSlot`
  - `[data-tool="<id>"]` and `[data-label="<id>"]` inside `.knifeWrap`, from `KnifeCanvas` and `ToolLabels`

- [ ] **Step 1: Rewrite `Hero.tsx`**

Replace the entire contents of `src/components/sections/Hero.tsx` with:

```tsx
"use client";

import { useRef } from "react";
import { TRAVEL_END, HANDOFF_START } from "@/lib/data/scroll";
import KnifeCanvas from "@/components/knife/KnifeCanvas";
import ToolLabels from "@/components/knife/ToolLabels";
import styles from "./Hero.module.css";

/**
 * The opening. Two viewports of scroll over a sticky stage: the copy leaves,
 * the knife travels in from its peek and grows to fill the stage, its blades
 * fan open one at a time, then it dissolves into the morph section's knife.
 *
 * The knife sits in two boxes on purpose. .knifeSlot keeps the percentage
 * centring in CSS where resize handles it and where its rect stays a clean
 * untransformed measurement; .knifeWrap is the one GSAP moves.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={sectionRef}
      className={styles.hero}
      id="top"
      /* chapter marks: the knife lands, then the handoff */
      data-ruler-beats={`${TRAVEL_END},${HANDOFF_START}`}
    >
      <div className={styles.stage} ref={stageRef}>
        <div className={`section-shell ${styles.inner}`} data-hero-copy="">
          <p className={`mono-label ${styles.eyebrow}`}>
            Product Builder · Designer · Engineer
          </p>
          <h1 className={`serif-display ${styles.headline}`}>
            Give me the outcome.
            <br />
            I&apos;ll figure out the rest.
          </h1>
          <p className={styles.desc}>
            I work across product, design, engineering and AI to turn ambiguous problems into
            shipped systems.
          </p>
          <a href="#work" className={`mono-label ${styles.cue}`}>
            See how{" "}
            <span className={styles.arrow} aria-hidden="true">
              ↓
            </span>
          </a>
        </div>

        <div className={styles.knifeSlot} ref={slotRef} data-hero-knife="" aria-hidden="true">
          <div className={styles.knifeWrap} ref={wrapRef}>
            <KnifeCanvas />
            <ToolLabels />
          </div>
        </div>
      </div>
    </section>
  );
}
```

`KnifeCanvas` takes no `reducedPose` prop here: its default is `"open"`, which applies `rotate(var(--open))` **only** inside a `prefers-reduced-motion: reduce` media query. Motion-enabled visitors get closed blades from the inline `rotate(0deg)`, which is exactly what the fan needs to start from.

- [ ] **Step 2: Rewrite `Hero.module.css`**

Replace the entire contents of `src/components/sections/Hero.module.css` with:

```css
.hero {
	position: relative;
	/* one viewport of stage plus one of scroll to play the opening across */
	height: 200vh;
}

.stage {
	position: sticky;
	top: 0;
	height: 100vh;
	overflow: hidden;
	display: flex;
	align-items: center;
}

.inner {
	position: relative;
	z-index: 2;
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 1.75rem;
}

.eyebrow {
	color: var(--muted);
}

.headline {
	font-size: var(--text-display);
	max-width: 24ch;
	text-wrap: balance;
}

.desc {
	max-width: 44ch;
	color: var(--fg-soft);
}

.cue {
	margin-top: 1.5rem;
	color: var(--accent);
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	width: fit-content;
	transform-origin: left center;
	transition: transform 120ms ease;
}

/* press feedback — instant scale-down, eased release */
.cue:active {
	transform: scale(0.97);
}

.cue .arrow {
	display: inline-block;
	animation: nudge 1.8s ease-in-out infinite alternate;
	transition: transform 180ms ease;
}

@media (hover: hover) and (pointer: fine) {
	.cue {
		transition: transform 120ms ease, filter 180ms ease;
	}

	.cue:hover {
		filter: brightness(1.25);
	}

	/* the idle drift yields to a held, decisive point downward */
	.cue:hover .arrow {
		animation: none;
		transform: translateY(4px);
	}
}

@keyframes nudge {
	from {
		transform: translateY(-2px);
	}
	to {
		transform: translateY(3px);
	}
}

@media (prefers-reduced-motion: reduce) {
	.cue,
	.cue .arrow {
		animation: none;
		transition: none;
	}
}

/* ---- the knife ---- */

/* GSAP never touches this box. The percentage centring stays in CSS, where
   resize handles it for free, and the untransformed rect is what the travel
   tween measures its landing against. */
.knifeSlot {
	position: absolute;
	z-index: 1;
	top: 50%;
	right: 3vw;
	width: min(44vw, 640px);
	transform: translateY(-50%);
	pointer-events: none;
}

/* the box GSAP owns — the peek tilt matches what it reads on first tick, so
   hydration is invisible */
.knifeWrap {
	position: relative;
	transform: rotate(-14deg);
}

/* ---- reduced motion: no stage, no travel, the knife simply stands open ---- */

@media (prefers-reduced-motion: reduce) {
	.hero {
		height: auto;
	}

	.stage {
		position: static;
		height: auto;
		min-height: 100vh;
		overflow: visible;
		flex-direction: column;
		justify-content: center;
		gap: 4rem;
		padding-block: var(--space-section);
	}

	/* the open knife's blades sweep well outside the closed silhouette, so it
	   gets its own row rather than the corner */
	.knifeSlot {
		position: static;
		width: min(70vw, 520px);
		margin-inline: auto;
		transform: none;
	}

	.knifeWrap {
		transform: none;
	}
}

/* ---- narrow screens ---- */

@media (max-width: 768px) {
	.stage {
		align-items: flex-end;
		padding-block: 6rem;
	}

	.knifeSlot {
		width: 72vw;
		top: auto;
		right: 4vw;
		bottom: 3%;
		transform: none;
	}
}
```

- [ ] **Step 3: Verify the type-check and tests**

Run: `npm run check && npm test`
Expected: clean. `stageRef`, `slotRef` and `wrapRef` are declared but not read until Task 5; `tsconfig.json` does not set `noUnusedLocals`, so this compiles. Keep them — do not delete and re-add.

- [ ] **Step 4: Screenshot the static hero at three widths**

```bash
node scripts/shot.mjs http://localhost:3000 shots-hero-desktop.png 1440 900
node scripts/shot.mjs http://localhost:3000 shots-hero-mobile.png 390 844
node scripts/shot.mjs http://localhost:3000 shots-hero-reduce.png 1440 900 reduce
```

Expected: desktop and mobile look identical to the hero before this change (copy left, closed knife peeking right / bottom). The `reduce` shot shows copy stacked above a centred, **fully open** knife with visible labels — this is the pose reduced-motion visitors used to get from the story section.

- [ ] **Step 5: Confirm the section is actually two viewports**

Run: `node scripts/scroll-shots.mjs http://localhost:3000 "#top" "0,0.5,1" shots-hero-range 1440 900`
Expected: three frames, all showing the same sticky stage. Nothing animates yet — that is the point of this task's gate.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/Hero.tsx src/components/sections/Hero.module.css
git commit -m "feat: the hero becomes a stage the knife can walk onto"
```

---

### Task 5: The travel and the fan

The scrubbed timeline plus the time-based blade fan. After this task the knife descends, grows and opens with labels — everything except the handoff.

**Files:**
- Modify: `src/components/sections/Hero.tsx` (add the `useGSAP` block)

**Interfaces:**
- Consumes: Task 3's beats; Task 4's refs and attribute hooks.
- Produces: a `tl` whose `scrollTrigger` Task 6 extends, and a `factor` value (`0.8` compact, else `1`) applied to every `openAngle`.

- [ ] **Step 1: Add the imports**

In `src/components/sections/Hero.tsx`, replace the import block with:

```tsx
"use client";

import { useRef } from "react";
import { capabilities } from "@/lib/data/capabilities";
import {
  COPY_OUT_END,
  TRAVEL_START,
  TRAVEL_END,
  OPEN_AT,
  REARM_AT,
  BLADE_DUR,
  LABEL_DELAY,
  HANDOFF_START,
  bladeDelay,
} from "@/lib/data/scroll";
import { gsap, useGSAP } from "@/lib/gsap";
import KnifeCanvas from "@/components/knife/KnifeCanvas";
import ToolLabels from "@/components/knife/ToolLabels";
import styles from "./Hero.module.css";
```

- [ ] **Step 2: Add the `useGSAP` block**

Insert directly after the four `useRef` declarations and before the `return`:

```tsx
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          motionOk: "(prefers-reduced-motion: no-preference)",
          compact: "(max-width: 768px)",
        },
        (ctx) => {
          const { motionOk, compact } = ctx.conditions as {
            motionOk: boolean;
            compact: boolean;
          };
          if (!motionOk) return;

          const section = sectionRef.current;
          const stage = stageRef.current;
          const slot = slotRef.current;
          const wrap = wrapRef.current;
          if (!section || !stage || !slot || !wrap) return;

          // §32: compress blade angles on small screens
          const factor = compact ? 0.8 : 1;

          const blades = Array.from(wrap.querySelectorAll<HTMLElement>("[data-tool]"));
          const labels = Array.from(wrap.querySelectorAll<HTMLElement>("[data-label]"));

          // The slot is the knife's untransformed box: GSAP only ever moves the
          // wrap *inside* it, so this rect never shifts and stays correct at any
          // scroll position, after any resize, on any mid-page reload.
          const slotBox = () => {
            const sl = slot.getBoundingClientRect();
            const st = stage.getBoundingClientRect();
            return {
              cx: sl.left + sl.width / 2,
              cyInStage: sl.top - st.top + sl.height / 2,
              w: sl.width,
            };
          };

          // The same expression as OutcomeTransition's .inner width, so the two
          // knives are congruent when the crossfade happens.
          const targetW = () =>
            Math.min(0.58 * window.innerHeight, 0.54 * window.innerWidth, 660);

          // The fan runs on its own clock. Fired once when the knife lands,
          // re-armed if the reader scrolls back up past REARM_AT.
          let fanned = false;
          const fan = gsap.timeline({ paused: true });
          capabilities.forEach((c, i) => {
            const open = c.openAngle * factor;
            fan.fromTo(
              `[data-tool="${c.id}"]`,
              { rotation: 0 },
              {
                rotation: open,
                duration: BLADE_DUR,
                // sweeps a little past the resting angle and settles — the
                // mechanical overshoot a real blade has
                ease: "back.out(1.5)",
                // without this the "from" pose renders at build time and the
                // knife starts fully open
                immediateRender: false,
              },
              bladeDelay(i)
            );
            fan.to(
              `[data-label="${c.id}"]`,
              { autoAlpha: 1, duration: 0.3, ease: "power2.out" },
              bladeDelay(i) + LABEL_DELAY
            );
          });

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.4,
              invalidateOnRefresh: true,
              onUpdate(self) {
                if (self.progress >= OPEN_AT && !fanned) {
                  fanned = true;
                  fan.restart();
                } else if (self.progress < REARM_AT && fanned) {
                  fanned = false;
                  fan.pause(0);
                  gsap.set(blades, { rotation: 0 });
                  gsap.set(labels, { autoAlpha: 0 });
                }
              },
            },
          });

          // spacer: tween positions below are literally scroll fractions
          tl.to({}, { duration: 1 }, 0);

          // the copy leaves so the knife has the stage to itself
          tl.to(
            "[data-hero-copy]",
            { autoAlpha: 0, y: -48, duration: COPY_OUT_END, ease: "power2.in" },
            0
          );

          // the knife travels down and grows into the stage box. Lazy functions
          // so resize and mid-page reload both land correctly.
          tl.to(
            wrap,
            {
              x: () => {
                const st = stage.getBoundingClientRect();
                // the art sits left of centre in its box, so the box lands
                // shifted right for the ART to read centred. OutcomeTransition
                // opens by sliding this same offset back to zero.
                return st.left + st.width / 2 - slotBox().cx + 0.135 * targetW();
              },
              y: () => {
                const st = stage.getBoundingClientRect();
                return st.height / 2 - slotBox().cyInStage;
              },
              scale: () => targetW() / slotBox().w,
              rotation: 0,
              duration: TRAVEL_END - TRAVEL_START,
              ease: "power2.inOut",
            },
            TRAVEL_START
          );

          // the labels retire before the handoff, so no label-sized ghost
          // survives into a knife that has none
          tl.to(labels, { autoAlpha: 0, duration: 0.04, ease: "power2.in" }, HANDOFF_START - 0.05);
        }
      );

      return () => mm.revert();
    },
    { scope: sectionRef }
  );
```

- [ ] **Step 3: Verify the type-check and tests**

Run: `npm run check && npm test`
Expected: clean.

- [ ] **Step 4: Screenshot the travel and the fan**

Run: `node scripts/scroll-shots.mjs http://localhost:3000 "#top" "0,0.12,0.3,0.42,0.6" shots-hero-fan 1440 900`

Expected, frame by frame:
- `0` — copy present, knife peeking at the right, closed and tilted
- `0.12` — copy fading upward, knife on the move
- `0.3` — mid-travel, knife bigger and straightening
- `0.42` — landed centre, blades mid-fan (the fan is time-based, so the exact pose depends on when the shot fires; what matters is that blades are at non-zero, differing angles)
- `0.6` — fully open, labels visible

`scroll-shots.mjs` jumps to a position rather than scrolling through it. Because the fan is fired from `onUpdate`, a jump straight past `OPEN_AT` still triggers it. If frame `0.6` shows a closed knife, the threshold never fired — check that `onUpdate` runs on a jump before changing any numbers.

- [ ] **Step 5: Check compact and reduced motion did not regress**

```bash
node scripts/shot.mjs http://localhost:3000 shots-hero-reduce2.png 1440 900 reduce
node scripts/scroll-shots.mjs http://localhost:3000 "#top" "0,0.6" shots-hero-mob 390 844
```

Expected: the `reduce` shot is unchanged from Task 4 — no timeline was built. The mobile `0.6` frame shows an open knife with **compressed** angles and **no** labels.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/Hero.tsx
git commit -m "feat: the knife takes the stage, then opens a blade at a time"
```

---

### Task 6: Hand the knife to the lineup

The crossfade. `OutcomeTransition` gets no code change — the hero knife lands exactly where that section's knife expects to begin.

**Files:**
- Modify: `src/components/sections/Hero.tsx` (extend the timeline)
- Modify: `src/components/sections/OutcomeTransition.tsx:141-147` (comment text only)

**Interfaces:**
- Consumes: `HANDOFF_START`, `HANDOFF_DUR`; the `tl` from Task 5; `[data-knife-el]` rendered by `OutcomeTransition`.
- Produces: nothing downstream.

- [ ] **Step 1: Add `HANDOFF_DUR` to the imports**

In `src/components/sections/Hero.tsx`, add `HANDOFF_DUR` to the `@/lib/data/scroll` import list, beside `HANDOFF_START`.

- [ ] **Step 2: Append the handoff to the timeline**

At the end of the `mm.add` callback in `Hero.tsx`, directly after the label-retire tween added in Task 5:

```tsx
          // Crossfade rather than a hard swap: two near-identical frames
          // dissolving absorbs whatever lag the scrub is carrying, so there is
          // never a visible jump and never two knives.
          const morphKnife = document.querySelector("[data-knife-el]");
          if (morphKnife) {
            tl.to(morphKnife, { autoAlpha: 1, duration: HANDOFF_DUR, ease: "none" }, HANDOFF_START);
            tl.to(slot, { autoAlpha: 0, duration: HANDOFF_DUR, ease: "none" }, HANDOFF_START);

            // The morph stage has not pinned yet during the crossfade — it is
            // still rising toward the top of the viewport, and its knife rides
            // up with it. Both the rise and the timeline are linear in scroll,
            // so an equal counter-translation cancels it exactly and the
            // incoming knife holds dead centre while it dissolves in.
            const range = () => section.offsetHeight - window.innerHeight;
            tl.fromTo(
              morphKnife,
              { y: () => -HANDOFF_DUR * range() },
              { y: 0, duration: HANDOFF_DUR, ease: "none", immediateRender: false },
              HANDOFF_START
            );
          }
```

- [ ] **Step 3: Retarget the stale comments in `OutcomeTransition`**

In `src/components/sections/OutcomeTransition.tsx`, replace lines 141-147:

```tsx
          // NOTE: the story timeline performs the in-place knife swap at its
          // own scrubbed completion (KnifeStory.tsx) — swapping from here
          // fired before the centering had rendered (scrub lag = two knives).

          // starts where the story knife lands: shifted right so the
          // left-biased art reads centered (KnifeStory.tsx). Slides back to
```

with:

```tsx
          // NOTE: the hero timeline performs the in-place knife swap at its
          // own scrubbed completion (Hero.tsx) — swapping from here fired
          // before the centering had rendered (scrub lag = two knives).

          // starts where the hero knife lands: shifted right so the
          // left-biased art reads centered (Hero.tsx). Slides back to
```

Also update the two comments in `OutcomeTransition.module.css` that name the story — around line 7 (`starts one viewport early: the pin engages exactly as the story knife finishes centering`) and line 10 (`the overlapping viewport must not swallow the story's hover`) — replacing "story" with "hero". No property values change.

- [ ] **Step 4: Verify**

Run: `npm run check && npm test && npm run build`
Expected: all clean.

- [ ] **Step 5: Screenshot both sides of the seam**

Run: `node scripts/scroll-shots.mjs http://localhost:3000 "#top" "0.88,0.93,0.97,1" shots-hero-seam 1440 900`

Expected: the knife holds **dead still** across all four frames while the labels leave and the knife itself dissolves from one element to the other. Any jump in position or size means the landing offset and `targetW` have drifted out of agreement — recheck that `0.135 * targetW()` in `Hero.tsx` matches `0.135 * S()` in `OutcomeTransition.tsx:151`, and that `targetW()` matches `.inner`'s `width: min(58vh, 54vw, 660px)`.

- [ ] **Step 6: Screenshot the lineup to confirm it is untouched**

Run: `node scripts/scroll-shots.mjs http://localhost:3000 "section[aria-label='From tools to navigation']" "0.1,0.4,0.53,0.62,0.78" shots-lineup 1440 900`

Expected: tools drift apart, stand in their six columns with captions, dissolve to circles, merge, become the compass. Identical to before this branch — compare against `git stash`-free reference shots if in doubt.

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/Hero.tsx src/components/sections/OutcomeTransition.tsx src/components/sections/OutcomeTransition.module.css
git commit -m "feat: the hero knife dissolves into the one that comes apart"
```

---

### Task 7: Restore the blade hover and verify the whole page

The hover-dim died with `KnifeStory`. It belongs to whichever scene shows an open, labelled knife — now the Hero.

**Files:**
- Modify: `src/components/sections/Hero.tsx` (add the hover handlers)

**Interfaces:**
- Consumes: `blades`, `labels`, `wrap`, `tl`, `OPEN_AT` from Task 5.
- Produces: nothing.

- [ ] **Step 1: Add `hoverOk` to the matchMedia conditions**

In `Hero.tsx`, extend the `mm.add` conditions object and its destructure:

```tsx
        {
          motionOk: "(prefers-reduced-motion: no-preference)",
          compact: "(max-width: 768px)",
          hoverOk: "(hover: hover) and (pointer: fine)",
        },
        (ctx) => {
          const { motionOk, compact, hoverOk } = ctx.conditions as {
            motionOk: boolean;
            compact: boolean;
            hoverOk: boolean;
          };
```

- [ ] **Step 2: Add the hover handlers at the end of the callback**

After the handoff block from Task 6, still inside the `mm.add` callback:

```tsx
          // §39: once the fan has finished, hovering a blade dims the others
          // and lifts its own label. Desktop only.
          if (hoverOk && !compact) {
            const st = tl.scrollTrigger;

            const onOver = (e: MouseEvent) => {
              const hit = (e.target as Element | null)?.closest?.("[data-tool]");
              if (!hit || !st || st.progress < OPEN_AT) return;
              const id = hit.getAttribute("data-tool");
              blades.forEach((t) =>
                gsap.to(t, { opacity: t === hit ? 1 : 0.55, duration: 0.2, overwrite: "auto" })
              );
              labels.forEach((l) =>
                gsap.to(l, {
                  color: l.getAttribute("data-label") === id ? "#f8f4f2" : "#9e9493",
                  duration: 0.2,
                  overwrite: "auto",
                })
              );
            };

            const onLeave = () => {
              blades.forEach((t) => gsap.to(t, { opacity: 1, duration: 0.2, overwrite: "auto" }));
              labels.forEach((l) =>
                gsap.to(l, { color: "#eee8e6", duration: 0.2, overwrite: "auto" })
              );
            };

            wrap.addEventListener("mouseover", onOver);
            wrap.addEventListener("mouseleave", onLeave);
            return () => {
              wrap.removeEventListener("mouseover", onOver);
              wrap.removeEventListener("mouseleave", onLeave);
            };
          }
```

The blade hover also needs the pointer to reach it: `.knifeSlot` carries `pointer-events: none` from Task 4, and `knife.module.css` re-enables it on painted SVG only (`.tool svg * { pointer-events: visiblePainted; }`). That combination is what `KnifeStory` relied on, so it works unchanged.

- [ ] **Step 3: Verify**

Run: `npm run check && npm test && npm run build`
Expected: all clean.

- [ ] **Step 4: Walk the whole page**

Run: `node scripts/scroll-shots.mjs http://localhost:3000 "body" "0,0.05,0.1,0.2,0.35,0.5,0.65,0.8,0.95" shots-page 1440 900`

Expected: hero → open knife → lineup → circles → compass → cases → career → operating model → CTA, with no gap where the story used to be and no double knife anywhere. The page is roughly 400vh shorter than before the branch, which is the whole point.

- [ ] **Step 5: Confirm the FinalCTA knife still folds**

Run: `node scripts/scroll-shots.mjs http://localhost:3000 "section[aria-label='Contact']" "0.2,0.6,0.9" shots-cta 1440 900`

If that `aria-label` does not match, read `src/components/sections/FinalCTA.tsx` for the real one. Expected: the knife arrives open and folds closed tool by tool, unchanged — it renders its own `KnifeCanvas` with `angles={OPEN_ANGLES}` and never depended on the story.

- [ ] **Step 6: Clean up the screenshots and commit**

Screenshots match the `shots-*.png` gitignore rule, so they are already untracked. Delete them anyway:

```bash
rm -f shots-*.png
git add src/components/sections/Hero.tsx
git commit -m "feat: hovering a blade dims the rest again"
```

---

## Deferred, not forgotten

`c.statement`, `c.tags` and `c.hover` in `src/lib/data/capabilities.ts` now have **no consumer**. The fields stay — `data.test.ts` still asserts them and Cyril is reworking the narrative separately. Three pieces of copy lost their home with the story section and need a decision, not a guess:

- the six per-capability statements and tag lists
- the intro line, "Sometimes the problem isn't a design problem."
- the closing line, "One person. Multiple points of leverage."

The `OPEN_AT` → `HANDOFF_START` stretch of the hero timeline (0.4 → 0.9, about 50vh) is where that copy would land. Until it does, that stretch is a hold with nothing in it; shortening it is a one-line change in `scroll.ts`.

`c.hover` was already dead before this branch — the hover handler dims blades and recolours labels but never renders the string.
