# Knife Opening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 600vh knife story with a 200vh transition that brings the hero's knife to the middle, zooms it up and fans it open with labels, then hands to the lineup.

**Architecture:** One section changes. `KnifeStory` becomes `KnifeOpening` — same sticky-stage construction, narrative column removed, six scrubbed blade windows replaced by one time-based fan. The knife's start position is tightened to match the hero's peek exactly; its landing pose is unchanged, so `OutcomeTransition` needs no edit.

**Tech Stack:** Next.js App Router (static export), React, GSAP + ScrollTrigger via `useGSAP`, CSS Modules, Vitest.

**Spec:** `docs/superpowers/specs/2026-08-20-hero-knife-opening-design.md`

**Branch:** `no-knife-story`

## Global Constraints

- `Hero.tsx` and `Hero.module.css`: **do not touch.**
- `OutcomeTransition.tsx` and `OutcomeTransition.module.css`: **no code change.** Comment text only.
- Animate only `transform` and `opacity`.
- Every timeline inside `gsap.matchMedia`. Reduced motion builds **no** timeline — CSS renders the static open pose.
- Compact (`max-width: 768px`): blade angles ×0.8, labels hidden.
- `immediateRender: false` on every `fromTo`, or the "from" pose renders at build time and the knife starts open.
- `capabilities.ts` stays the single source of truth for blades.
- No new user-facing copy — the narrative rework is deferred and separate.
- Neutrals carry ~2% accent tinge. No plain black, no plain white.
- `output: "export"` must keep working.

## Verification commands

- `npm run check`, `npm test`, `npm run build`
- `node scripts/shot.mjs <url> <out.png> [w h] [reduce] [full]`
- `node scripts/scroll-shots.mjs <url> <selector> "0.2,0.5" <prefix> [w h]`

Cyril usually has a dev server on port 3000 — check before starting one, and read the PID before killing anything. **Do not create new probe scripts**; ask first if one seems needed.

---

### Task 1: Add the opening's beats to the scroll module

Additive on purpose. `KnifeStory` still imports the old window exports, so adding beside them keeps the tree compiling; Task 3 removes the dead ones once nothing reads them.

**Files:**
- Modify: `src/lib/data/scroll.ts` (append)
- Modify: `src/lib/data/data.test.ts:5` (imports), append one `describe`

**Interfaces:**
- Produces, from `@/lib/data/scroll`: `TRAVEL_START`, `TRAVEL_END`, `OPEN_AT`, `REARM_AT`, `STAGGER`, `BLADE_DUR`, `LABEL_DELAY`, `HANDOFF_START`, `HANDOFF_DUR` — all `number` — and `bladeDelay(i: number): number`.

- [ ] **Step 1: Write the failing tests**

In `src/lib/data/data.test.ts`, extend the import on line 5:

