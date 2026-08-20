# One Knife Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** One knife DOM object for the whole opening. It sits in the hero as a small tilted peek, travels to centre, zooms up, fans open with labels, and is blown apart by the lineup — no second knife, no crossfade, no dead scroll.

**Architecture:** The knife lives where the lineup already expects it: inside `OutcomeTransition`'s `.inner`. That section's pinned stage is pulled up to start at document `0`, so the knife is on screen from the first pixel of the hero — the hero renders no knife of its own. A new wrapper inside `[data-knife-el]` is the handle the Hero's timeline drives; it returns to identity exactly as the hero ends, so every coordinate the lineup uses is unchanged. `KnifeOpening` is deleted outright.

**Tech Stack:** Next.js App Router (static export), React, GSAP + ScrollTrigger via `useGSAP`, CSS Modules, Vitest.

**Spec:** `docs/superpowers/specs/2026-08-20-hero-knife-opening-design.md`

**Branch:** `no-knife-story` (builds on `fcf3e23`)

## Why this shape

Three symptoms in the current build, all from the same cause — two knives:

1. ~200vh of black scroll where a knife drifts alone on an empty stage
2. The second knife rising into frame from the bottom (a sticky stage sliding up before it sticks)
3. A crossfade between them, which forced the landing size to match and turned the requested zoom-in into a 1.21× → 1.0× shrink

One DOM object removes all three. It also makes the zoom real: the peek becomes the same knife at `scale: 0.75`, so travel is 0.75× → 1.0×.

## Scroll arithmetic

| | Before | After |
| --- | --- | --- |
| Hero | 100vh | **200vh** (100vh stage + 100vh of scrub) |
| KnifeOpening | 200vh | **deleted** |
| `OutcomeTransition` height | 625vh | **725vh** |
| `OutcomeTransition` margin-top | −100vh | **−200vh** |
| `OutcomeTransition` trigger start | `"top top"` | **`() => window.innerHeight`** |

`OutcomeTransition`'s section now spans document `0 → 725vh`, so its sticky stage is pinned from the very first pixel and never rises into frame. Its trigger runs `100vh → 625vh` — a **525vh range, identical to today**, so every beat, snap position and `DUR` keeps its exact scroll length. Net page height drops ~100vh more.

## Global Constraints

- `OutcomeTransition`'s **choreography** does not change — only the three numbers above, two CSS rules, and two wrapper divs.
- Animate only `transform` and `opacity`.
- Every timeline inside `gsap.matchMedia`. Reduced motion builds **no** timeline.
- Compact (`max-width: 768px`): blade angles ×0.8, labels hidden, peek sits low-right.
- `immediateRender: false` on every `fromTo`.
- `capabilities.ts` stays the single source of truth for blades.
- No new user-facing copy.
- `output: "export"` must keep working.

## Verification

`npm run check`, `npm test`, `npm run build`, then `scroll-shots.mjs`. Dev server is already up on port 3000 — reuse it. **No new probe scripts.**

---

### Task 1: Give the lineup's knife a handle, and put it on screen

`OutcomeTransition` gains two wrapper divs and loses its open-by-default pose. Nothing in its timeline moves.

**Files:**
- Modify: `src/components/sections/OutcomeTransition.tsx` — imports, JSX, trigger `start`
- Modify: `src/components/sections/OutcomeTransition.module.css` — `.section` height/margin, `.knifeEl` visibility, reduced motion
- Modify: `src/components/knife/knife.module.css` — gains the label rules

**Interfaces:**
- Produces: `[data-knife-intro]` — an `position: absolute; inset: 0` wrapper inside `[data-knife-el]`, at identity transform whenever `OutcomeTransition`'s timeline is running. The Hero drives `x`, `y`, `scale`, `rotation` on it, and `[data-tool]` / `[data-label]` live inside it.
- Consumes: nothing.

- [ ] **Step 1: Move the label styles into `knife.module.css`**

Append to `src/components/knife/knife.module.css` (same rules `knife-opening.module.css` holds today, plus the reduced-motion and compact cases):

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

Then point `src/components/knife/ToolLabels.tsx:2` at it:

```tsx
import styles from "./knife.module.css";
```

- [ ] **Step 2: Wrap the knife and close its blades**

