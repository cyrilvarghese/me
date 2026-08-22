---
name: type-on-dark
description: Use when choosing a colour for text on this site, setting a font weight or size for anything small, putting red or any accent on type, or when text on the dark ground reads harsh, buzzing, thick, or somehow wrong at a size that should be fine
---

# Type on the dark ground

Everything here is light type on a near-black ground, and that ground
changes what the same weight, size and colour do. The rules below are
what this site has actually been burned by, with the measured numbers.

`portfolio-copy` covers what the words say. This covers how they are set.

## Rule 0 — Measure against the ground the text sits on

Not the page ground. `--bg` is `#151111`, but panels are `--surface`
`#1e1818`, and a panel is lighter, so light text on it has **less**
contrast, not more.

`--accent-lift` measures 4.96:1 on `--bg` and **4.64:1 on `--surface`**.
Both clear AA, but the second only just. A colour chosen against the page
and then used inside a panel has quietly spent most of its headroom.

## Two axes, not one

Contrast is necessary and not sufficient. **Saturation is the second
axis, and on a dark ground it matters nearly as much.**

A fully saturated colour against near-black strains the eye, and
saturated **red** is the worst case specifically: red and the dark
surround focus at different depths in the eye — longitudinal chromatic
aberration — so the letter edges never quite resolve. The line reads as
buzzing or vibrating even when the contrast number is fine.

This site shipped that mistake. `--accent-lift` was originally `#ff0d0d`,
chosen purely to clear the AA floor: 4.75:1, 100% saturation, legal and
unreadable. `#d95a5a` is better on **both** axes — 4.96:1 and 63%
saturation — and it is not a new colour, it is step 3 of the ramp
`case-study-diagrams` already defines.

> When a coloured line reads harsh, reach for saturation before contrast.
> Lowering saturation usually *raises* contrast as well, because the way
> to desaturate a hue on a dark ground is to lighten it.

## The measured palette

Against `--bg` `#151111` and `--surface` `#1e1818`. `*` is under the 4.5
AA floor for normal text.

| ink | saturation | on `--bg` | on `--surface` |
|---|---|---|---|
| `--fg` `#e7e3e1` | 11% | 14.71 | 13.74 |
| `--fg-soft` `#ddd8d6` | 9% | 13.27 | 12.40 |
| `--muted` `#9e9493` | 5% | 6.35 | 5.93 |
| `--accent` `#ea0000` | 100% | 4.02* | 3.75* |
| `--accent-deep` `#c90000` | 100% | 3.11* | 2.91* |
| `--accent-lift` `#d95a5a` | 63% | 4.96 | 4.64 |

Note how low the neutrals' saturation is — that is the ~2% accent tinge
rule, and it is also why they never buzz.

## Which red may be text

- **`--accent`** — decorative and large type only. It is the signal
  colour: nodes, rules, marks, a display line. It fails AA below 24px.
- **`--accent-deep`** — frames and needles. Never text.
- **`--accent-lift`** — **the only red that may be running text.** Use it
  for a phrase inside copy, a label, a caption.

Red is still rare by intent. If red is already on the nodes and on a tag
and on the label, a fourth red is not emphasis any more.

**The split is by SIZE, and it was swept once.** Every red text under the
large-type threshold uses `--accent-lift`; `--accent` is left to marks,
rules, borders and type at 24px and up. That sweep covered the case
kickers, the timeline org names, the tool durations, the PAIN / SOLUTION
/ OUTCOMES labels, the compare index and after-tag, the header and footer
wordmarks, and the /design and /labs eyebrows.

Two reds sitting inches apart is how it was noticed: a case kicker in
`--accent` next to its tag in `--accent-lift`, on the same card. To check
the whole site rather than one card, ask the page:

```js
[...document.querySelectorAll('*')].filter(el => {
  const cs = getComputedStyle(el);
  const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
  const px = parseFloat(cs.fontSize);
  const large = px >= 24 || (px >= 18.66 && +cs.fontWeight >= 700);
  return own && cs.color === 'rgb(234, 0, 0)' && !large;   // --accent on small text
});
```

