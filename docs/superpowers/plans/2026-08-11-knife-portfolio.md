# Swiss Army Knife Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Single-page portfolio where a layered 2D Swiss Army knife unfolds on scroll, one tool per capability, ending in "Give it to me."

**Architecture:** SvelteKit static site. One `capabilities` data array drives placeholder SVG layers, GSAP ScrollTrigger timeline, labels, narrative copy, and case-study indicators. Knife layers are asset-agnostic components (SVG placeholder now, raster `<img>` later via config flip).

**Tech Stack:** SvelteKit 2, Svelte 5 (runes), TypeScript, GSAP + ScrollTrigger, @sveltejs/adapter-static, Vitest, @fontsource fonts.

## Global Constraints

- Spec of record: `docs/superpowers/specs/2026-08-11-swiss-army-knife-portfolio-design.md` (read it before starting; all copy strings come from it verbatim).
- Palette: bg `#0E0E0E`, fg `#F1EFEA`, secondary `#99958E`, accent muted brass (start `#C2A878`, tune visually).
- Type: Newsreader (editorial serif) / Space Grotesk (body) / JetBrains Mono (labels, uppercase, letter-spacing 0.12–0.18em). All self-hosted via @fontsource — no external font CDN.
- Shared knife coordinate system: square canvas, hinge at 50.5% / 63% (`transform-origin` on every tool layer).
- Scroll windows (fraction of knife-section progress): intro 0–.10, then six 0.13-wide windows starting at .10 (research, product, design, code, ai, gtm), complete .88–1.
- Open angles: research 72, product 42, design 18, code −22, ai −48, gtm −76.
- Easing `power3.inOut`, ~6% mechanical overshoot then settle; all motion scrubbed to scroll.
- `prefers-reduced-motion: reduce` → static fully-open knife, no sticky/scrub, opacity-only transitions, all info available as text.
- Voice: no "passionate", "ninja", "rockstar", "10x", "polymath", "jack of all trades". Never say "Swiss Army knife" in copy.
- Verification gates per task: `npm run check` (svelte-check), `npm test` (vitest) when tests exist, `npm run build`. Visual work: confirm in dev server.
- Commit after every task. Windows dev machine; use POSIX paths in code, quote paths in shell.

---

### Task 1: Scaffold project

**Files:**
- Create: SvelteKit skeleton at repo root (`package.json`, `svelte.config.js`, `vite.config.ts`, `src/routes/+page.svelte`, `src/routes/+layout.svelte`, `src/routes/+layout.ts`, `src/app.html`, `tsconfig.json`)

**Interfaces:**
- Produces: working `npm run dev` / `npm run build` / `npm run check` / `npm test`; static adapter with full prerender.

- [ ] **Step 1:** Repo root already contains `docs/` and `.git`, so scaffold into a temp dir and move up:

```bash
cd "/c/Users/cyril varghese/code/porftolio"
npx sv create tmp-scaffold --template minimal --types ts --no-add-ons --install npm
# move everything (incl. dotfiles) into root, then remove tmp-scaffold
```

If `sv create` demands interactivity, fall back to writing the skeleton files by hand (minimal template contents are small).

- [ ] **Step 2:** Install deps: `npm i gsap` and `npm i -D @sveltejs/adapter-static vitest @fontsource-variable/newsreader @fontsource-variable/space-grotesk @fontsource/jetbrains-mono`.

- [ ] **Step 3:** Switch `svelte.config.js` to `adapter-static`; create `src/routes/+layout.ts` with `export const prerender = true;`. Add `"test": "vitest run"` script.

- [ ] **Step 4:** Verify: `npm run check` passes, `npm run build` emits `build/index.html`.

- [ ] **Step 5:** Commit `chore: scaffold sveltekit static site`.

### Task 2: Design tokens + global styles

**Files:**
- Create: `src/lib/styles/tokens.css`, `src/lib/styles/global.css`
- Modify: `src/routes/+layout.svelte` (import fonts + css), `src/app.html` (bg color on `<html>` to avoid white flash)

**Interfaces:**
- Produces: CSS custom props `--bg`, `--fg`, `--muted`, `--accent`, `--font-serif`, `--font-sans`, `--font-mono`; utility classes `.mono-label` (uppercase, 0.14em tracking), `.serif-display`.

- [ ] **Step 1:** tokens.css:

```css
:root {
  --bg: #0e0e0e;
  --fg: #f1efea;
  --muted: #99958e;
  --accent: #c2a878;
  --font-serif: 'Newsreader Variable', georgia, serif;
  --font-sans: 'Space Grotesk Variable', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}
```