In `src/components/sections/OutcomeTransition.tsx`, add the `ToolLabels` import beside `KnifeCanvas`:

```tsx
import KnifeCanvas from "@/components/knife/KnifeCanvas";
import ToolLabels from "@/components/knife/ToolLabels";
```

Delete the now-unused `OPEN_ANGLES` const (line 11):

```tsx
const OPEN_ANGLES = Object.fromEntries(capabilities.map((c) => [c.id, c.openAngle]));
```

Replace the `.knifeEl` block in the JSX:

```tsx
          <div className={styles.knifeEl} data-knife-el="">
            <KnifeCanvas angles={OPEN_ANGLES} />
          </div>
```

with:

```tsx
          <div className={styles.knifeEl} data-knife-el="">
            {/* The Hero's timeline drives this wrapper — peek, travel, zoom,
                fan — and leaves it at identity exactly as that timeline ends.
                Everything below therefore sees the same geometry it always
                did, and there is only ever one knife on the page. */}
            <div className={styles.knifeIntro} data-knife-intro="">
              <KnifeCanvas />
              <ToolLabels />
            </div>
          </div>
```

`KnifeCanvas` without `angles` renders closed, which is what the fan opens from. Its default `reducedPose="open"` still opens the blades via CSS under `prefers-reduced-motion: reduce`.

- [ ] **Step 3: Start the trigger a viewport late**

In the same file's `ScrollTrigger` config, replace:

```tsx
              start: "top top",
```

with:

```tsx
              // the section is pulled up to document 0 so its stage is pinned
              // from the first pixel and the knife never rises into frame.
              // The timeline itself still begins where the hero's ends.
              start: () => window.innerHeight,
```

- [ ] **Step 4: Reposition the section and reveal the knife**

In `src/components/sections/OutcomeTransition.module.css`:

Replace the `.section` height and margin (lines 2-8):

```css
	/* 100vh viewport + 420vh of story + ~105vh of compass runway — locked
	   to DUR in OutcomeTransition.tsx (height = 100vh + 420vh × DUR) */
	height: 625vh;
	/* starts one viewport early: the pin engages exactly as the story knife
	   finishes centering, so the handoff is an in-place swap */
	margin-top: -100vh;
```

with:

```css
	/* 200vh viewport + 420vh of story + ~105vh of compass runway — locked to
	   DUR in OutcomeTransition.tsx (height = 200vh + 420vh × DUR) */
	height: 725vh;
	/* pulled up over the whole hero so the stage is pinned from the first
	   pixel: the one knife on the page is already on screen, and never has to
	   rise into frame. The trigger's own start is offset to compensate. */
	margin-top: -200vh;
```

Add the intro wrapper beside `.knifeEl` (after line 35):

```css
.knifeIntro {
	position: absolute;
	inset: 0;
}
```

Remove `.knifeEl` from the `opacity: 0` list in the `no-preference` block (around line 202) — the knife is visible from the start now. The list becomes:

```css
	.circle,
	.compassWrap,
	.statement,
	.interLine,
	.col {
		opacity: 0;
	}
```

Remove `.knifeEl` from the reduced-motion `display: none` list (around line 228), so it becomes:

```css
	.circles,
	.bloom,
	.lineup,
	.interLine {
		display: none;
	}
```

- [ ] **Step 5: Verify nothing regressed yet**

