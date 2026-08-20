# Handoff — type system for the case studies (HTML + SVG)

Context doc for a fresh session. Written 2026-08-20 at the end of the
CaseChat diagrams session; the task below was planned but **not executed**
(plan was drafted, Cyril took it to a new conversation instead).

## Where the work lives

- **Worktree:** `.claude/worktrees/casechat-scene-diagrams`, branch
  `worktree-casechat-scene-diagrams`. This is the standing worktree for
  case-study work (see memory `work-in-worktree`) — keep using it.
- **State at handoff:** clean tree, **3 commits ahead of `origin/main`**,
  unpushed: `41d4804` (research eyebrow → muted), `a54f547` (CaseVoices
  adopts the band head template), `e2cd4ba` (CaseObject caption removed).
- **Landing procedure that works:** rebase onto `main` inside the
  worktree → verify (`npm run check`, `npm test`, `npm run build`) →
  `ExitWorktree keep` → `git merge --ff-only` on `main` → push only on
  explicit go → re-enter worktree by path. `main` moves often; check
  divergence *at merge time*.
- **Dev server:** Cyril usually runs the worktree app on **port 3010**
  (main checkout uses 3000). Verify with screenshots via
  `node scripts/shot.mjs <url> <out.png> [w h] [reduce] [full]` — never
  assume. No new probe scripts without asking.
- **Known unrelated breakage on `main`:** `data.test.ts` "peeks smaller
  than it lands" fails — `8d2e462` set `PEEK_SCALE = 1.5` but the test
  asserts `< 1`. Pre-existing, not ours; Cyril to decide the fix.

## The task

Create a simple type system for the case-study pages, shaped like the
Material type-scale table Cyril supplied (named rungs, each fixing size /
case / tracking), grounded in editorial-reading practice (a case study is
read, not operated), and covering **both HTML and the SVG diagrams**.

### Why (audit findings, `/work/case-chat`)

The token scale has 6 steps but the pages need ~10. Components invented
the missing rungs by hand — none changeable in one place:

- Between `--text-small` (0.875rem) and `--text-label` (0.75rem) and
  below: `0.8125rem` (CaseObject attrs), `0.7rem` ×3 (CaseJourney),
  `0.65rem` (CaseCompare tag), `0.6rem` (CaseSection eyebrow, knife).
- Above small: `0.9375rem` (CaseObject user labels), `0.95rem`
  (CaseImpact), `0.9rem` (CaseShell), `1.0625rem` (CaseObject object
  label + CaseMark mobile quote), `1.25rem` (CaseMark quote, set by
  Cyril at 20px).
- SVG diagrams: 9 distinct `font-size` values across 12 files. House
  convention is 15 label / 12 caption at viewBox ≈ rendered width
  (documented in the `case-study-diagrams` skill Type section); newer
  mobile files use 13/14/15; `01-today-scenes.svg` runs 20/22 as a
  **documented deliberate exception** (file carries Cyril's note — do
  not "correct" it).

### Editorial grounding (researched)

Body 16–18px, line-height 1.4–1.6, measure 45–75ch, ≥14px-equivalent for
sustained reading on mobile, ~12px floor for short labels, ratio ~1.2–1.33
for editorial pages. The site already conforms: `--text-body` =
`clamp(1rem, 1.15vw, 1.125rem)` (16→18px), body LH 1.6, ledes 56–62ch.
**So: complete the scale, don't re-base it — every existing token value
stays.** Sources: locallylost.com/guides/typography-and-readability,
designer-daily.com (long-form reading), b12.io typographic-scale.

### The proposed ladder (`src/app/tokens.css`, replaces the type block)

```css
--text-display:   clamp(2.75rem, 7.5vw, 6.5rem);   /* existing — hero */
--text-statement: clamp(2rem, 5vw, 4.25rem);        /* existing */
--text-h3:        clamp(1.35rem, 2.4vw, 2rem);      /* existing — bands */
--text-quote:     1.25rem;    /* NEW — pull/mark quotes (20px, Cyril's) */
--text-body:      clamp(1rem, 1.15vw, 1.125rem);    /* existing */
--text-sublabel:  0.9375rem;  /* NEW — a name under a mark (15px) */
--text-small:     0.875rem;   /* existing — captions (14px) */
--text-caption:   0.8125rem;  /* NEW — labels inside figures (13px) */
--text-label:     0.75rem;    /* existing — mono eyebrows (12px) */
--text-fine:      0.65rem;    /* NEW — smallest mark; hard floor */
```

### Adoption map (mechanical unless noted)

| File | From → To | Visible change |
|---|---|---|
| CaseMark 1.25rem | `--text-quote` | none |
| CaseMark 1.0625rem (mobile) | keep as local step-down, comment | none |
| CaseObject 0.9375 / 0.8125 | `--text-sublabel` / `--text-caption` | none |
| CaseObject 1.0625rem | keep, comment (deliberate off-rung) | none |
| CaseCompare 0.65rem | `--text-fine` | none |
| CaseSection 0.6rem | `--text-fine` | **+0.8px** (below floor anyway) |
| CaseJourney 0.7rem ×3 | `--text-fine` | **−0.8px** |
| CaseImpact 0.95rem | `--text-sublabel` | ~none |
| CaseShell 0.9rem | `--text-sublabel` | +0.6px |

**Do NOT tokenise** (composition, not scale): CaseQuote 26vw quote mark,
CaseSummary 0.44em `%`, CaseShowcase 3.75rem, FinalCTA / UnknownProblem
display clamps, CaseVoices heading clamp `(1.5rem,3vw,2rem)` and CaseTabs
label clamp — the last two Cyril set by hand this session.

**Out of scope this pass:** `sections/` modules (OperatingModel,
ToolList, OutcomeTransition…) — same treatment later.

### SVG side

Diagrams are standalone files (inlined at build; can't read CSS vars).
Express the ladder as named rungs in viewBox units at 1:1 render, added
to the skill's Type section: **20 quote/callout · 15 sublabel · 14 small ·
13 caption · 12 label**, scaled by `viewBox width / rendered width` when
not 1:1 (formula already in the skill). This legitimises current practice;
`01-today-scenes.svg` stays the labelled exception.

### Also update

- `/design` (`src/app/design/page.tsx`) — a Type section in the Material
  table shape: each rung at true size, name / px / usage. `/design` is
  the reference page for anything new (per CLAUDE.md).
- `.claude/skills/case-study-diagrams/SKILL.md` — Type section gets the
  rung table (replacing prose-only "15 and 12").
- `CLAUDE.md` Visual system — one line naming the ladder.

### Verification

`npm run check` · `npm run build` · screenshots: `/design` (new section),
`/work/case-chat` at 1400 + 420 (only CaseSection/CaseJourney shift, by
<1px), `/work/creative-os` + `/work/msig` at 1400 (CaseCompare/Journey/
Section appear there too — no layout shift). Tests: 26 pass, 1 known
`main` failure unrelated.

## Other open threads (not this task)

- `CaseVoices` mobile is still a plain column-drop (persona then quotes);
  arguably fine for a list of quotes, but never rethought under the
  "three moves" rule.
- Tags `pre-rebase-casechat` and `pre-rebase-2` can be deleted.
- Skill mobile section now names three moves (rotate / rank by size /
  substitute) + connector-form rule; written from real failures, never
  subagent-tested.
- Cyril's main checkout had an uncommitted `ToolCarousel.module.css`
  change (his, untouched).