```ts
import {
  windowFor,
  INTRO_END,
  COMPLETE_START,
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

Then append at the end of the file:

```ts
describe("opening beats", () => {
  it("travels, lands, then hands off, all inside one scroll pass", () => {
    expect(TRAVEL_START).toBeGreaterThan(0);
    expect(TRAVEL_END).toBeGreaterThan(TRAVEL_START);
    expect(OPEN_AT).toBeGreaterThanOrEqual(TRAVEL_END);
    expect(HANDOFF_START).toBeGreaterThan(OPEN_AT);
    expect(HANDOFF_START + HANDOFF_DUR).toBeCloseTo(1);
  });

  it("re-arms the fan below the trigger, with hysteresis", () => {
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

  it("overlaps the blades so the fan reads as one gesture", () => {
    expect(STAGGER).toBeLessThan(BLADE_DUR);
    expect(LABEL_DELAY).toBeGreaterThan(0);
    expect(LABEL_DELAY).toBeLessThan(BLADE_DUR);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/lib/data/data.test.ts`
Expected: FAIL — the import errors, since `scroll.ts` exports none of these names.

- [ ] **Step 3: Append the beats to `scroll.ts`**

Add at the end of `src/lib/data/scroll.ts`:

```ts
/**
 * Beats for the knife opening. Progress is 0..1 across the section's 200vh:
 * the knife arrives from the hero and grows into the stage, the blades fan
 * open on their own clock, then it dissolves into the morph section's knife.
 *
 * The fan is deliberately NOT on this scale — it runs in seconds, fired once
 * when the knife lands. Scrubbed easing reads as the reader's hand; time-based
 * easing reads as the object's own weight.
 */

/** The knife's scrubbed travel from the hero's peek to centre stage. */
export const TRAVEL_START = 0.05;
export const TRAVEL_END = 0.42;

/** Landing fires the fan. Scrolling back below REARM_AT re-arms it; the gap
    between the two is hysteresis, so jitter at the threshold cannot retrigger. */
export const OPEN_AT = TRAVEL_END;
export const REARM_AT = 0.34;

/** Seconds between blade starts. */
export const STAGGER = 0.1;
/** Seconds for one blade to swing out and settle. */
export const BLADE_DUR = 0.75;
/** Seconds after a blade starts before its label arrives. */
export const LABEL_DELAY = 0.22;

/** The crossfade into OutcomeTransition's knife, ending exactly as this
    section unpins and that one pins. */
export const HANDOFF_DUR = 0.1;
export const HANDOFF_START = 1 - HANDOFF_DUR;

/** Start offset, in seconds, for blade `i` of the fan. */
export function bladeDelay(i: number): number {
  return i * STAGGER;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/lib/data/data.test.ts`
Expected: PASS — the four new assertions plus every existing block.

- [ ] **Step 5: Verify the type-check**

Run: `npm run check`
Expected: clean. `KnifeStory` still compiles against the old exports.

- [ ] **Step 6: Commit**

```bash
git add src/lib/data/scroll.ts src/lib/data/data.test.ts
git commit -m "feat: the scroll module gains the opening's beats"
```

---

### Task 2: The story becomes the opening

The whole change lives here. Rename, strip the narrative, tighten the start position to the hero's peek, swap the six scrubbed windows for one time-based fan.

**Files:**
- Rename + rewrite: `src/components/knife/KnifeStory.tsx` → `src/components/knife/KnifeOpening.tsx`
- Rename + rewrite: `src/components/knife/knife-story.module.css` → `src/components/knife/knife-opening.module.css`
- Modify: `src/components/knife/ToolLabels.tsx:2` (the module it imports)
- Modify: `src/app/page.tsx:4,20`

**Interfaces:**
- Consumes: Task 1's beats; `KnifeCanvas`; `ToolLabels`; `capabilities`; `[data-knife-el]` rendered by `OutcomeTransition`.
- Produces: a default-exported `KnifeOpening` component, and `.labels` / `.label` / `.labelVisible` classes in `knife-opening.module.css` for `ToolLabels`.

- [ ] **Step 1: Rename both files**

```bash
git mv src/components/knife/KnifeStory.tsx src/components/knife/KnifeOpening.tsx
git mv src/components/knife/knife-story.module.css src/components/knife/knife-opening.module.css
```

- [ ] **Step 2: Write the new CSS**

Replace the entire contents of `src/components/knife/knife-opening.module.css` with:

```css
.opening {
	position: relative;
	/* one viewport of stage, one of scroll to play the opening across */
	height: 200vh;
}

.stage {
	position: sticky;
	top: 0;
	height: 100vh;
	overflow: hidden;
}

/* Starts exactly on the hero's knife peek — same width, same right offset,
   same tilt — so the knife reads as the same object arriving, not a new one.
   The vertical centring is `top`, not a translate: GSAP owns the transform
   from the first tick and a percentage translate would fight it. */
.knifeWrap {
	position: absolute;
	right: 3vw;
	width: min(44vw, 640px);
	top: calc(50% - 0.5 * min(44vw, 640px));
	transform: rotate(-14deg);
}

/* ---- orbit labels ---- */

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

/* ---- reduced motion: no stage, no travel, the knife simply stands open ---- */

@media (prefers-reduced-motion: reduce) {
	.opening {
		height: auto;
	}

	.stage {
		position: static;
		height: auto;
		overflow: visible;
		padding-block: var(--space-section);
	}

	/* the open blades sweep well outside the closed silhouette, so the knife
	   gets the middle of the page rather than a corner */
	.knifeWrap {
		position: relative;
		top: auto;
		right: auto;
		width: min(70vw, 520px);
		margin-inline: auto;
		transform: none;
	}

	.label {
		opacity: 1;
		visibility: visible;
	}
}

/* ---- narrow screens: match the hero's mobile peek ---- */

@media (max-width: 768px) {
	.knifeWrap {
		width: 72vw;
		top: auto;
		right: 4vw;
		bottom: 3%;
	}

	/* §33: no labels orbiting the object on mobile — there is not room */
	.labels {
		display: none;
	}
}
```

- [ ] **Step 3: Point `ToolLabels` at the renamed module**

In `src/components/knife/ToolLabels.tsx`, change line 2 from:

```tsx
import styles from "./knife-story.module.css";
```

to:

```tsx
import styles from "./knife-opening.module.css";
```

- [ ] **Step 4: Write the new component**

Replace the entire contents of `src/components/knife/KnifeOpening.tsx` with:

```tsx
"use client";

import { useRef } from "react";
import { capabilities } from "@/lib/data/capabilities";
import {
  TRAVEL_START,
  TRAVEL_END,
  OPEN_AT,
  REARM_AT,
  BLADE_DUR,
  LABEL_DELAY,
  HANDOFF_START,
  HANDOFF_DUR,
  bladeDelay,
} from "@/lib/data/scroll";
import { gsap, useGSAP } from "@/lib/gsap";
import KnifeCanvas from "./KnifeCanvas";
import ToolLabels from "./ToolLabels";
import styles from "./knife-opening.module.css";

/**
 * The transition between the hero and the lineup. The knife arrives from the
 * hero's peek, travels to the middle and grows until it has the stage, then
 * fans open a blade at a time before dissolving into the morph section's
 * knife. No narrative — the copy that used to live here is being reworked.
 */
export default function KnifeOpening() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

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
          const stage = stageRef.current;
          const wrap = wrapRef.current;
          if (!section || !stage || !wrap) return;

          // §32: compress blade angles on small screens
          const factor = compact ? 0.8 : 1;

          const blades = Array.from(wrap.querySelectorAll<HTMLElement>("[data-tool]"));
          const labels = Array.from(wrap.querySelectorAll<HTMLElement>("[data-label]"));

          // Layout values, not getBoundingClientRect: the knife starts tilted,
          // and a rotated element's rect is its axis-aligned box — wider than
          // the element. offset* is immune to transforms, so this stays correct
          // at every angle, scale and scroll position.
          const box = () => ({
            w: wrap.offsetWidth,
            cx: wrap.offsetLeft + wrap.offsetWidth / 2,
            cy: wrap.offsetTop + wrap.offsetHeight / 2,
          });

          // The same expression as OutcomeTransition's .inner width, so the two
          // knives are congruent when the crossfade happens.
          const targetW = () =>
            Math.min(0.58 * window.innerHeight, 0.54 * window.innerWidth, 660);

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

          // the knife travels to the middle, straightens and grows into the
          // stage. Lazy functions, so resize and mid-page reload both land.
          tl.to(
            wrap,
            {
              x: () =>
                // the art sits left of centre in its box, so the box lands
                // shifted right for the ART to read centred. OutcomeTransition
                // opens by sliding this same offset back to zero.
                stage.clientWidth / 2 - box().cx + 0.135 * targetW(),
              y: () => stage.clientHeight / 2 - box().cy,
              scale: () => targetW() / box().w,
              rotation: 0,
              duration: TRAVEL_END - TRAVEL_START,
              ease: "power2.inOut",
            },
            TRAVEL_START
          );

          // labels retire before the handoff, so no label-sized ghost survives
          // into a knife that has none
          tl.to(labels, { autoAlpha: 0, duration: 0.04, ease: "power2.in" }, HANDOFF_START - 0.05);

          // Crossfade rather than a hard swap: two near-identical frames
          // dissolving absorbs whatever lag the scrub is carrying, so there is
          // never a visible jump and never two knives.
          const morphKnife = document.querySelector("[data-knife-el]");
          if (morphKnife) {
            tl.to(morphKnife, { autoAlpha: 1, duration: HANDOFF_DUR, ease: "none" }, HANDOFF_START);
            tl.to(wrap, { autoAlpha: 0, duration: HANDOFF_DUR, ease: "none" }, HANDOFF_START);

            // The morph stage has not pinned yet during the crossfade — it is
            // still rising toward the top of the viewport and its knife rides
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
        }
      );

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className={styles.opening}
      aria-label="Capabilities"
      /* chapter marks: the knife lands, then the handoff */
      data-ruler-beats={`${TRAVEL_END},${HANDOFF_START}`}
    >
      <div className={styles.stage} ref={stageRef}>
        <div className={styles.knifeWrap} ref={wrapRef}>
          <KnifeCanvas />
          <ToolLabels />
        </div>
      </div>
    </section>
  );
}
```

`KnifeCanvas` takes no `reducedPose` prop: its default is `"open"`, which applies `rotate(var(--open))` **only** inside a `prefers-reduced-motion: reduce` media query. Motion-enabled visitors get closed blades from the inline `rotate(0deg)`, which is what the fan starts from.

- [ ] **Step 5: Update the page**

In `src/app/page.tsx`, change line 4:

```tsx
import KnifeStory from "@/components/knife/KnifeStory";
```

to:

```tsx
import KnifeOpening from "@/components/knife/KnifeOpening";
```

and line 20:

```tsx
        <KnifeStory />
```

to:

```tsx
        <KnifeOpening />
```

- [ ] **Step 6: Verify**

Run: `npm run check && npm test && npm run build`
Expected: all three clean.

- [ ] **Step 7: Screenshot the opening**

Run: `node scripts/scroll-shots.mjs http://localhost:3000 "section[aria-label='Capabilities']" "0,0.2,0.42,0.6,0.95" shots-open 1440 900`

Expected, frame by frame:
- `0` — closed knife at the right, tilted, matching the hero's peek
- `0.2` — mid-travel, moving left and down, straightening, growing
- `0.42` — landed centre, blades starting to fan
- `0.6` — fully open with labels
- `0.95` — mid-crossfade, knife holding dead still

The fan is fired from `onUpdate`, so a jump past `OPEN_AT` still triggers it. If `0.6` shows a closed knife, the threshold never fired — check that before changing any numbers.

- [ ] **Step 8: Check reduced motion and compact**

```bash
node scripts/shot.mjs http://localhost:3000 shots-open-reduce.png 1440 900 reduce full
node scripts/scroll-shots.mjs http://localhost:3000 "section[aria-label='Capabilities']" "0,0.6" shots-open-mob 390 844
```

Expected: the `reduce` shot shows a centred, fully open, labelled knife in normal page flow with no 200vh of empty scroll. The mobile `0.6` frame shows an open knife with **compressed** angles and **no** labels.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: the story section becomes a knife that simply opens"
```

---

### Task 3: Retire the story's leftovers

The six scroll windows and their test now describe nothing. Remove them and retarget the comments that still name the old section.

**Files:**
- Modify: `src/lib/data/scroll.ts:1-14` (delete the window exports)
- Modify: `src/lib/data/data.test.ts` (delete the `scroll windows` block and its imports)
- Modify: `src/components/MotionProvider.tsx:13` (comment)
- Modify: `src/components/sections/OutcomeTransition.tsx:141-147` (comments)
- Modify: `src/components/sections/OutcomeTransition.module.css:7,10` (comments)

**Interfaces:**
- Consumes: nothing. Produces: nothing.

- [ ] **Step 1: Confirm nothing reads the window exports**

Run: `grep -rn "windowFor\|INTRO_END\|COMPLETE_START\|WINDOW\b" src/`
Expected: matches only in `src/lib/data/scroll.ts` and `src/lib/data/data.test.ts`. Anything else means Task 2 missed a call site — stop and report.

- [ ] **Step 2: Delete the window exports**

In `src/lib/data/scroll.ts`, delete lines 1-14 — the file-top docstring through the closing brace of `windowFor`. The file now begins with the opening-beats docstring added in Task 1.

- [ ] **Step 3: Delete the old test block and imports**

In `src/lib/data/data.test.ts`, remove `windowFor`, `INTRO_END` and `COMPLETE_START` from the `./scroll` import list, and delete the whole `describe("scroll windows", ...)` block.

- [ ] **Step 4: Retarget the stale comments**

`src/components/MotionProvider.tsx:13` — change `KnifeStory` to `KnifeOpening`:

```
 * scrubbed pinned sections (KnifeOpening, OutcomeTransition, FinalCTA)
```

`src/components/sections/OutcomeTransition.tsx:141-147` — replace:

```tsx
          // NOTE: the story timeline performs the in-place knife swap at its
          // own scrubbed completion (KnifeStory.tsx) — swapping from here
          // fired before the centering had rendered (scrub lag = two knives).

          // starts where the story knife lands: shifted right so the
          // left-biased art reads centered (KnifeStory.tsx). Slides back to
```

with:

```tsx
          // NOTE: the opening timeline performs the in-place knife swap at its
          // own scrubbed completion (KnifeOpening.tsx) — swapping from here
          // fired before the centering had rendered (scrub lag = two knives).

          // starts where the opening knife lands: shifted right so the
          // left-biased art reads centered (KnifeOpening.tsx). Slides back to
```

`src/components/sections/OutcomeTransition.module.css` — in the comments on lines 7 and 10, replace "the story knife" with "the opening knife" and "the story's hover" with "the opening's hover". No property values change.

- [ ] **Step 5: Verify**

Run: `npm run check && npm test && npm run build`
Expected: all clean.

- [ ] **Step 6: Walk the whole page**

Run: `node scripts/scroll-shots.mjs http://localhost:3000 "body" "0,0.06,0.12,0.22,0.38,0.55,0.7,0.85,0.97" shots-page 1440 900`

Expected: hero → knife arriving → open knife with labels → tools coming apart → lineup → circles → compass → cases → career → operating model → CTA. No gap where the story was, no double knife at the handoff, and the page roughly 400vh shorter than before the branch.

- [ ] **Step 7: Confirm the lineup is byte-for-byte unchanged**

Run: `git diff main --stat -- src/components/sections/OutcomeTransition.tsx`
Expected: comment lines only. If any statement changed, revert that hunk — the lineup was explicitly out of scope.

- [ ] **Step 8: Clean up and commit**

```bash
rm -f shots-*.png
git add -A
git commit -m "chore: the story's scroll windows and stale names retire"
```

---

## Deferred, not forgotten

`c.statement`, `c.tags` and `c.hover` in `src/lib/data/capabilities.ts` now have **no consumer**. The fields stay — `data.test.ts` still asserts them and Cyril is reworking the narrative separately. Three pieces of copy lost their home:

- the six per-capability statements and tag lists
- the intro line, "Sometimes the problem isn't a design problem."
- the closing line, "One person. Multiple points of leverage."

The `OPEN_AT` → `HANDOFF_START` stretch (0.42 → 0.90, about 50vh) is where that copy would land. Until it does, that stretch is a hold with nothing in it; shortening it is a one-line change in `scroll.ts`.

`c.hover` was already dead before this branch — the hover handler dims blades and recolours labels but never renders the string.

Two knives are on screen together between the hero and the opening: they sit 100vh apart, so one leaves the top as the other enters the bottom. That is existing behaviour, but matching the start position to the hero's peek makes it more noticeable. If it reads badly, the fix is a negative top margin on `.opening` plus a fade-in on the incoming knife — worth deciding after seeing it.