That should return nothing.

## Weight: subtract, do not add

**Light-on-dark gains optical weight.** Bright type visually expands
against a dark ground, so the same numeric weight reads heavier than it
would on white. `globals.css` already acts on this — body is `350`, not
`400`, with the comment *"400 here reads like 450 would on a light
ground."*

By the same rule, **500 reads like 600** here. A line that wants to be
emphatic on dark usually wants **400**, and colour or size to carry the
rest. Never reach past 500 for body-size text.

## Size and tracking for coloured text

- **A coloured line wants the larger rung.** 13px (`--text-caption`) is
  the hardest size to hand a saturated colour. `--text-small` (14px) is
  the floor for anything coloured that is meant to be read.
- **Add `letter-spacing: 0.01em`** to small light-on-dark text. Light
  type on dark closes up; +0.01–0.02em opens it back out.
- The ten-rung ladder in `tokens.css` still governs. These are choices
  *within* it, not exceptions to it.

## One emphasis per block

Emphasis is comparative. Three treatments in one block is none.

The About lede shipped with a red phrase, a bold clause wrapped around
that same phrase, and a second bold clause in the next paragraph. Nothing
stood out because everything did. It now carries one: a single red
phrase, everything else at one weight and one colour.

| Wrote (rejected) | Shipped |
|---|---|
| red span *inside* a bold clause, plus a second bold clause | one red phrase, nothing else marked |
| a red `PAIN` tag in front of the pain text | the pain text in red, no tag |

If a treatment repeats what another treatment already said — a red tag in
front of a red line, bold under a colour — cut one. Colour alone is
enough; weight on top of it is a second treatment doing one job.

## How to check

Never eyeball a ratio. Compute it against the real ground:

```js
const lin = v => { v /= 255; return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); };
const hex = h => [1,3,5].map(i => parseInt(h.slice(i, i+2), 16));
const L = h => { const [r,g,b] = hex(h); return 0.2126*lin(r) + 0.7152*lin(g) + 0.0722*lin(b); };
const ratio = (fg, bg) => { const a = L(fg), b = L(bg), hi = Math.max(a,b), lo = Math.min(a,b);
  return (hi + 0.05) / (lo + 0.05); };
const sat = h => { const [r,g,b] = hex(h).map(v => v/255);
  const mx = Math.max(r,g,b), mn = Math.min(r,g,b), l = (mx+mn)/2;
  return mx === mn ? 0 : (mx-mn) / (1 - Math.abs(2*l - 1)); };
```

Then read the *computed* style off the element in the browser — colour,
weight, size, tracking — rather than trusting the stylesheet. A token can
be overridden by a rule further down the file.

## Common mistakes

| Mistake | Reality |
|---|---|
| Picked a colour because it cleared 4.5:1 | Contrast is one axis. A 100%-saturated red at 4.75:1 still buzzes; desaturating usually raises the ratio too. |
| Measured against `--bg` | If it sits in a panel, measure against `--surface` — the same ink loses about 0.3 there. |
| Reached for 500 to make a line stand out | Light-on-dark gains optical weight; 500 reads as 600. Use 400 and let colour or size carry it. |
| Put a coloured line at 13px | The smallest rungs are the worst place for colour. 14px floor for anything coloured. |
| Added bold on top of a colour | Two treatments, one job. Pick one. |
| Used `--accent` for a caption or a tag | `--accent` is 4.02:1 — decorative and large type only. `--accent-lift` is the text-legal rung. |
| Added a red label in front of red text | The label is saying what the colour already said. |

## Sources

- [Imperavi — UI Typography, Accessibility](https://imperavi.com/books/ui-typography/principles/accessibility/)
- [Design Shack — Dark Mode Typography](https://designshack.net/articles/typography/dark-mode-typography/)
- [Smashing Magazine — Inclusive Dark Mode](https://www.smashingmagazine.com/2025/04/inclusive-dark-mode-designing-accessible-dark-themes/)
- [UXmatters — Applying Color Theory to Digital Displays](https://www.uxmatters.com/mt/archives/2007/01/applying-color-theory-to-digital-displays.php)
