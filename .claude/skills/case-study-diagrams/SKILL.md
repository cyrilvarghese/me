---
name: case-study-diagrams
description: Use when creating, editing, recolouring or retiming a case-study diagram (public/assets/*/diagrams), when drawing a scene, room, figure or silhouette for one, when building a persona, quote or icon figure from supplied artwork, or when a diagram's colours, fonts, sizes, connectors, speed or looping look wrong on the dark theme
---

# Case-study diagrams

Animated SVG diagrams that argue one point per pain point, told twice —
how it goes today, how it goes on the system. First used on
`/work/creative-os`.

## Where things live

| What | Where |
|---|---|
| Drawings | `public/assets/<Case>/diagrams/<nn>-<side>.svg` |
| Phone telling | the same name plus `-mobile.svg`, passed as `diagramMobile` |
| Scenes | `public/assets/<Case>/diagrams/scenes/<room>.svg` |
| Supplied marks | `public/assets/<Case>/icons/<name>.png` |
| Motion | `src/components/case/diagram-motion.css` — one **global** sheet of `@keyframes` |
| Rendering | `<CaseDiagram src="…" />` inlines the file at build time |
| HTML figures | `CaseVoices` (persona + quotes), `CaseJourney` (stages) |
| Drafting | `/labs` — noindex, never linked, renders candidates through `CaseDiagram` |

**Never render with `<img>`.** An image-loaded SVG is an isolated
document: it cannot see the page's fonts, and every copy carries its own
keyframes. Inline is what makes the mono voice and one shared motion
sheet possible.

**Motion must not be a CSS module** — modules hash `@keyframes` names and
every animation reference silently dies.

## Colour

- **One hue.** Red (`--accent` `#ea0000`) only; everything else is a
  neutral from `tokens.css`.
- **Red marks the moment that matters** — the end of an input ramp, an
  arrow carrying the action, an error mark. Structure (nodes, rails,
  frames, labels) stays neutral. A mostly-red diagram is wrong.
- **Sequential inputs climb in saturation** toward the accent, identically
  on both sides: `#b39a9a` → `#c98080` → `#d95a5a` → `#ea0000`.
- **Third-party marks are the one exception** and keep their brand colour —
  they are identity, not decoration. Back them with the glow below rather
  than filtering them; a filtered logo on the dark ground reads as a
  smudge. When one diagram in a section backlights its marks, its partner
  does too, so the pair stays one language.

## Type

Text is the mono voice already (`CaseDiagram.module.css` sets
`var(--font-mono)` and `0.02em` tracking on every `.diagram text`), and
labels keep their own case — `ChatGPT`, not `CHATGPT`.

**A diagram's text lands on the site's own type ladder** — the ten rungs in
`tokens.css`, shown at true size on `/design`. A standalone SVG cannot read
those custom properties, so the five rungs a diagram uses are restated here
in viewBox units, at 1:1 render:

| Rung | Units at 1:1 | What it sets in a diagram |
|---|---|---|
| `--text-quote` | 20 | a callout the drawing is built around |
| `--text-sublabel` | 15 | the default label — a node, a stage, a person |
| `--text-small` | 14 | a label giving way to a longer neighbour |
| `--text-caption` | 13 | captions under a narrow drawing, phone labels |
| `--text-label` | 12 | captions in a wide drawing, units and ticks — the floor |

**What must hold is the size on screen, not the number in the file.** So
work backwards from where the drawing renders:

```
font-size = rung × (viewBox width / rendered width)
```

Half-panel diagrams in `CaseCompare` (viewBox 560, rendering ~560) and
full-width ones in `CaseFigure` (viewBox 1100, rendering ~1100) both sit
near 1:1, which is why **15 for labels and 12 for captions** goes into most
existing files unchanged — pick a viewBox close to the width the figure
will occupy and the rungs work as written.

A ratio rule does not survive this. `0.025 × viewBox` matches the 560-wide
files by coincidence; applied to a full-width 900-unit diagram it renders
at 27px, nearly double every other label on the page. If the viewBox and
the render width diverge, use the formula.

**A size off the ladder carries its reasoning in the file.**
`01-today-scenes.svg` runs 22 and 20 against a 900-unit viewBox because its
drawings are large and site-sized labels read undersized beneath them
(Cyril's call, 2026-08-20) — the note is at the top of that file. Do not
correct it, and do not read it as precedent: the next diagram starts on
the rungs.

## Every diagram is drawn twice

**A wide diagram needs a phone telling, and it is part of the job — not a
follow-up.** Name it `<same-name>-mobile.svg` beside the original and pass
it as `CaseFigure`'s `diagramMobile`. Without one the figure holds a 48rem
floor and scrolls sideways inside its own box, which means the reader
swipes to see half an argument.

**Rebuild the arrangement; never shrink the wide one, and never simply
drop its columns.** Three panels side by side get ~126px each on a 420px
screen and stop reading. But stacking in source order is the subtler
failure: whatever the wide arrangement was *saying* usually dies in it.
Two people either side of one object say "used from both sides"; the same
two stacked say "here is a list of two people".

Ask what the geometry is arguing, then find the arrangement that still
argues it at this width. Three moves cover most of it:

- **Rotate the axis.** Two users either side of an object become one above
  it and one below, and the rails turn vertical. Left-and-right becomes
  above-and-below with the point intact.
- **Rank by size.** Where the wide figure used *position* to say which
  element matters, a column cannot — so let scale say it instead. The two
  rooms being counted go small and keep only their names; the room the
  case study is about runs at twice their width and keeps its full
  caption. Equal panels in a column claim the elements are equal, which is
  usually the opposite of the argument.
- **Substitute the drawing.** Sometimes the wide figure needs width to
  mean anything — a ring of marks, two columns of quotes — and a different
  drawing makes the same claim in a fraction of the height. Swap the whole
  thing rather than rearranging it: `CaseObject` hands over to a block
  diagram below its breakpoint.

Two things usually change with the arrangement:

- **Rails follow the new geometry, or change form.** If the relayout keeps
  something to point at, re-aim them — a diagonal rail becomes a vertical
  one. If the run is now too short for the dotted rail (under ~60px, where
  the house dash period paints a single pill), **switch to a solid line
  with an arrowhead** rather than dropping the connection: a drawn line
  does the same job at any length, which is what the stage arrows inside
  `01-cases` are. Drop rails only when there is genuinely nothing left to
  point at — then stacking order carries the sequence instead.
- **Type returns to the rungs** — `--text-sublabel` (15) for labels,
  `--text-caption` (13) for captions, measured at the width the phone
  telling actually renders. A wide file may run larger because its
  drawings are large; that reasoning does not survive the change of
  arrangement.

The cost is real: a scene now lives in the standalone file, the wide
composition and the narrow one. Edit all three in the same commit.

## Motion

**Speed is fixed at 246 units/second** (set by diagram 01: 2,954 units in
12s). Speed is distance per second, *not* cycle length, so solve for the
travel's share of the cycle:

```
travel fraction = path length / (246 × cycle seconds)
```

A 400-unit run on an 8s cycle travels 20.3% of it; a 968-unit loop, 49.2%.
New diagrams use an 8s cycle; the remainder is the hold.

**The pattern:** a path is dotted (`stroke-dasharray="2 14"`) until the
work reaches it, a marker runs it, and a second copy of the path
(`pathLength="100"`, `stroke-dasharray="100 100"`) fills in behind.

**The traveller** is a short round-capped dash — spread out, because a
flat mark implies motion where a fat dot just sits (Cyril's rule,
2026-08-19; the 02-canvas runner is the reference):

```xml
<path class="run" d="…" fill="none" stroke="#ea0000" stroke-linecap="round"
      stroke-width="3.4" stroke-dasharray="9.6 958.4" />
```

Painted ≈ 13 long × 3.4 thick at a 548-unit viewBox — scale both by
`(viewBox width / 548)`. In HTML, a 13×3.4px rounded div. The older
near-zero-dash dot (width 11) survives in legacy diagrams; new work
uses the dash.

**Finished states hold.** Once a row fills, a box lights or a tick lands,
it stays until the cycle restarts. Never dim a completed step while later
steps still run — the accumulation is usually the argument.

**Reduced motion** parks every animation in its *finished* state, never
mid-travel.

## House geometry (measured from the CreativeOS set)

Values are viewBox units at ~600-unit panel width — scale by ratio for
other widths, and use them as raw px when a React component (e.g.
`CaseJourney`) speaks the same language in HTML/CSS.

| Element | Spec |
|---|---|
| Base rail | width 3, `stroke-dasharray "2 14"`, round caps, `rgba(248,244,242,0.28)`; secondary ground `0.14` |
| Fill trail | width 3.5, second copy of the path (`pathLength="100"`, `stroke-dasharray "100 100"`), drawn behind the traveller |
| Quiet/return path | width 2.5, `#9e9493` |
| Node | r 5.5, ring stroke 2, `--surface` (`#1e1818`) fill until lit |
| Node, lit | the **fill** takes the ring's colour and holds it; arrival pops `scale(1.5)` and settles ~240ms (attack 0.2% of the 12s cycle, decay ~1.7%); `transform-box: fill-box; transform-origin: center` |
| Arrival ping | a second stroke-only copy of the node behind it: `scale(0.8 → 2.6)`, `opacity 0.9 → 0`, ~240ms (2% of cycle), once per activation |
| Traveller | red dash: 9.6 long, width 3.4, round caps (~13×3.4 painted) — flat implies motion; never a fat dot |
| Cycle | 12s, linear, infinite |
| Sequential rows | one `linearGradient` in `userSpaceOnUse` with stops on the ramp (`#b39a9a → #c98080 → #d95a5a → #ea0000`) rather than per-segment colours |

The dotted ground's mark is a **round-capped dash, not a circle**:
"2 14" at width 3 paints a 5×3 pill. In HTML, draw it with an inline
SVG `<line>` (`x2="100%"`) carrying the same dash attributes — a CSS
gradient imitation rasterizes square at this size and reads off-spec.

The centreline is sacred: rails, trails, markers and nodes all register
on one shared y — in CSS, one custom property (`--rail-y`) that every
layer derives from, never four hand-matched offsets.

## Composition

- **No inner frames.** The panel title already names the side ("Today —
  …" / "With CreativeOS"); a second bordered box repeating it is
  redundant. Crop the viewBox to the drawing instead.
- **Nodes are three layers**, sized as ratios of the viewBox width so they
  paint identically across files: a halo (`0.05 × vb`, `--surface` fill,
  `rgba(248,244,242,0.14)` hairline, plus a `#eee8e622` tint), a ring
  (`0.0325 × vb`, `--surface` fill, `#eee8e6` stroke at `0.005 × vb`), and
  a centre dot (`0.01 × vb`). A red centre marks the flawed one.
- Both sides share one visual language, so the difference the reader sees
  is the argument, not the styling.

## Scenes (a room instead of a block)

Some arguments land better drawn than named — the three rooms a student
learns in, rather than three labelled rectangles. A scene is still a
diagram and still obeys everything above; it adds a figure vocabulary and
nothing else. Draft candidates on `/labs`, a noindex route that renders
them through `CaseDiagram` so they inherit the real inlining, the mono
voice and the one motion sheet.

**Flat fills, never outlines.** Depth is a value step — the same logic as
`TOOL_BACK`/`TOOL_FRONT` separating overlapping knife shapes. Hand-wobbled
strokes look charming at 800px and turn to mud at panel width.

| Role | Fill |
|---|---|
| The subject — whoever the drawing is about | `--fg` `#e7e3e1` |
| Near figures | `--muted` `#9e9493` |
| Far figures, receding rows | `#f8f4f2` at `.20`–`.34` |
| Planes — floors, desks, beds, benches | `--surface` + a `.20` hairline |
| **The object that needs attention** | `#c98080` — ramp step 2 |
| The moment that matters | `--accent` `#ea0000` |

**The object that needs attention takes a tinge, not the accent.**
`#c98080` is the ramp's second stop, so the tint reads as the existing
one-hue language rather than a new colour. Step 1 (`#b39a9a`) is invisible
on this ground — warm grey among neutrals, saying nothing. Tint the
objects, never the people: a panel whose mass is mostly tinted stops
saying "this is the thing to look at" and starts saying "this scene is the
loud one".

**The accent must outrank the tint on two channels, not one.** Saturation
alone fails at panel width — a tinted patient head at r9 beside a red
contact dot at r7 gives two similar dots and the eye picks the wrong one.
The accent mark is the largest *and* the most saturated thing in frame.

**Bands must not share vertical space.** Write the boundary as a number
and state it in a comment: the stage ends at y116, the nearest head starts
at y122. Positioned by eye against neighbours instead, lectern legs come
out of a student's skull.

**Negative space between limbs is authored, never emergent.** Two thick
round-capped strokes meeting at an elbow *cannot* hold a gap at this
scale — the triangle's incircle radius comes out smaller than the stroke
half-width, so the hole closes and the pose dies. Draw the limb as one
closed path whose outline traces the notch.

**Keep figures simple.** A head circle plus a shoulder dome
(`M cx-hw,base a hw,hh 0 0 1 2hw,0 z`) is the reusable person-mark — use
it at every scale, from a lecture row to a single seated student. A posed
figure reads as a puzzle at this size and pulls attention off whatever
actually argues the point.

**Composing scenes into a figure.** Panels drop into a layout as
`<g transform="translate(x y) scale(s)">` wrapped around a copy of the
scene's markup. That copy is a maintenance trap: every edit must be made
in both the standalone scene and each composed diagram, and nothing
catches a divergence. Change them in the same commit, every time.

## Supplied marks (a face instead of a drawing)

Sometimes the reader recognises a mark faster than any drawing earns —
a persona beside what they said, a product logo beside the step it owns.
`CaseVoices` is the worked example: quotes fanned around a persona icon.

**Supplied artwork keeps its own colours and sits on a backlight** — the
icon unfiltered, over a glow that falls off to nothing. This is the same
exception the third-party marks take, for the same reason: flat clip-art
is drawn with black outlines that vanish on this ground, and a filter over
them reads as a smudge rather than a mark.

It used to be a solid `--fg` disc. A plate does lift the artwork, but it
cuts a hole in the page for every mark, and a row of them reads as a row
of holes rather than a row of marks (Cyril's call, 2026-08-21). The glow
does the lifting without drawing an edge anywhere:

```
radial-gradient(closest-side,
  rgba(248,244,242,.075) 0%,  rgba(248,244,242,.052) 25%,
  rgba(248,244,242,.030) 45%, rgba(248,244,242,.014) 65%,
  rgba(248,244,242,.005) 82%, rgba(248,244,242,0)   100%)
```

**Five stops, not two.** A straight ramp to zero changes opacity at a
constant rate and the eye reads that constant rate as a boundary — the
hard edge the plate was supposed to have lost. The tail is what removes
it. Spread it to about twice the mark's box; in HTML let it overflow the
box (`inset: -50%` on a pseudo-element) so no layout has to move for it,
and keep the mark above it or the glow paints over what it is behind.

**Build the figure in HTML when its text has to wrap.** Two- and
three-line quotes cannot be hand-broken in `<text>` without eventually
clipping off the viewBox. Lay it out in HTML and keep the rails as inline
SVG so their dash still paints the round-capped pill; the sizes come from
`--text-small` and `--text-label`, which is what makes an HTML figure and
an SVG one read as the same voice.

**A rail points; it does not decorate.** Use a straight ray out from the
mark toward the thing it connects, never an arc — an arc curls away from
whatever it is aimed at. Let the angle follow the geometry: two items on
a side fan to about ±32°, a single item sits level and its ray runs
straight out.

**Spacing and connectors are one problem.** A ray needs somewhere to
arrive, so the gap it crosses has to stay close to its reach. Widen the
column for more air and the rail stops in open space, which reads worse
than no rail. Widen the gap *between* stacked items instead — that is
where the whitespace belongs.

**Emphasis inside body-size text is a value step, not red text.** Red
fails AA at this size on this ground. Brighten the clause to `--fg`
against a `--muted` quote and put the accent in a `text-decoration`
underline beneath it, which keeps red decorative and is what an
underlining source deck meant anyway.

## Common mistakes

| Mistake | Reality |
|---|---|
| Recoloured the markup, called it done | Keyframes animate `fill`/`stroke` too — unmapped ones repaint the old palette the moment anything animates. Grep the motion sheet for source hexes. |
| Mapped the source's one "system" colour to the accent | That colour paints nodes, rings, frames and ticks — the whole diagram turns red. Map it to neutral, then add red back only where it means something. |
| Matched cycle durations to match speed | Different path lengths. Equal durations = unequal speeds. Use the formula. |
| Grayscale alone on logos | Mid-grey on near-black is unreadable. Lift brightness too. |
| Checked the built HTML and trusted it | Colours can be correct in markup and wrong on screen. Screenshot it. |
| Drew a figure with strokes so it would feel hand-made | At panel width the strokes merge into a blob. Flat fills, separated by value. |
| Posed a figure to show what it is doing | A pose is a puzzle at this size. Use the plain person-mark and let the props carry the meaning. |
| Positioned each element against its neighbours | Overlaps between separately-placed shapes are invisible in markup and obvious on screen. Declare band boundaries as numbers. |
| Edited the scene file and shipped | Every composed diagram carries its own copy of that markup. Edit both in one commit. |
| Sized diagram text as a ratio of the viewBox | The ratio only matches when viewBox ≈ rendered width. Solve for the target px instead, and check it against the type it sits beside. |
| Sized an HTML figure by eye | The ladder in `tokens.css` is the same set of sizes a diagram's text renders at. Use the tokens and the two voices match for free. |
| Invented a size between two rungs | Ten rungs cover the page. If the drawing really needs a size off them, write why at the top of the file — an unexplained number becomes the next file's precedent. |
| An `svg` in HTML came out smaller than its CSS width | `globals.css` caps every svg at `max-width:100%`. Anything wider than its container needs `max-width: none`. |
| Drew a short rail and it vanished | The house dash period is ~16px. A rail under ~60px paints one pill and reads as a speck. Lengthen it, or draw it solid with an arrowhead — not every connector has to be the dotted rail. |
| Curved a connector to make it feel drawn | An arc curls away from what it points at. A connector is a straight ray; curvature is for haloes, not pointers. |
| Emphasised a clause in red inside body text | Red is large-type only here. Brighten the clause and put the accent in the underline. |
| Filtered a supplied icon to fit the palette | Black outlines on this ground become a smudge. Backlight it, colours untouched — the third-party exception. |
| Backed a mark with a two-stop gradient | A straight ramp to zero changes opacity at a constant rate and the eye reads that rate as an edge — the thing the plate was dropped for. Five stops with a long tail. |
| Shipped a wide diagram with no phone telling | The reader swipes to see half the argument. Lay it out again at 420px; it is part of the job, not a follow-up. |
| Made the mobile version by shrinking the wide one | Three panels side by side give ~126px each on a phone. Rebuild the arrangement. |
| Made it by dropping the columns into a stack | Whatever the geometry argued dies in the stack. Ask what it was saying, then rotate the axis, rank by size, or substitute the drawing. |
| Stacked the panels at equal size | Equal panels claim the elements matter equally. Small for what is being counted, large for what the study is about. |
| An `svg` came out letterboxed at a fraction of its width | `preserveAspectRatio` defaults to `meet`. Either size the box to match the viewBox, or give each part its own box. |

## Checklist

1. One point, told the same way on both sides?
2. Red only on the moment that matters — markup **and** keyframes?
3. Traveller at 246 units/second — the flat dash, constant painted size?
4. Finished state holds long enough to read?
5. Reduced motion lands on the finished state?
6. No inner frame, mono text, neutrals from tokens, every `font-size` on a
   rung — or a note in the file saying why not?
7. Screenshotted, not assumed?
8. Scenes: flat fills, the tinge only on the object that needs attention,
   and the accent still the largest and most saturated mark?
9. Scenes: edited in the standalone file **and** every composed copy?
10. Supplied marks: on a backlight rather than a plate, unfiltered, with
    rails that point at something and a gap they can actually cross?
11. Drawn twice — laid out again for the width, not the wide one shrunk or
    its columns dropped, and screenshotted at 420px? Does the narrow
    version still argue what the wide one argued?
