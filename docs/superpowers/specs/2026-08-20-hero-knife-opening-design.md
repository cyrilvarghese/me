# Hero knife opening — design

Date: 2026-08-20
Status: approved for planning

## Problem

The knife story section is too long. `KnifeStory` runs 600vh of pinned scrub to
do one thing the visitor understands in a few seconds: the knife opens. Six
scroll windows exist because six narrative panels each needed a reading beat,
not because the unfold needs that much travel.

## Intent

The knife in the hero comes down, takes the stage, opens one blade at a time
with natural motion and labels, then hands to the existing lineup. Every one of
those beats already exists on the page — they are spread across three sections.
Remove the middle section and stitch the rest.

## Scope

Removed: `KnifeStory` and everything that served only it.

Unchanged: `OutcomeTransition` — the lineup, circles, compass, needle hunt, snap
beats and `DUR` all stay exactly as they are (user direction, 2026-08-20).

Deferred: the six `statement` / `tags` blocks, the intro line and the closing
"One person. Multiple points of leverage." lose their only consumer when
`KnifeStory` goes. Cyril is reworking the narrative separately. This change
leaves the `capabilities` data fields intact and writes no replacement copy.

## The opening sequence

The Hero becomes a 200vh section over a `position: sticky` 100vh stage — the
same construction `KnifeStory` used, not a GSAP `pin`. One timeline,
`scrub: 0.4`, `trigger: .hero`, `start: "top top"`, `end: "bottom bottom"`, with
a `duration: 1` spacer tween so tween positions read as scroll fractions.

| Position | Driver | Beat |
| --- | --- | --- |
| 0.00 – 0.18 | scrub | Hero copy rises and fades out. The stage clears. |
| 0.06 – 0.40 | scrub | Knife travels from its peek spot to the landing pose: centred, upright, scaled to the stage box. |
| 0.40 | **time** | Six blades open in `capabilities` order, staggered. Each label fades in behind its blade tip. |
| 0.40 – ~0.90 | scrub | Hold. This is the slot the reworked narrative will occupy. |
| ~0.90 – 1.00 | scrub | Crossfade into `OutcomeTransition`'s knife. |

### Travel and landing

The landing pose is a verbatim lift of `KnifeStory.tsx:145-166`:

```
targetW = min(0.58 * innerHeight, 0.54 * innerWidth, 660)
x       = stageCentreX - knifeBox().x + 0.135 * targetW
y       = stageHeight / 2 - knifeBox().yInStage
scale   = targetW / knifeBox().w
```

The `0.135 * targetW` right-shift is **kept**. The knife art is left-biased in
its box, so this lands the art's visual centre on stage centre — and
`OutcomeTransition` already opens with
`fromTo("[data-knife-el]", { x: 0.135 * S() }, { x: 0 })` to match it. Holding
the offset is what lets `OutcomeTransition` stay untouched.

`targetW` is the same expression as `.inner`'s `width: min(58vh, 54vw, 660px)`,
so the two knives land congruent by construction.

All position values stay lazy functions evaluated against
`getBoundingClientRect()`, so resize and mid-page reload stay correct. Rotation
goes -14° → 0°; the peek tilt moves out of the CSS `transform` and onto GSAP so
the two do not fight.

### The staggered open

Time-based, not scrubbed — natural motion is the point, and a scrub makes easing
read as the user's hand rather than the object's mass.

A `paused` timeline is `restart()`ed from `onUpdate` when progress crosses the
landing threshold, and re-armed when progress falls back below it. This is the
pattern already used twice in this codebase: `KnifeStory`'s `wobble` and
`OutcomeTransition`'s needle `swing`.

- stagger step ≈ 0.10s, `capabilities` order
- per blade `fromTo(0 → openAngle * factor)`, ≈0.75s, overshoot-and-settle easing
- `immediateRender: false` on every `fromTo` — otherwise the "from" pose renders
  at build time and the knife starts open (learned at `KnifeStory.tsx:76-78`)