global.css: reset, `body { background: var(--bg); color: var(--fg); font-family: var(--font-sans); }`, `.mono-label { font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.14em; font-size: 0.75rem; }`, `.serif-display { font-family: var(--font-serif); font-weight: 400; line-height: 1.05; }`, selection color, smooth text rendering.

- [ ] **Step 2:** Import in `+layout.svelte`:

```svelte
<script lang="ts">
  import '@fontsource-variable/newsreader';
  import '@fontsource-variable/space-grotesk';
  import '@fontsource/jetbrains-mono';
  import '$lib/styles/tokens.css';
  import '$lib/styles/global.css';
  let { children } = $props();
</script>
{@render children()}
```

- [ ] **Step 3:** `npm run check` + visual smoke in dev server (dark bg, fonts load). Commit `feat: design tokens and global styles`.

### Task 3: Capability + case data model (with tests)

**Files:**
- Create: `src/lib/data/capabilities.ts`, `src/lib/data/cases.ts`, `src/lib/data/scroll.ts`
- Test: `src/lib/data/data.test.ts`

**Interfaces:**
- Produces:

```ts
export type Capability = {
  id: 'research' | 'product' | 'design' | 'code' | 'ai' | 'gtm';
  label: string;          // 'Research'
  statement: string;      // 'Find out what is actually happening.'
  tags: string[];         // evidence tags, verbatim from spec §14
  hover: string;          // §39 contextual line (code one is in spec; write matching lines for others)
  openAngle: number;      // signed degrees
  layer: 'back' | 'front'; // back = behind body (research/product/design)
};
export const capabilities: Capability[]; // ordered research→gtm
export const HINGE = { x: 50.5, y: 63 }; // percent of canvas

// scroll.ts
export const INTRO_END = 0.10;
export const WINDOW = 0.13;
export function windowFor(i: number): { start: number; end: number }; // i in 0..5
// windowFor(0) => {start:0.10, end:0.23} … windowFor(5) => {start:0.75, end:0.88}

export type CaseStudy = {
  num: string; category: string; headline: string; startedWith: string;
  built: string; results?: { value: string; label: string }[];
  tools: Record<Capability['id'], boolean>;
};
export const cases: CaseStudy[]; // 3 entries, content verbatim from spec §23–26
```

- [ ] **Step 1:** Write failing test `data.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { capabilities } from './capabilities';
import { windowFor, INTRO_END } from './scroll';
import { cases } from './cases';

describe('capabilities', () => {
  it('has six ordered tools with unique ids and nonzero angles', () => {
    expect(capabilities.map(c => c.id)).toEqual(['research','product','design','code','ai','gtm']);
    for (const c of capabilities) expect(c.openAngle).not.toBe(0);
  });
  it('back tools open positive, front tools negative', () => {
    for (const c of capabilities)
      expect(c.layer === 'back' ? c.openAngle > 0 : c.openAngle < 0).toBe(true);
  });
});

describe('scroll windows', () => {
  it('are contiguous 0.13 slices from intro end to 0.88', () => {
    expect(windowFor(0).start).toBeCloseTo(INTRO_END);
    for (let i = 0; i < 6; i++) {
      expect(windowFor(i).end - windowFor(i).start).toBeCloseTo(0.13);
      if (i > 0) expect(windowFor(i).start).toBeCloseTo(windowFor(i - 1).end);
    }
    expect(windowFor(5).end).toBeCloseTo(0.88);
  });
});

describe('cases', () => {
  it('has three cases each flagging at least four tools', () => {
    expect(cases).toHaveLength(3);
    for (const c of cases)
      expect(Object.values(c.tools).filter(Boolean).length).toBeGreaterThanOrEqual(4);
  });
});
```

- [ ] **Step 2:** `npm test` → FAIL (modules missing).
- [ ] **Step 3:** Implement the three modules. Copy statements/tags/case content verbatim from spec §14, §23–26. Angles from Global Constraints.
- [ ] **Step 4:** `npm test` → PASS. `npm run check` → PASS.
- [ ] **Step 5:** Commit `feat: capability, case, and scroll-window data model`.

### Task 4: Knife layers with placeholder SVG art

**Files:**
- Create: `src/lib/components/knife/KnifeCanvas.svelte`, `src/lib/components/knife/KnifeLayer.svelte`, `src/lib/components/knife/art.ts`, `src/lib/components/knife/placeholders/Body.svelte` + one placeholder per tool (`Research.svelte`, `Product.svelte`, `Design.svelte`, `Code.svelte`, `Ai.svelte`, `Gtm.svelte`)

