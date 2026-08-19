---
name: auditing-typography
description: Use when type looks bright, heavy, harsh, or unrefined on a dark background; when choosing heading line-height, uppercase letter-spacing, font weight, or numeral style; when a design review mentions typography, leading, tracking, or "it feels off but I can't say why"; or before shipping a change to type tokens.
---

# Auditing Typography

## Overview

Most "unrefined" type is not a font choice. It is a handful of measurable
defaults left where a tool put them. Each one below is a number you can
grep for and a number you can change.

**Core principle: contrast ratio and font weight are floors, not targets.**
Passing WCAG says nothing about whether type is comfortable — automated
checkers will never flag the defects in this skill.

## Quick Reference

| Symptom | Check | Fix |
|---|---|---|
| Text "glares" on dark | contrast ratio of fg vs bg | >16:1 halates; **12–15:1** is the refined band |
| Text reads heavy on dark | body `font-weight` | light-on-dark gains optical weight — drop **~50** |
| Headings feel cramped or drifting | one `line-height` across a size scale | leading scales **inversely** with size |
| Uppercase looks cheap | `letter-spacing` on uppercase | always track it; ~5% at reading size |
| Numbers jump out of prose | `font-variant-numeric` | `oldstyle-nums` in prose only |
| Acronyms jump out of prose | true `smcp` support | usually **skip** — see Common Mistakes |
| Icon sits low beside its label | `align-items: baseline` | `inline-flex` + `align-items: center` |

## The Dark-Ground Correction

Light-on-dark blooms: glyph edges halate outward, so the same type reads
both brighter and heavier than it would on white. Two levers, and they
compound — **cut a little from each**, never a lot from one:

1. **Luminance.** A near-white on a near-black often runs 17:1, roughly
   4x the AA floor of 4.5:1. Dim it hue-preserving (scale RGB by ~0.93)
   so the palette's tint survives.
2. **Weight.** 400 on dark reads like 450 on light. Go to 350. This needs
   a *variable* font — a static face snaps to the nearest cut and your
   change does nothing visible.

**When you dim one foreground token, dim every token below it in the same
pass.** Dimming only the primary can leave a "secondary" or "muted" token
brighter than it, silently inverting the hierarchy. Verify the ordering
holds after the change, not before.

## Leading Scales Inversely With Size

The most common structural type bug: one `line-height` on a shared class
used across a large size range.

```css
/* ✗ one value, sizes from 1.35rem to 6.5rem — a 4.8x range */
.display { line-height: 1.02; }

/* ✓ leading belongs with the size step */
.display-xl { font-size: 6.5rem;  line-height: 1.00; }
.display-md { font-size: 4.25rem; line-height: 1.06; }
.display-sm { font-size: 2rem;    line-height: 1.15; }
```

Big type needs tight leading; small type needs looser. A single value
cannot serve both — it will be right at one end and wrong at the other.

**Why this hides:** it only shows on headings that *wrap*. Single-line
headings look correct at any leading, so the defect appears only at narrow
widths or on the longest headings. Always test a wrapping heading.

## Audit Method

Run these before proposing anything. Each maps to a row in Quick Reference.

```bash
# every weight actually declared (usually a surprisingly short list)
grep -rn "font-weight" src --include=*.css

# leading, tracking, and OpenType settings in one pass
grep -rn "line-height\|letter-spacing\|font-variant\|font-feature-settings" src --include=*.css

# headings that escape the display voice inherit UA bold: 700
grep -rn "<h[1-6]" src --include=*.tsx | grep -v "display-class-name"

# does a shared voice class span multiple size steps?
grep -rn "font-size: var(--text-" src --include=*.css
```

Compute contrast rather than eyeballing it — WCAG relative luminance is
gamma-corrected, so hex values are not proportional to perceived
brightness and intuition is unreliable here.

## Common Mistakes

**Fake small caps.** `font-variant: small-caps` on a font without true
`smcp` synthesizes them by scaling capitals down. The strokes end up too
thin for their size, which is *worse* than plain uppercase. Verify the
feature exists before using it; most webfont subsets drop it.

**Old-style figures everywhere.** They belong in *running prose*, where
lining figures interrupt the line. They are wrong in stats, tables, data
and UI numerals, where you want figures that align and stand out.

**Applying a dark-mode weight cut to a face already tuned for dark.** The
"reduce by 50" advice fixes light-mode weights *leaking into* dark mode.
On a dark-only design, check what the weights actually are first — a
display face already at 380 has no 700 to subtract from.

**Assuming a variable font.** With `next/font`, omitting `weight` yields
the variable font; specifying one yields a static instance. Fractional
weights silently do nothing on the latter.

**Changing type tokens without re-checking hierarchy.** See the ordering
warning above.

## Project Binding (this repo)

Repo-specific values live in `CLAUDE.md`, not here. Two standing rules
this skill must not override:

- `.serif-display` axes (`opsz 56, SOFT 30, WONK 0.9`, weight 380) are
  hand-tuned. Do not normalize them.
- Neutrals carry ~2% of the accent. Never emit a plain grey or white.