- label fades in ≈0.22s after its own blade starts
- `factor = 0.8` on compact, per the existing mobile rule

### Handoff

Unchanged in mechanism from `KnifeStory.tsx:179-195`, retargeted to the Hero's
scroll range. Over a crossfade window `W` at the end of the timeline:

- `[data-knife-el]` fades in, the hero knife fades out
- the morph stage has not pinned yet during `W`, so its knife rises by
  `W * range()` where `range() = hero.offsetHeight - innerHeight`; a
  `fromTo(y: -W * range() → 0)` cancels that rise exactly, both being linear in
  scroll

`OutcomeTransition`'s `margin-top: -100vh` needs no edit — a negative top margin
pulls against whatever precedes it in flow. A 200vh hero replaces a 600vh story
and the overlap behaves identically.

`.knifeEl` is already `opacity: 0` under `prefers-reduced-motion: no-preference`,
so the morph knife stays hidden until the crossfade lights it.

## Files

| File | Change |
| --- | --- |
| `src/components/sections/Hero.tsx` | Rewritten as the pinned opening stage; owns the timeline |
| `src/components/sections/Hero.module.css` | 200vh section + sticky stage; reduced-motion and compact rules |
| `src/components/knife/KnifeStory.tsx` | Deleted |
| `src/components/knife/knife-story.module.css` | Deleted |
| `src/components/knife/ToolLabels.tsx` | Imports relocated label styles |
| `src/components/knife/knife.module.css` | Gains the `labels` / `label` / `labelVisible` rules |
| `src/app/page.tsx` | Drops the `KnifeStory` import and element |
| `src/lib/data/scroll.ts` | Six scroll windows replaced by the opener's beats and stagger |
| `src/lib/data/data.test.ts` | `scroll windows` block replaced by the new invariants |
| `src/components/sections/OutcomeTransition.tsx` | Two stale comments naming `KnifeStory.tsx` retargeted. No code change. |

## Carried over from KnifeStory

- **Hover-dim (§39).** Desktop only, armed once the open completes: hovering a
  blade dims the others to 0.55 and lifts that label to full white. Moves into
  the Hero.
- **Reduced motion.** `KnifeStory` was where reduced-motion users saw an open
  knife. The Hero takes that over: `reducedPose="open"`, no timeline, labels
  shown, static layout.
- **Compact.** Angles ×0.8, labels hidden at ≤768px.

## Scroll math module

`scroll.ts`'s six contiguous 0.13 windows described `KnifeStory` and nothing
else. It becomes the opener's numbers — copy-out end, travel window, landing
threshold, stagger step, crossfade window — so the choreography still reads from
data rather than from magic numbers inside the component, matching how
`capabilities.ts` drives the rest.

`data.test.ts`'s `scroll windows` block is replaced with tests that lock the new
invariants: beats are ordered and within 0..1, the landing threshold sits after
the travel window, and the stagger produces six monotonically increasing delays
in `capabilities` order.

## Verification

- `npm run check` and `npm test` clean
- `node scripts/scroll-shots.mjs` across the hero's range: copy out, mid-travel,
  landed-and-closed, fully open with labels, and the crossfade frame
- The seam is checked by screenshotting either side of the crossfade and
  confirming the knife does not jump
- Reduced-motion and ≤768px checked separately

## Risks

- **Pin-on-pin overlap.** Two sticky stages whose ranges intersect by 100vh.
  This works today between story and transition, so it is a retarget rather than
  a new problem — but it is where debugging time is most likely to go.
- **A dead hold.** With the narrative copy deferred, the 0.40–0.90 hold is ~50vh
  where nothing changes. Keep the hold short until the narrative lands; the beat
  positions are tunable in `scroll.ts`.
- **First-paint pose.** The hero knife must render closed and untilted-by-GSAP
  on the server. Any mismatch between the CSS peek transform and GSAP's initial
  `set` shows as a flash on load.
