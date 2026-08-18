# Case-study diagram guidelines

Rules for the animated SVG diagrams inside case studies (first used on
`/work/creative-os`). Any new diagram of this sort follows all of them.

## 1. Where the files live

- Drawings: `public/assets/<Case>/diagrams/<nn>-<side>.svg`, numbered by the
  pain point they argue (`01-today.svg`, `01-creativeos.svg`, …).
- Motion: `src/components/case/diagram-motion.css` — one **global**
  stylesheet holding every `@keyframes`. It must not be a CSS module:
  modules hash keyframe names and every animation reference breaks.
- Rendering: `<CaseDiagram src="…" />` inlines the file at build time.
  Never `<img>` — an image-loaded SVG is an isolated document, so it cannot
  see the page's fonts and each copy would carry its own keyframes.

## 2. Colour

- **One hue.** Red (`--accent`, `#ea0000`) is the only colour; everything
  else is a neutral from `tokens.css` (`--fg`, `--fg-soft`, `--muted`,
  `--surface`, plus `rgba(248,244,242,…)` for rules and halos).
- **Red marks the moment that matters**, never the whole happy path:
  the end of an input ramp, an arrow carrying the action, an error mark.
  Structure — nodes, frames, rails, labels — stays neutral. If a diagram
  reads as mostly red, it is wrong.
- **Sequential inputs climb in saturation** toward the accent, the same
  ramp on both sides of a comparison:
  `#b39a9a` → `#c98080` → `#d95a5a` → `#ea0000`.
- **Third-party marks are desaturated** (`grayscale(1) brightness(2.1)`)
  so they read as shapes without introducing hues.
- Watch the keyframes: several animate `fill`/`stroke`, so a colour change
  is not done until the motion sheet is remapped too.

## 3. Type

- All diagram text is the mono voice (`var(--font-mono)`, `0.02em`
  tracking), inherited from `CaseDiagram.module.css`. Sizes stay as drawn.
- Labels keep their own case (`ChatGPT`, not `CHATGPT`).

## 4. Motion

- **Speed is fixed at 246 units per second** — set by diagram 01 (2,954
  units in 12s). Speed means distance per second, not cycle length, so
  every travelling marker solves for its share of the cycle:

  ```
  travel fraction = path length / (246 × cycle seconds)
  ```

  A 400-unit run on an 8s cycle travels for 20.3% of it; a 968-unit loop
  for 49.2%.
- **Cycle**: 8s for new diagrams (12s where a diagram has three sequential
  rows). Whatever is left after the travel is the hold.
- **Finished states hold.** Once something completes — a row fills, a box
  lights, a tick lands — it stays until the cycle restarts. Never dim a
  completed step while later steps are still running; the accumulation is
  usually the argument.
- **The marker and its trail**: a path is dotted (`stroke-dasharray="2 14"`)
  until the work reaches it, a travelling marker runs it, and a second copy
  of the path (`pathLength="100"`, `stroke-dasharray="100 100"`) fills in
  behind. The marker is a round-capped near-zero dash
  (`stroke-dasharray="0.01 <gap>"`, `stroke-linecap="round"`) so it reads as
  a dot riding the line.
- **Marker size is constant on screen**, so scale the stroke to the file's
  viewBox: `stroke-width = 11 × (viewBox width / 548)`.
- **Reduced motion**: every diagram carries
  `@media (prefers-reduced-motion: reduce)` that stops the animations and
  parks them in their finished state — never mid-travel.

## 5. Composition

- **No inner frames.** The comparison panel already names the side
  ("Today — …" / "With CreativeOS"); a second bordered box repeating the
  name is redundant. Crop the viewBox to the drawing instead.
- Nodes are a dark disc with a neutral ring (`r≈30`) and a small centre dot;
  red centre marks the flawed one.
- Labels sit outside their node, captions below the drawing in `--muted`.
- Keep the two sides of a comparison in the same visual language — same
  node shape, same ramp, same motion — so the difference the reader sees is
  the argument, not the styling.

## 6. Checklist for a new diagram

1. Does it argue one point, told the same way on both sides?
2. Is red only on the moment that matters?
3. Does the marker move at 246 units/second?
4. Does the finished state hold long enough to read?
5. Does reduced motion land on the finished state?
6. No inner frame, mono text, neutrals from tokens?