Run: `npm run check && npm test && npm run build`
Expected: clean. The page still has two knives at this point (the opening section is still there) — Task 2 removes it. Do not screenshot for correctness yet.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: the lineup's knife gets a handle and comes on screen early"
```

---

### Task 2: The hero drives the one knife

Delete `KnifeOpening`. The Hero becomes 200vh, drops its own knife, and takes over the peek, travel, zoom and fan.

**Files:**
- Delete: `src/components/knife/KnifeOpening.tsx`, `src/components/knife/knife-opening.module.css`
- Modify: `src/app/page.tsx`
- Modify: `src/lib/data/scroll.ts`, `src/lib/data/data.test.ts`
- Modify: `src/components/sections/Hero.tsx`, `src/components/sections/Hero.module.css`

**Interfaces:**
- Consumes: `[data-knife-intro]` from Task 1.
- Produces, from `@/lib/data/scroll`: `COPY_OUT_END`, `TRAVEL_START`, `TRAVEL_END`, `OPEN_AT`, `REARM_AT`, `LABELS_OUT`, `STAGGER`, `BLADE_DUR`, `LABEL_DELAY`, `PEEK_SCALE` (all `number`) and `bladeDelay(i: number): number`.

- [ ] **Step 1: Rewrite the beats**

Replace the whole of `src/lib/data/scroll.ts` — the six story windows go with the section they described:

```ts
/**
 * Beats for the knife's opening. Progress is 0..1 across the hero's 200vh:
 * the copy leaves, the one knife on the page travels from its peek to centre
 * stage and grows, the blades fan open on their own clock, then the lineup's
 * timeline takes the same element over.
 *
 * The fan is deliberately NOT on this scale — it runs in seconds, fired once
 * when the knife lands. Scrubbed easing reads as the reader's hand; time-based
 * easing reads as the object's own weight.
 */

/** The hero copy has fully cleared the stage by here. */
export const COPY_OUT_END = 0.2;

/** The knife's scrubbed travel from its peek to centre stage. */
export const TRAVEL_START = 0.08;
export const TRAVEL_END = 0.55;

/** Landing fires the fan. Scrolling back below REARM_AT re-arms it; the gap
    between the two is hysteresis, so jitter at the threshold cannot retrigger. */
export const OPEN_AT = TRAVEL_END;
export const REARM_AT = 0.45;

/** Labels retire before the lineup starts pulling the knife apart. */
export const LABELS_OUT = 0.92;

/** Seconds between blade starts. */
export const STAGGER = 0.1;
/** Seconds for one blade to swing out and settle. */
export const BLADE_DUR = 0.75;
/** Seconds after a blade starts before its label arrives. */
export const LABEL_DELAY = 0.22;

/** The peek is the same knife, smaller — so the travel is a genuine zoom in
    rather than the shrink two separate knives forced. */
export const PEEK_SCALE = 0.75;

/** Start offset, in seconds, for blade `i` of the fan. */
export function bladeDelay(i: number): number {
  return i * STAGGER;
}
```

- [ ] **Step 2: Update the tests**

In `src/lib/data/data.test.ts`, replace the `./scroll` import with:

```ts
import {
  COPY_OUT_END,
  TRAVEL_START,
  TRAVEL_END,
  OPEN_AT,
  REARM_AT,
  LABELS_OUT,
  STAGGER,
  BLADE_DUR,
  LABEL_DELAY,
  PEEK_SCALE,
  bladeDelay,
} from "./scroll";
```

Delete the `describe("scroll windows", ...)` block entirely, and replace the `describe("opening beats", ...)` block's first two tests with:

```ts
  it("clears the copy, travels, lands, then frees the knife, in order", () => {
    expect(TRAVEL_START).toBeGreaterThan(0);
    expect(TRAVEL_START).toBeLessThan(COPY_OUT_END);
    expect(TRAVEL_END).toBeGreaterThan(COPY_OUT_END);
    expect(OPEN_AT).toBeGreaterThanOrEqual(TRAVEL_END);
    expect(LABELS_OUT).toBeGreaterThan(OPEN_AT);
    expect(LABELS_OUT).toBeLessThan(1);
  });

  it("re-arms the fan below the trigger, with hysteresis", () => {
    expect(REARM_AT).toBeLessThan(OPEN_AT);
    expect(REARM_AT).toBeGreaterThan(TRAVEL_START);
  });

  it("peeks smaller than it lands, so the travel is a zoom in", () => {
    expect(PEEK_SCALE).toBeGreaterThan(0);
    expect(PEEK_SCALE).toBeLessThan(1);
  });
