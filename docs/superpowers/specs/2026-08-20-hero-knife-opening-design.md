# Knife opening — design

Date: 2026-08-20
Status: approved for planning

## Problem

The knife story section is 600vh. That length exists because six narrative
panels each needed a reading beat, not because the unfold needs the travel.

## Intent

Replace the story with a plain transition: the knife arrives from the hero,
comes to the middle, zooms up so it has the stage, then fans open one blade at
a time with labels — and hands to the lineup exactly as it does today.

## Scope

**Hero is untouched.** **`OutcomeTransition` is untouched.** The only thing
that changes is the section between them, which stops being a story and becomes
a transition (user direction, 2026-08-20).

Deferred: the six `statement` / `tags` blocks, the intro line and the closing
"One person. Multiple points of leverage." lose their only consumer. Cyril is
reworking the narrative separately. This change leaves the `capabilities` data
fields intact and writes no replacement copy.

## The section

`KnifeStory` becomes `KnifeOpening`: 200vh instead of 600vh, a `position: sticky`
100vh stage, no narrative column, no closing statement — just the knife.

One scrubbed timeline with a `duration: 1` spacer, so tween positions are the
scroll fractions:

| Position | Driver | Beat |
| --- | --- | --- |
| 0.05 – 0.42 | scrub | Knife travels to centre, straightens, grows to the stage box |
| 0.42 | **time** | Six blades fan open, staggered, labels behind each tip |
| 0.42 – 0.90 | scrub | Hold — the slot the reworked narrative will occupy |
| 0.90 – 1.00 | scrub | Crossfade into `OutcomeTransition`'s knife |

### Starting position

The knife starts where the hero's knife sits — `right: 3vw`, vertically
centred, `min(44vw, 640px)`, tilted `-14deg` — so the arrival reads as the same
object rather than a new one. This is the in-place swap the story section
already relied on, tightened to match the hero's peek exactly.

**Known characteristic, unchanged from today:** the hero and the opening are
adjacent 100vh boxes, so their knives are always 100vh apart. One exits the top
of the viewport as the other enters from the bottom; they never overlap. If
that reads as two knives on screen, the fix is to overlap the sections with a
negative margin and fade the incoming knife in — but that is a change to make
after seeing it, not before.

### Measurement

Position maths uses `offsetLeft` / `offsetTop` / `offsetWidth`, not
`getBoundingClientRect()`. The knife starts tilted, and a rotated element's
bounding rect is its axis-aligned box — wider than the element. Offset values
are layout values, immune to transforms, so the arithmetic stays correct at
every angle and needs none of the "subtract the current transform back out"
correction the story section carried.

### Landing

```
targetW = min(0.58 * innerHeight, 0.54 * innerWidth, 660)
x       = stage.clientWidth / 2  - box().cx + 0.135 * targetW
y       = stage.clientHeight / 2 - box().cy
scale   = targetW / box().w
rotation = 0
```

`targetW` is the same expression as `OutcomeTransition`'s `.inner` width,
`min(58vh, 54vw, 660px)`, so the two knives land congruent. The
`0.135 * targetW` right-shift is kept: the art is left-biased in its box, and
`OutcomeTransition` already opens by sliding that same offset back to zero.
Holding it is what lets that section stay untouched.

### The fan

Time-based, not scrubbed. A `paused` timeline is `restart()`ed from `onUpdate`
when progress crosses the landing threshold, and re-armed below a lower
threshold — the same pattern as the story's `wobble` and the compass's needle
`swing`. Stagger ≈0.10s, blade ≈0.75s with an overshoot-and-settle ease, each
label ≈0.22s behind its own blade. `immediateRender: false` on every `fromTo`,
or the "from" pose renders at build time and the knife starts open.

### Handoff

Kept verbatim from the story section, only `range()` changes because the
section is shorter — and `range()` is already a lazy function. Over the last
0.10 of the timeline the incoming knife fades in, the outgoing one fades out,
and a `fromTo(y: -0.10 * range() → 0)` cancels the not-yet-pinned stage's rise.

## Files

| File | Change |
| --- | --- |
| `src/components/knife/KnifeStory.tsx` → `KnifeOpening.tsx` | Narrative stripped, timeline rewritten, 600vh → 200vh |
| `src/components/knife/knife-story.module.css` → `knife-opening.module.css` | Panel and grid rules dropped |
| `src/lib/data/scroll.ts` | Six windows → the opening's beats |
| `src/lib/data/data.test.ts` | `scroll windows` block replaced |
| `src/app/page.tsx` | The renamed import |
| `Hero.tsx`, `Hero.module.css` | **Nothing** |
| `OutcomeTransition.tsx`, `.module.css` | **Nothing** — stale comment text only |

Carried over unchanged: the orbit labels, the §39 hover-dim, the reduced-motion
static-and-open pose, and the compact rules (angles ×0.8, labels hidden).

## Verification

`npm run check`, `npm test`, `npm run build`, then `scroll-shots.mjs` across the
opening — arrival, mid-travel, landed, fanned, and both sides of the crossfade —
plus a full-page walk to confirm the lineup is untouched and the page is ~400vh
shorter.

## Risks

- **Two knives crossing.** Described above. Existing behaviour, but tightening
  the start position to match the hero makes it more noticeable, not less.
- **A dead hold.** With the narrative deferred, 0.42–0.90 is ~50vh where nothing
  changes. Shortening it is a one-line change in `scroll.ts`.
