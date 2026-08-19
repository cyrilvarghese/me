---
name: case-study-diagrams
description: Use when creating, editing, recolouring or retiming an animated SVG diagram in a case study (public/assets/*/diagrams), or when a diagram's colours, fonts, speed or looping look wrong on the dark theme
---

# Case-study diagrams

Animated SVG diagrams that argue one point per pain point, told twice —
how it goes today, how it goes on the system. First used on
`/work/creative-os`.

## Where things live

| What | Where |
|---|---|
| Drawings | `public/assets/<Case>/diagrams/<nn>-<side>.svg` |
| Motion | `src/components/case/diagram-motion.css` — one **global** sheet of `@keyframes` |
| Rendering | `<CaseDiagram src="…" />` inlines the file at build time |

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
  they are identity, not decoration. Give them a light disc to sit on
  (`--fg` fill, `rgba(248,244,242,0.28)` hairline) rather than filtering
  them; a filtered logo on the dark ground reads as a smudge. When one
  diagram in a section uses light discs, its partner matches — light disc,
  `--bg` icons — so the pair stays one language.

## Type

Text is the mono voice already (`CaseDiagram.module.css` sets
`var(--font-mono)` and `0.02em` tracking on every `.diagram text`), and
labels keep their own case — `ChatGPT`, not `CHATGPT`.

**Sizes are ratios of the viewBox width, not absolute pixels.** Every file
is scaled to the same panel width, so the same `font-size` renders bigger
in a narrower viewBox. Labels and captions: `0.025 × viewBox width` —
20px at 800, 15px at 600, 13.7px at 548. Text inside a box: `0.030`.

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

**The marker** is a round-capped near-zero dash — a dot riding the line:

```xml
<path class="run" d="…" fill="none" stroke="#ea0000" stroke-linecap="round"
      stroke-width="11" stroke-dasharray="0.01 967.99" />
```

Keep its painted size constant across files:
`stroke-width = 11 × (viewBox width / 548)`.

**Finished states hold.** Once a row fills, a box lights or a tick lands,
it stays until the cycle restarts. Never dim a completed step while later
steps still run — the accumulation is usually the argument.

**Reduced motion** parks every animation in its *finished* state, never
mid-travel.

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

## Common mistakes

| Mistake | Reality |
|---|---|
| Recoloured the markup, called it done | Keyframes animate `fill`/`stroke` too — unmapped ones repaint the old palette the moment anything animates. Grep the motion sheet for source hexes. |
| Mapped the source's one "system" colour to the accent | That colour paints nodes, rings, frames and ticks — the whole diagram turns red. Map it to neutral, then add red back only where it means something. |
| Matched cycle durations to match speed | Different path lengths. Equal durations = unequal speeds. Use the formula. |
| Grayscale alone on logos | Mid-grey on near-black is unreadable. Lift brightness too. |
| Checked the built HTML and trusted it | Colours can be correct in markup and wrong on screen. Screenshot it. |

## Checklist

1. One point, told the same way on both sides?
2. Red only on the moment that matters — markup **and** keyframes?
3. Marker at 246 units/second, constant painted size?
4. Finished state holds long enough to read?
5. Reduced motion lands on the finished state?
6. No inner frame, mono text, neutrals from tokens?
7. Screenshotted, not assumed?