```

Keep the two stagger tests unchanged.

- [ ] **Step 3: Delete the opening section**

```bash
git rm src/components/knife/KnifeOpening.tsx src/components/knife/knife-opening.module.css
```

In `src/app/page.tsx`, delete the `KnifeOpening` import (line 4) and the `<KnifeOpening />` element (line 20).

- [ ] **Step 4: Rewrite the Hero**

Replace `src/components/sections/Hero.tsx` with:

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
  LABELS_OUT,
  BLADE_DUR,
  LABEL_DELAY,
  PEEK_SCALE,
  bladeDelay,
} from "@/lib/data/scroll";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./Hero.module.css";

/**
 * The opening. Two viewports over a sticky stage: the copy leaves, the knife
 * travels in from its peek and grows, its blades fan open a at a time, and the
 * lineup's timeline picks the same element up where this one lets go.
 *
 * The knife itself belongs to OutcomeTransition — that section's stage is
 * pinned from the first pixel of the page, so its knife is already on screen
 * here. There is exactly one knife in the DOM and this drives it by the
 * [data-knife-intro] handle, leaving it at identity when the hero ends.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
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
          if (!motionOk) return;

          const section = sectionRef.current;
          const knifeEl = document.querySelector<HTMLElement>("[data-knife-el]");
          const intro = document.querySelector<HTMLElement>("[data-knife-intro]");
          if (!section || !knifeEl || !intro) return;

          // §32: compress blade angles on small screens
          const factor = compact ? 0.8 : 1;

          const blades = Array.from(intro.querySelectorAll<HTMLElement>("[data-tool]"));
          const labels = Array.from(intro.querySelectorAll<HTMLElement>("[data-label]"));

          // The knife box, centred in the viewport by OutcomeTransition's grid
          // and shifted right by 0.135 * S so the left-biased art reads centred.
          const S = () => knifeEl.offsetWidth;
          const artCentre = () => window.innerWidth / 2 + 0.135 * S();

          // Where the peek sits, as an offset from the knife's resting place.
          // Desktop: tucked to the right of the copy. Compact: low-right, clear
          // of the headline, matching where the hero's knife always sat.
          const peekX = () =>
            window.innerWidth -
            0.03 * window.innerWidth -
            (PEEK_SCALE * S()) / 2 -
            artCentre();
          const peekY = () =>
            compact ? 0.3 * window.innerHeight : -0.08 * window.innerHeight;

          gsap.set(intro, {
            x: peekX,
            y: peekY,
            scale: PEEK_SCALE,
            rotation: -14,
          });

          // The fan runs on its own clock, fired once when the knife lands and
          // re-armed if the reader scrolls back up past REARM_AT.
          let fanned = false;
          const fan = gsap.timeline({ paused: true });
          capabilities.forEach((c, i) => {
            fan.fromTo(
              `[data-tool="${c.id}"]`,
              { rotation: 0 },
              {
                rotation: c.openAngle * factor,
                duration: BLADE_DUR,
                // sweeps a little past the resting angle and settles back —
                // the mechanical overshoot a real blade has
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

          // spacer: every position below is literally a scroll fraction
          tl.to({}, { duration: 1 }, 0);

          // the copy leaves so the knife has the stage to itself
          tl.to(
            "[data-hero-copy]",
            { autoAlpha: 0, y: -48, duration: COPY_OUT_END, ease: "power2.in" },
            0
          );

          // the knife travels to centre, straightens and grows. Identity at the
          // end — which is exactly the pose the lineup's timeline assumes.
          tl.to(
            intro,
            {
              x: 0,
              y: 0,
              scale: 1,
              rotation: 0,
              duration: TRAVEL_END - TRAVEL_START,
              ease: "power2.inOut",
            },
            TRAVEL_START
          );

          // labels retire before the lineup starts pulling the blades apart
          tl.to(labels, { autoAlpha: 0, duration: 0.05, ease: "power2.in" }, LABELS_OUT);

          // §39: once the fan has finished, hovering a blade dims the others
          // and lifts its own label. Desktop only.
          if (hoverOk && !compact) {
            const st = tl.scrollTrigger;

            const onOver = (e: MouseEvent) => {
              const hit = (e.target as Element | null)?.closest?.("[data-tool]");
              if (!hit || !st || st.progress < OPEN_AT || st.progress > LABELS_OUT) return;
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

            intro.addEventListener("mouseover", onOver);
            intro.addEventListener("mouseleave", onLeave);
            return () => {
              intro.removeEventListener("mouseover", onOver);
              intro.removeEventListener("mouseleave", onLeave);
            };
          }
        }
      );

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.hero} id="top">
      <div className={styles.stage}>
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
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Rewrite the Hero's CSS**

In `src/components/sections/Hero.module.css`, replace the `.hero` rule and delete `.knifePeek` and the mobile `.knifePeek` block. The head of the file becomes:

```css
.hero {
	position: relative;
	/* one viewport of stage, one of scroll to play the opening across */
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
```

Keep `.inner`, `.eyebrow`, `.headline`, `.desc`, `.cue`, `.arrow`, the `nudge` keyframes and the hover block exactly as they are. Replace the trailing `@media (max-width: 768px)` block with:

```css
@media (max-width: 768px) {
	.stage {
		align-items: flex-start;
		padding-block: 8rem 0;
	}
}
```

and add a reduced-motion rule so the hero stops being two viewports of nothing:

```css
@media (prefers-reduced-motion: reduce) {
	.hero {
		height: auto;
	}

	.stage {
		position: static;
		height: auto;
		min-height: 100vh;
		overflow: visible;
	}
}
```

- [ ] **Step 6: Verify**

Run: `npm run check && npm test && npm run build`
Expected: all clean.

- [ ] **Step 7: Screenshot the opening**

```bash
node scripts/scroll-shots.mjs http://localhost:3000 "#top" "0,0.25,0.55,0.8,1" shots-one 1440 900
```

Expected: peek small and tilted at the right with the copy present; copy leaving and the knife on the move; landed centre, larger than it started, fanning; open with labels; still open, labels gone. **One knife in every frame.**

- [ ] **Step 8: Screenshot the join into the lineup**

```bash
node scripts/scroll-shots.mjs http://localhost:3000 "body" "0,0.04,0.09,0.14,0.22,0.3,0.4" shots-join 1440 900
```

Expected: no black gap, no second knife, and the tools coming apart straight from the knife the hero left open.

- [ ] **Step 9: Reduced motion and compact**

```bash
node scripts/shot.mjs http://localhost:3000 shots-one-reduce.png 1440 900 reduce full
node scripts/scroll-shots.mjs http://localhost:3000 "#top" "0,0.8" shots-one-mob 390 844
```

Expected: reduced motion shows the copy and a static open labelled knife with no empty scroll. Mobile shows the peek low-right, then an open knife with compressed angles and no labels.

- [ ] **Step 10: Commit**

```bash
rm -f shots-*.png
git add -A
git commit -m "feat: one knife from the hero to the lineup"
```

---

### Task 3: Sweep the stale names

**Files:**
- Modify: `src/components/MotionProvider.tsx:13`
- Modify: `src/components/sections/OutcomeTransition.tsx` (comments around 141-147)
- Modify: `src/components/sections/OutcomeTransition.module.css` (comment on the `pointer-events` rule)

- [ ] **Step 1: Find them**

Run: `grep -rn "KnifeStory\|KnifeOpening\|story knife\|the story" src/`
Expected: comments only.

- [ ] **Step 2: Retarget**

`MotionProvider.tsx:13` — `(KnifeStory, OutcomeTransition, FinalCTA)` becomes `(Hero, OutcomeTransition, FinalCTA)`.

`OutcomeTransition.tsx` — the note about the story timeline performing an in-place swap is now wrong in substance, not just in name. Replace the two comment paragraphs before the `[data-knife-el]` tween with:

```tsx
          // The hero drives this same element by its [data-knife-intro] handle
          // and leaves it at identity — there is one knife on the page and no
          // swap to get wrong.

          // sits shifted right so the left-biased art reads centred. Slides
          // back to neutral while the tools drift apart — the motion masks it
          // and every later beat keeps plain math.
```

`OutcomeTransition.module.css` — the `pointer-events: none` comment saying "must not swallow the story's hover" becomes "must not swallow the hero's hover".

- [ ] **Step 3: Verify and commit**

```bash
npm run check && npm test && npm run build
git add -A
git commit -m "chore: the story's name retires with it"
```

---

## Deferred, not forgotten

`c.statement`, `c.tags` and `c.hover` have no consumer. The fields stay — `data.test.ts` still asserts them and Cyril is reworking the narrative separately. Homeless copy: the six per-capability statements and tag lists, "Sometimes the problem isn't a design problem.", and "One person. Multiple points of leverage."

The `OPEN_AT` → `LABELS_OUT` stretch (0.55 → 0.92, about 37vh) is where that copy would land.