**Interfaces:**
- Consumes: `capabilities`, `HINGE` from Task 3.
- Produces:
  - `art.ts`: `export const ART_MODE: 'placeholder' | 'raster' = 'placeholder'; export const rasterSrc = (id: string) => \`/assets/knife/\${id}.webp\`;`
  - `KnifeCanvas.svelte` props: `{ angles?: Record<string, number> }` — square container (`aspect-ratio: 1`), renders body + 6 `KnifeLayer`s stacked `position:absolute; inset:0`, z-order back tools (20/30/40) < body (50) < front tools (60/70/80). Each tool layer element carries `data-tool={id}` and `style:transform-origin: 50.5% 63%` so GSAP can target `[data-tool="research"]` etc.
  - Placeholder SVGs: all share `viewBox="0 0 1000 1000"`, hinge pin at (505, 630), tools drawn closed (folded along the body silhouette). Flat editorial style: body near-black `#1a1a1a` rounded slab with `CV` mark in accent; tools in `#2a2a28`–`#3a3a36` grays with accent edge line. Iconography: research=magnifier blade, product=compass/reamer, design=pen nib, code=blade with `</>` etch, ai=awl with spark tip, gtm=corkscrew.

- [ ] **Step 1:** Build `KnifeLayer` (chooses placeholder component vs `<img>` by `ART_MODE`), `KnifeCanvas`, and the seven placeholder SVGs. Keep every tool's rotation at the prop-supplied angle via `style:transform: rotate({angle}deg)` default 0.
- [ ] **Step 2:** Temporary harness: render `<KnifeCanvas angles={{research:72,product:42,design:18,code:-22,ai:-48,gtm:-76}} />` on `+page.svelte`; verify in dev server that open pose looks radial and hinge doesn't drift (toggle angles 0 ↔ open).
- [ ] **Step 3:** `npm run check`. Commit `feat: layered knife canvas with placeholder svg art`.

### Task 5: Knife scroll story (sticky stage + GSAP timeline + narrative)

**Files:**
- Create: `src/lib/components/knife/KnifeStory.svelte`, `src/lib/components/knife/ToolLabels.svelte`, `src/lib/components/knife/Narrative.svelte`, `src/lib/gsap.ts`
- Modify: `src/routes/+page.svelte`

**Interfaces:**
- Consumes: `KnifeCanvas`, `capabilities`, `windowFor`.
- Produces: `KnifeStory` — 600vh section, sticky 100vh stage (knife right-center ~50vw max 850px, narrative left ~35vw). `src/lib/gsap.ts` exports `initGsap()` that registers ScrollTrigger once (client only).

- [ ] **Step 1:** Timeline construction (inside `onMount`, cleaned up on destroy). Total duration 1, scrubbed:

```ts
const tl = gsap.timeline({
  scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: 0.4 },
});
capabilities.forEach((c, i) => {
  const { start, end } = windowFor(i);
  const dur = end - start;
  const el = `[data-tool="${c.id}"]`;
  // mechanical overshoot: 80% of window to 106% of angle, 20% settle back
  tl.to(el, { rotation: c.openAngle * 1.06, duration: dur * 0.8, ease: 'power3.inOut' }, start)
    .to(el, { rotation: c.openAngle, duration: dur * 0.2, ease: 'power1.out' }, start + dur * 0.8);
});
```

- [ ] **Step 2:** Narrative panels: one absolutely-stacked panel per state (intro, six capabilities, complete). Animate on the same timeline: fade/slide in at window start (`y: 16 → 0, opacity 0 → 1, duration dur*0.25`), out at window end; evidence tags stagger 0.05 within the window. Complete state shows "One person. / Multiple points of leverage." then "Different problems require different tools."
- [ ] **Step 3:** `ToolLabels`: mono uppercase labels positioned around the knife (absolute, per-tool coords in a static map), each fades in during its window on the same timeline; label text angled along blade (`rotate(angle * 0.35deg)`).
- [ ] **Step 4:** Intro copy (0–10%): "Sometimes the problem isn't a design problem." over the closed knife.
- [ ] **Step 5:** Verify in dev server: scrub up/down repeatedly — no jumps, tools settle with overshoot, copy states never overlap. `npm run check`. Commit `feat: scroll-driven knife unfold with narrative sync`.

