# Knife Art Generation Pack

How to produce the final raster knife layers with an image model (GPT-image,
Nano Banana, Midjourney + cleanup). The placeholder SVG art in
`src/components/knife/placeholders/` is the composition reference — the raster
set must match its geometry exactly, or the unfold animation breaks.

## Canvas contract (non-negotiable)

| Property | Value |
|---|---|
| Canvas | 2048 × 2048 px, transparent background, every layer identical |
| Hinge (shared pivot) | x = 1034, y = 1290 (50.5%, 63%) |
| Knife body span | x 287–1167, y 1157–1423 (rounded slab, r ≈ 133) |
| Front scale span | x 307–1147, y 1182–1399 (slightly inset slab) |
| Tools | Drawn **closed**, pointing **left** from the hinge, tips reaching ≈ x 330 |
| Export | WebP (quality ~85) at 1000 / 1500 / 2000 px widths |

Files expected by the site (drop into `public/assets/knife/`):

```
body.webp          front-scale.webp
research.webp      product.webp       design.webp
code.webp          ai.webp            gtm.webp
```

Then set `ART_MODE = "raster"` in `src/components/knife/art.ts`. Nothing else changes.

## Global style block (prepend to every prompt)

> Premium industrial product illustration of a single pocket-knife part,
> editorial diagram style, flat vector-like rendering with subtle metallic
> gradients. Near-black graphite metal (#1a1a1a) with crisp signal-red
> (#ea0000) accent edges. Side view, perfectly horizontal, centered
> composition. Pure transparent background. No text, no watermark, no logo,
> no shadow on the ground, soft internal shading only. Studio lighting from
> upper left, restrained, sophisticated, Swiss design language.

Consistency trick: generate `body.webp` first, then attach the body image as a
style reference for the seven remaining generations so metal tone and lighting
match across layers.

## Per-layer prompts

**body** — the back slab:
> [style block] A single elongated rounded-rectangle knife body slab, like a
> Swiss pocket knife seen exactly from the side, spanning the middle-left of
> the frame. Slightly rounded ends, near-black graphite, a faint white edge
> highlight along the top, plain surface with no pins and no markings.

**front-scale** — the outer face (drawn slightly smaller than body):
> [style block] The front scale of a pocket knife: a slightly smaller rounded
> slab that sits over the body, near-black graphite with a fine white top
> edge highlight and a thin red hairline along the lower edge. Two metal
> pins: a small plain pin near the left end, and a larger pivot pin with a
> bright red ring near the right end. A small monogram "CV" in red just to
> the left of that pivot pin, embossed — lit along its upper-left edges and
> shadowed along its lower-right, as if raised out of the scale. (This is
> the only layer allowed to carry text.)

**research** — magnifier blade (hidden behind body when closed):
> [style block] A slim magnifying-lens tool folded flat: a thin graphite arm
> extending left, ending in a circular lens ring with a red inner rim. Drawn
> horizontal, pivot end at the right.

**product** — compass/reamer spike:
> [style block] A tapered reamer spike tool folded flat: a slender graphite
> spike narrowing to a red-tipped point at the left, with a small crossbar
> detail near the point. Pivot end at the right.

**design** — pen nib blade:
> [style block] A pen-nib tool folded flat: a graphite arm ending in a
> fountain-pen nib with a center slit and breather hole, nib tip accented in
> red at the far left. Pivot end at the right.

**code** — main blade:
> [style block] The main knife blade folded flat: classic clip-point profile,
> straight spine along the top with a fine white highlight, cutting edge
> running diagonally with a thin signal-red edge line, subtle etched "</>"
> mark near the tip. Pivot end at the right.

**ai** — awl with spark:
> [style block] A thin awl spike folded flat, and at its left tip a four-point
> star spark in deep red (#c90000), like a glint of light rendered as a solid
> shape. Pivot end at the right.

**gtm** — corkscrew:
> [style block] A corkscrew tool folded flat: a graphite shaft extending left
> that transitions into a coiled helix, the final coil tail accented in deep
> red. Pivot end at the right.

## Post-processing checklist (Figma / Photoshop)

1. Import all 8 generations onto a 2048×2048 frame each.
2. Underlay the placeholder reference: run the site, screenshot the open-pose
   harness (`KnifeCanvas` with spec angles), or export each placeholder SVG —
   scale/position every generated part until it covers its placeholder.
3. Verify the pivot: every tool's hinge hole must sit at (1034, 1290).
   Rotate each tool layer ±40° around that point in the editor — nothing
   should visibly "swim" off the pin.
4. Verify the sandwich: with all layers stacked closed, only body,
   front-scale, and thin tool spines should be visible. Tool heads (lens,
   star, coils) must be fully inside the front-scale silhouette.
5. Knock out backgrounds to true transparency (no white halo — matte on #111).
6. Export each layer at 2000 / 1500 / 1000 widths as WebP q85; the site
   currently loads the base name (e.g. `research.webp`) — use the 2000px
   export there.
7. Drop into `public/assets/knife/`, flip `ART_MODE` to `"raster"` in
   `src/components/knife/art.ts`, and eyeball the four knife scenes:
   hero (closed), story (unfold), transition (dissolve), final (fold).