### Task 6: Header + Hero

**Files:**
- Create: `src/lib/components/sections/Header.svelte`, `src/lib/components/sections/Hero.svelte`
- Modify: `src/routes/+page.svelte`

**Interfaces:**
- Consumes: tokens; `KnifeCanvas` (closed, peeking from right edge, partially out of viewport).
- Produces: 100vh hero. Copy verbatim: eyebrow `PRODUCT BUILDER · DESIGNER · ENGINEER`; headline "Give me the outcome. I'll figure out the rest." (serif display, two lines); description "I work across product, design, engineering and AI to turn ambiguous problems into shipped systems."; scroll cue `SEE HOW ↓` (mono). Header: `CV` left; `WORK` `ABOUT` `CONTACT` right (anchor links), sticky, subtle transparency + blur after scroll.

- [ ] **Step 1:** Build both components; hero knife is a second small `KnifeCanvas` at angles all 0, clipped by viewport edge.
- [ ] **Step 2:** Verify hero at 1440px and 1024px widths. `npm run check`. Commit `feat: header and hero`.

### Task 7: Outcome transition + operating model

**Files:**
- Create: `src/lib/components/sections/OutcomeTransition.svelte`, `src/lib/components/sections/OperatingModel.svelte`
- Modify: `src/routes/+page.svelte`, `KnifeStory.svelte` (export its ScrollTrigger end so transition can chain, or simply extend the master timeline)

**Interfaces:**
- Produces: after knife completes — extend the knife master timeline (add 0.88–1.0 range or a follow-on 200vh pinned section): labels fade → blades fade → body fades → only type remains: "Tools aren't the point." then half a viewport later "Outcomes are." (serif, huge). OperatingModel: headline "I work backwards from the outcome."; horizontal loop UNDERSTAND → FRAME → MAKE → SHIP → LEARN with return arrow (mono + thin rules, CSS grid, no images); microcopy per node verbatim from spec §21; footer line "Different tools. Same loop."

- [ ] **Step 1:** Implement fade-out choreography as a second pinned section with its own scrubbed timeline (cleaner than overloading the first): duplicate `KnifeCanvas` open-pose enters already open, layers fade in order labels→tools→body while the two statements swap.
- [ ] **Step 2:** Implement OperatingModel as static section with mild scroll-in reveals (`gsap.from` with `once: true`).
- [ ] **Step 3:** Verify continuity knife→transition→loop feels like one argument. `npm run check`. Commit `feat: outcome transition and operating model`.

### Task 8: Case studies

**Files:**
- Create: `src/lib/components/sections/CaseStudy.svelte`, `src/lib/components/sections/ToolDots.svelte`
- Modify: `src/routes/+page.svelte`

**Interfaces:**
- Consumes: `cases`, `capabilities`.
- Produces: `CaseStudy` props `{ study: CaseStudy }` rendering spec §22 structure: mono number/category, serif outcome headline, "Started with / I owned / Built" rows, optional big-number results grid (case 03: 20+ internal products, 1 HR faster dispatch, 8 MIN faster quote issuance, 25% fewer no-shows), `EXPLORE →` stub link. `ToolDots`: ●/○ per capability (● involved, ○ not), mono list, no percentages.

- [ ] **Step 1:** Build components; visuals area = bordered placeholder frame (`aspect-video`, thin `--muted` border, mono caption "INTERFACE VISUAL — TBD BY ASSETS") since case imagery arrives later.
- [ ] **Step 2:** Render three cases (§23 agentic creative production, §25 CaseChat, §26 operational systems). `npm run check`. Commit `feat: case study system`.

### Task 9: Career, unknown-problem, final knife callback, CTA, footer

**Files:**
- Create: `src/lib/components/sections/Career.svelte`, `src/lib/components/sections/UnknownProblem.svelte`, `src/lib/components/sections/FinalCTA.svelte`, `src/lib/components/sections/Footer.svelte`
- Modify: `src/routes/+page.svelte`

**Interfaces:**
- Consumes: `KnifeCanvas`, `capabilities`, gsap.
- Produces:
  - Career: "I didn't set out to become a generalist." / "I kept expanding the part of the outcome I could own." + 4-stage growing-bar diagram (CODE → CODE+DESIGN → CODE+DESIGN+PRODUCT → RESEARCH+PRODUCT+DESIGN+CODE+AI), bars widen on scroll-in.
  - UnknownProblem: full-bleed dark, huge serif "What if I've never done it before?" → "Good." → the resolve paragraph → four mono pairs (Agentic system? Build it. / New market? Understand it. / Need someone? Find them. / Unknown industry? Learn fast.)
  - FinalCTA: 300vh pinned section — knife enters fully open, tools fold to 0 in reverse order (gtm first) on scrub, no copy during folding; once closed: "Got an outcome nobody owns?" then huge "Give it to me." + `START A CONVERSATION` (mailto:cyril@yuvabe.com) + secondary `CYRIL.DESIGN`.
  - Footer: minimal — mono `CV · 2026` + contact link.

- [ ] **Step 1:** Build the three static sections with once-reveals.
- [ ] **Step 2:** Build FinalCTA fold timeline (reverse of Task 5 pattern: start at openAngle, `rotation: 0`, reverse stagger).
- [ ] **Step 3:** Full-page scroll-through in dev server. `npm run check`, `npm test`, `npm run build`. Commit `feat: career, unknown-problem, final fold cta, footer`.

### Task 10: Reduced motion + responsive + performance

**Files:**
- Modify: `KnifeStory.svelte`, `FinalCTA.svelte`, `OutcomeTransition.svelte`, section components, `global.css`

**Interfaces:**
- Produces: `gsap.matchMedia()` branches:
  - `(prefers-reduced-motion: reduce)`: no pinned/scrub timelines; knife rendered fully open once; capabilities listed sequentially beneath as plain text sections; opacity-only.
  - `(max-width: 768px)`: stacked layout COPY / knife / COPY, knife 90vw, angles × 0.8 (compress per spec §32), one label at a time, no orbiting tags.
  - `(min-width: 769px)`: full behavior.

- [ ] **Step 1:** Restructure timeline creation inside `gsap.matchMedia()` contexts with cleanup.
- [ ] **Step 2:** Mobile pass at 390px: no horizontal scroll anywhere (`overflow-x` audit), tap targets ≥ 44px.
- [ ] **Step 3:** Performance: verify build JS < 200KB gz (`npm run build` output), fonts subset via fontsource defaults, `loading="lazy"` on future raster imgs, `<link rel="preload">` only for body layer when `ART_MODE==='raster'`.
- [ ] **Step 4:** Reduced-motion check via devtools emulation. `npm run check`, `npm test`, `npm run build`. Commit `feat: reduced motion, responsive, perf pass`.

### Task 11: AI art prompt pack + raster drop-in path

**Files:**
- Create: `docs/knife-art-prompts.md`, `static/assets/knife/README.md`

**Interfaces:**
- Consumes: placeholder SVG art (serves as composition reference), `art.ts` contract.
- Produces: a generation guide the user can run through any image model:
  - Global style block (palette, lighting, "premium industrial illustration, editorial diagram, flat with subtle metallic gradients, near-black graphite body, muted brass accents, no text, no watermark, transparent background").
  - One prompt per layer (body + 6 tools) each specifying: 2048×2048 canvas, tool drawn closed along the body silhouette, hinge pin centered at 50.5%/63%, which side of body it tucks into (back vs front set), no cast shadow baked (or consistent soft shadow).
  - Post-processing checklist: align hinge pixel-exact across layers, crop to shared canvas, export webp (1000/1500/2000 widths), drop into `static/assets/knife/{id}.webp`, flip `ART_MODE` to `'raster'`.

- [ ] **Step 1:** Write both docs with actual prompt text (not placeholders).
- [ ] **Step 2:** Commit `docs: knife art generation prompt pack`.

---

## Self-review notes

- Spec coverage: hero §6–7 (T6), knife art/asset §8–12 (T4, T11), scroll story §13–18 (T5), evidence drawer §19 — deferred, spec calls it secondary ("Do later" adjacent; noted as stub `EXPLORE →` links), transition §20 (T7), operating model §21 (T7), cases §22–26 (T8), career §27 (T9), unknown §28 (T9), final callback §29 (T9), visual system §30–31 (T2), responsive §32–33 + a11y §34 + perf §35–36 (T10), animation §15–16, 37 (T5), data model §38 (T3), hover §39–40: add blade hover dim (opacity 0.55 others) in T5 Step 3 scope, nav §41 (T6), copy rules §42–43 respected in data files, MVP §44 honored, build order §45 = task order, DoD §46 = final check.
- Hover behavior (§39) is folded into Task 5 (ToolLabels step) — desktop only, after full open.
- Types consistent: `Capability`, `CaseStudy`, `windowFor`, `ART_MODE` defined once (T3/T4), consumed later by name.
