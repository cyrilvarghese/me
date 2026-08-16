# Case-Study Detail Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Each case-study card's preview visual expands to fill the viewport and becomes the hero of a real, statically-exported detail page at `/work/<slug>`.

**Architecture:** React `ViewTransition` shared-element morph between the card visual and a full-viewport detail hero (both render the same `CaseVisual` component); detail routes are all-server-component pages (`app/work/[slug]`) with page-owned chrome; per-case content is TSX composed from shared primitives, resolved via a slug registry.

**Tech Stack:** Next 16.3 App Router (`output: "export"`), React 19 canary `ViewTransition` (bundled with Next — no new deps), CSS Modules, existing `motion` (`m` + LazyMotion strict) for the card reveal only, Vitest for data tests.

**Spec:** `docs/superpowers/specs/2026-08-16-case-study-detail-pages-design.md`

## Global Constraints

- `next.config.ts` must keep `output: "export"` and `images: { unoptimized: true }`. Plain `<img>`, never `next/image`.
- No new dependencies. No `domMax` upgrade — framer is not involved in the morph.
- Framer imports: always `m` from `motion/react` (LazyMotion strict — `motion.*` throws).
- Copy: compressed; never the words "Swiss Army knife"; never "passionate", "ninja", "rockstar", "10x", "polymath", "jack of all trades".
- Color: tokens only (`--bg`, `--fg`, `--fg-soft`, `--muted`, `--accent`, `--hairline`, `--surface`) — never plain `#000`/`#fff`. Red (`--accent`) is decorative/large-type only, never small body text.
- Animate only `transform` and `opacity` (browser-driven view-transition snapshots excepted).
- `default="none"` on a `ViewTransition` MUST keep its explicit `share="morph"` — with `default="none"` and no `share`, the morph silently dies (Next guide warning).
- No new one-off probe/debug scripts — verification uses `scripts/shot.mjs` / `scripts/scroll-shots.mjs` only (hard user rule).
- Commit per task; **never push** — Cyril pushes on his explicit go.
- Screenshots go to the session scratchpad, not the repo.

---

### Task 1: Slug + cover fields on the case data

**Files:**
- Modify: `src/lib/data/cases.ts`
- Test: `src/lib/data/data.test.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces: `CaseStudy` gains `slug: string` and `cover?: string`. Slug values: `"creative-os"`, `"case-chat"`, `"msig"`. All three entries carry `cover`. Later tasks import `cases`/`CaseStudy` from `@/lib/data/cases` and rely on these exact fields.

- [ ] **Step 1: Write the failing tests** — add inside the existing `describe("cases", …)` block of `src/lib/data/data.test.ts`, and add the two node imports at the top of the file:

```ts
import { existsSync } from "node:fs";
import { join } from "node:path";
```

```ts
  it("every case has a unique url-safe slug", () => {
    const slugs = cases.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(cases.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("cover paths resolve to files under public/", () => {
    for (const c of cases) {
      if (!c.cover) continue;
      expect(c.cover).toMatch(/^\/assets\//);
      expect(existsSync(join("public", c.cover))).toBe(true);
    }
  });
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npx vitest run src/lib/data/data.test.ts`
Expected: FAIL — `c.slug` is `undefined` (type error at compile or `toMatch` on undefined).

- [ ] **Step 3: Add the fields** — in `src/lib/data/cases.ts`, extend the type and the three entries:

```ts
export type CaseStudy = {
  slug: string;
  num: string;
  category: string;
  headline: string;
  startedWith: string;
  built: string;
  cover?: string;
  results?: { value: string; label: string }[];
};
```

Entry additions (keep every existing field untouched):
- case 01: `slug: "creative-os",` and `cover: "/assets/CreativeOS/cover.png",`
- case 02: `slug: "case-chat",` and `cover: "/assets/CaseChat/thumbnail.png",`
- case 03: `slug: "msig",` and `cover: "/assets/MSIG/cover.png",`

- [ ] **Step 4: Run tests to verify pass**

Run: `npm test` — all tests green. Then `npm run check` — clean.

- [ ] **Step 5: Commit**

```bash
git add src/lib/data/cases.ts src/lib/data/data.test.ts
git commit -m "feat: case data carries slugs and cover images"
```

---

### Task 2: Global view-transition wiring (types, scroll, CSS, header)

**Files:**
- Create: `src/types/react-canary.d.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/components/sections/Header.tsx`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: `ViewTransition` importable from `"react"` with types; `<Header sub />` prop for detail pages (`sub?: boolean`, default false = today's behavior); `site-header` pin CSS; reduced-motion kill-switch for all view transitions.

- [ ] **Step 1: Create `src/types/react-canary.d.ts`** with exactly this content (the `@types/react` canary header states one reference anywhere in the project suffices; a tsconfig `types` array would disable automatic `@types/*` inclusion and is rejected):

```ts
/// <reference types="react/canary" />
```

- [ ] **Step 2: Restore the router's scroll override** — in `src/app/layout.tsx`, the `<html>` tag becomes (Next 16 no longer overrides CSS `scroll-behavior: smooth` during navigation; without this the scroll-to-top animates mid-morph):

```tsx
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
    >
```

- [ ] **Step 3: Append the view-transition block to `src/app/globals.css`**:

```css
/* ---- view transitions (case-study expand morph) ---- */

/* keep the page clickable while a transition runs */
::view-transition {
	pointer-events: none;
}

::view-transition-group(.morph) {
	animation-duration: 420ms;
}

/* the fixed header must never appear to move: pin its group, hide the
   old snapshot so both headers never show at once */
::view-transition-group(site-header) {
	animation: none;
	z-index: 300;
}

::view-transition-old(site-header) {
	display: none;
}

::view-transition-new(site-header) {
	animation: none;
}

@media (prefers-reduced-motion: reduce) {
	::view-transition-old(*),
	::view-transition-new(*),
	::view-transition-group(*) {
		animation-duration: 0s !important;
		animation-delay: 0s !important;
	}
}
```

- [ ] **Step 4: Header `sub` variant + pin name** — `src/components/sections/Header.tsx` becomes:

```tsx
import Link from "next/link";
import styles from "./Header.module.css";

/** sub: rendered on a sub-page — brand and nav become real route links
    back to the home sections (there is no #work element off the home
    page). Home keeps plain hash anchors so SmoothAnchors owns the glide. */
export default function Header({ sub }: { sub?: boolean }) {
  return (
    <header className={styles.header} style={{ viewTransitionName: "site-header" }}>
      {/* inline veil: Cyril's browser only honors backdrop-filter set
          inline on a plain element inside the fixed header — stylesheet
          rules on the header itself (and its ::before) silently no-op */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: -1,
          background: "color-mix(in srgb, var(--bg) 78%, transparent)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      />
      <div className={`section-shell ${styles.inner}`}>
        {sub ? (
          <Link href="/" className={`mono-label ${styles.brand}`}>
            CV
          </Link>
        ) : (
          <a href="#top" className={`mono-label ${styles.brand}`}>
            CV
          </a>
        )}
        <nav className={styles.nav} aria-label="Site">
          {(
            [
              ["Work", "#work"],
              ["About", "#about"],
              ["Contact", "#contact"],
            ] as const
          ).map(([label, hash]) =>
            sub ? (
              <Link key={hash} href={`/${hash}`} className="mono-label">
                {label}
              </Link>
            ) : (
              <a key={hash} href={hash} className="mono-label">
                {label}
              </a>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
```

If `viewTransitionName` is rejected by the installed `CSSProperties`, cast: `style={{ viewTransitionName: "site-header" } as React.CSSProperties}`.

- [ ] **Step 5: Verify**

Run: `npm run check` — clean (proves the canary reference works). `npm test` — green.
Home page must be visually unchanged: with the dev server on 3000, `node scripts/shot.mjs http://localhost:3000 <scratchpad>/t2-home.png` and compare the header/nav to current.

- [ ] **Step 6: Commit**

```bash
git add src/types/react-canary.d.ts src/app/layout.tsx src/app/globals.css src/components/sections/Header.tsx
git commit -m "feat: view-transition groundwork - canary types, scroll override, header pin + sub variant"
```

---

### Task 3: `CaseVisual` + real covers on the home cards

**Files:**
- Create: `src/components/case/CaseVisual.tsx`
- Create: `src/components/case/CaseVisual.module.css`
- Modify: `src/components/sections/CaseStudies.tsx`
- Modify: `src/components/sections/CaseStudies.module.css`

**Interfaces:**
- Consumes: `CaseStudy.cover` from Task 1.
- Produces: `CaseVisual({ cover, className }: { cover?: string; className?: string })` — the single framed-visual definition both morph endpoints render. Card keeps class `styles.visual` for sizing only.

- [ ] **Step 1: Create `src/components/case/CaseVisual.module.css`** (frame + brackets moved from `CaseStudies.module.css`, plus the fill image):

```css
/* The framed visual — the one definition rendered by BOTH morph
   endpoints (card and detail hero), so the shared-element pair is
   literally the same subtree. Sizing comes from the caller. */
.frame {
	position: relative;
	border: 1px solid var(--hairline);
	background: var(--surface);
	display: grid;
	place-items: center;
	overflow: hidden;
}

.frame::before,
.frame::after {
	content: "";
	position: absolute;
	width: 14px;
	height: 14px;
	border-color: var(--accent);
	border-style: solid;
	z-index: 1;
}

.frame::before {
	top: -1px;
	left: -1px;
	border-width: 1px 0 0 1px;
}

.frame::after {
	bottom: -1px;
	right: -1px;
	border-width: 0 1px 1px 0;
}

.img {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.caption {
	color: var(--muted);
}
```

- [ ] **Step 2: Create `src/components/case/CaseVisual.tsx`**:

```tsx
import styles from "./CaseVisual.module.css";

/** Framed case visual: cover image when the asset exists, the
    in-production caption otherwise. Decorative — meaning lives in the
    surrounding link/heading. */
export default function CaseVisual({
  cover,
  className,
}: {
  cover?: string;
  className?: string;
}) {
  return (
    <div className={`${styles.frame} ${className ?? ""}`} aria-hidden="true">
      {cover ? (
        <img src={cover} alt="" className={styles.img} />
      ) : (
        <p className={`mono-label ${styles.caption}`}>Interface visual — in production</p>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Use it on the cards** — in `src/components/sections/CaseStudies.tsx`, add `import CaseVisual from "@/components/case/CaseVisual";` and replace the aside's visual block:

```tsx
          <aside className={styles.caseAside}>
            <CaseVisual cover={c.cover} className={styles.visual} />
          </aside>
```

(The old `.visual` div with its caption goes away here.)

- [ ] **Step 4: Slim the card CSS** — in `src/components/sections/CaseStudies.module.css`, replace the whole `.visual`, `.visual::before`, `.visual::after`, `.visualCaption` rule set with sizing only:

```css
.visual {
	aspect-ratio: 16 / 10;
	width: 100%;
}
```

- [ ] **Step 5: Verify visually**

Run: `npm run check`, then `node scripts/shot.mjs http://localhost:3000 <scratchpad>/t3-covers.png 1440 900 0 1` (full-page) — the three cards must show their covers inside the hairline frame with red corner brackets.

- [ ] **Step 6: Commit**

```bash
git add src/components/case/CaseVisual.tsx src/components/case/CaseVisual.module.css src/components/sections/CaseStudies.tsx src/components/sections/CaseStudies.module.css
git commit -m "feat: shared CaseVisual frame brings real covers to the case cards"
```

---

### Task 4: Section primitives (`CaseSection`, `CaseGallery`, `CaseStats`)

**Files:**
- Create: `src/components/case/CaseSection.tsx` + `CaseSection.module.css`
- Create: `src/components/case/CaseGallery.tsx` + `CaseGallery.module.css`
- Create: `src/components/case/CaseStats.tsx` + `CaseStats.module.css`

**Interfaces:**
- Consumes: `CaseVisual` from Task 3 (gallery frames).
- Produces:
  - `CaseSection({ eyebrow, heading, mock, children }: { eyebrow: string; heading?: string; mock?: boolean; children: React.ReactNode })`
  - `CaseGallery({ images, columns }: { images: { src: string; alt: string; caption?: string }[]; columns?: 1 | 2 })`
  - `CaseStats({ stats }: { stats: { value: string; label: string }[] })`

- [ ] **Step 1: `CaseSection.tsx`**:

```tsx
import styles from "./CaseSection.module.css";

/** Labeled prose row: mono eyebrow column, free content column.
    `mock` marks scaffold copy awaiting Cyril's real words. */
export default function CaseSection({
  eyebrow,
  heading,
  mock,
  children,
}: {
  eyebrow: string;
  heading?: string;
  mock?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={`section-shell ${styles.section}`}>
      <div className={styles.grid}>
        <p className={`mono-label ${styles.eyebrow}`}>
          {eyebrow}
          {mock && <span className={styles.mockTag}>Mock</span>}
        </p>
        <div>
          {heading && <h2 className={`serif-display ${styles.heading}`}>{heading}</h2>}
          <div className={styles.body}>{children}</div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: `CaseSection.module.css`**:

```css
.section {
	border-top: 1px solid var(--hairline);
	padding-block: clamp(3.5rem, 8vh, 6rem);
}

.grid {
	display: grid;
	grid-template-columns: 14rem minmax(0, 1fr);
	gap: clamp(1.5rem, 4vw, 4rem);
	align-items: start;
}

.eyebrow {
	color: var(--muted);
	display: flex;
	gap: 0.75rem;
	align-items: baseline;
}

/* scaffold marker — muted on purpose; disappears with the real copy */
.mockTag {
	font-size: 0.6rem;
	border: 1px solid var(--hairline);
	padding: 0.1rem 0.4rem;
}

.heading {
	font-size: var(--text-h3);
	max-width: 24ch;
	margin-bottom: 1.25rem;
}

.body {
	color: var(--fg-soft);
	max-width: 60ch;
	display: flex;
	flex-direction: column;
	gap: 1em;
}

.body ul {
	padding-left: 1.1em;
	display: flex;
	flex-direction: column;
	gap: 0.5em;
}

@media (max-width: 768px) {
	.grid {
		grid-template-columns: 1fr;
	}
}
```

- [ ] **Step 3: `CaseGallery.tsx`** (`CaseVisual` already renders a covered `<img>` — reuse it, no separate image element):

```tsx
import CaseVisual from "./CaseVisual";
import styles from "./CaseGallery.module.css";

/** Framed screenshot grid. Files are distinct images (the MSIG export
    mixes webp and avif) — CaseVisual renders each as a plain covered
    <img>; captions carry the meaning. */
export default function CaseGallery({
  images,
  columns = 2,
}: {
  images: { src: string; alt: string; caption?: string }[];
  columns?: 1 | 2;
}) {
  return (
    <div className={`${styles.gallery} ${columns === 2 ? styles.cols2 : ""}`}>
      {images.map((img) => (
        <figure key={img.src} className={styles.item}>
          <CaseVisual cover={img.src} className={styles.frame} />
          {img.caption && (
            <figcaption className={`mono-label ${styles.caption}`}>{img.caption}</figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
```

(`alt` stays in the type for when real captions/alt land; `CaseVisual` is decorative today — acceptable while everything is Mock-marked.)

- [ ] **Step 4: `CaseGallery.module.css`**:

```css
.gallery {
	display: grid;
	gap: clamp(1rem, 2.5vw, 2rem);
}

.cols2 {
	grid-template-columns: repeat(2, minmax(0, 1fr));
}

.item {
	margin: 0;
}

.frame {
	aspect-ratio: 16 / 10;
	width: 100%;
}

.caption {
	color: var(--muted);
	margin-top: 0.6rem;
}

@media (max-width: 768px) {
	.cols2 {
		grid-template-columns: 1fr;
	}
}
```

- [ ] **Step 5: `CaseStats.tsx`** (the card results grid, extracted):

```tsx
import styles from "./CaseStats.module.css";

export default function CaseStats({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <div className={styles.stats}>
      {stats.map((s) => (
        <div key={s.label}>
          <p className={styles.value}>{s.value}</p>
          <p className={`mono-label ${styles.label}`}>{s.label}</p>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 6: `CaseStats.module.css`**:

```css
.stats {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 1.25rem;
}

.value {
	font-family: var(--font-serif);
	font-variation-settings:
		'opsz' 56,
		'SOFT' 30,
		'WONK' 0.9;
	font-size: clamp(1.8rem, 3vw, 2.6rem);
	color: var(--fg);
	line-height: 1;
}

.label {
	color: var(--muted);
	margin-top: 0.5rem;
}

@media (max-width: 900px) {
	.stats {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}
```

- [ ] **Step 7: Verify + commit**

Run: `npm run check` — clean (components are consumed in Task 5; tsc is the gate here).

```bash
git add src/components/case/CaseSection.tsx src/components/case/CaseSection.module.css src/components/case/CaseGallery.tsx src/components/case/CaseGallery.module.css src/components/case/CaseStats.tsx src/components/case/CaseStats.module.css
git commit -m "feat: case detail section primitives - prose row, gallery, stats"
```

---

### Task 5: Per-case content + registry

**Files:**
- Create: `src/components/case/content/creative-os.tsx`
- Create: `src/components/case/content/case-chat.tsx`
- Create: `src/components/case/content/msig.tsx`
- Create: `src/components/case/content/index.ts`

**Interfaces:**
- Consumes: `CaseSection`, `CaseGallery`, `CaseStats` (Task 4); `cases` (Task 1).
- Produces: `caseContent: Record<string, React.ComponentType>` keyed by slug — the route (Task 6) resolves `caseContent[slug]`.

All copy below is scaffold, `mock`-tagged, compressed, and inside the banned-word rules; Cyril replaces it later.

- [ ] **Step 1: `creative-os.tsx`**:

```tsx
import CaseSection from "@/components/case/CaseSection";

export default function CreativeOsContent() {
  return (
    <>
      <CaseSection eyebrow="Problem" heading="One brief, five tools, no thread." mock>
        <p>
          Producing a single shot meant moving between scripts, prompt docs,
          reference boards and multiple generation tools — each hop losing
          context the next step needed.
        </p>
      </CaseSection>
      <CaseSection eyebrow="Pain points" mock>
        <ul>
          <li>Prompt knowledge trapped in chat histories nobody could reuse.</li>
          <li>References lived apart from the shots they informed.</li>
          <li>No shared picture of a scene while it was being made.</li>
        </ul>
      </CaseSection>
      <CaseSection eyebrow="Solutions" heading="A canvas where agents do the moving." mock>
        <p>
          One production surface: agents compose shots, draft prompts, pull
          references and run image and video generation in place — the
          context travels with the work instead of the person.
        </p>
      </CaseSection>
    </>
  );
}
```

- [ ] **Step 2: `case-chat.tsx`**:

```tsx
import CaseSection from "@/components/case/CaseSection";

export default function CaseChatContent() {
  return (
    <>
      <CaseSection eyebrow="User journey" heading="Decide, get told why, go again." mock>
        <p>
          A student opens a generated clinical case, works the history and
          examination, commits to diagnostic decisions, and receives
          structured feedback on the reasoning — then repeats with a new
          case. Repetition is the product.
        </p>
      </CaseSection>
      <CaseSection eyebrow="System thinking" mock>
        <ul>
          <li>Case generator: clinically-plausible presentations on demand.</li>
          <li>Decision engine: every choice tracked against the case truth.</li>
          <li>Feedback rubric: structured, specific, never a grade alone.</li>
        </ul>
      </CaseSection>
    </>
  );
}
```

- [ ] **Step 3: `msig.tsx`** (real stats from the data; gallery from the ten shipped MSIG files):

```tsx
import CaseSection from "@/components/case/CaseSection";
import CaseGallery from "@/components/case/CaseGallery";
import CaseStats from "@/components/case/CaseStats";
import { cases } from "@/lib/data/cases";

const ops = cases.find((c) => c.slug === "msig")!;

const SCREENS = [
  "3zVXGHubwsDkSoRejI1kNsYWI.webp",
  "6YxTcGaZtqhVPfIRfuA2QpbjW8.avif",
  "6aFnlZQqdKNvKKZwx1GtpCi4m1w.webp",
  "FZH5qRxSvJSwBEKVMgkv5TzbYU.webp",
  "Rqpyj1Ih5zkdEhilndGmKU7f8I.avif",
  "a5rRn65DtRvHwOYL9MfA5fQT7I.webp",
  "e5nkT3tdjowEU0ttZEsvoSrxCLM.webp",
  "kn8Lr14RDdSdVfrbqqPrvPtW8M.avif",
  "nHwgrwHqa2DjUR57calWQgQG8.webp",
  "vyjEy11RDmS1QDnXv4S9TlqDs.webp",
].map((f) => ({
  src: `/assets/MSIG/${f}`,
  alt: "Interface screen from the internal product suite",
  caption: "Mock",
}));

export default function MsigContent() {
  return (
    <>
      <CaseSection eyebrow="Started with" mock>
        <p>
          Quoting, dispatch and scheduling lived in spreadsheets, phone
          calls and institutional memory — every handoff a place for the
          operation to slow down or drop something.
        </p>
      </CaseSection>
      <CaseSection eyebrow="Built" heading="The unglamorous software that moves a business." mock>
        <p>
          A suite of internal products covering quoting, dispatch,
          scheduling and reporting — one system per bottleneck, shipped in
          the order the operation felt them.
        </p>
      </CaseSection>
      <CaseSection eyebrow="Outcomes">
        <CaseStats stats={ops.results ?? []} />
      </CaseSection>
      <CaseSection eyebrow="Selected screens" mock>
        <CaseGallery images={SCREENS} columns={2} />
      </CaseSection>
    </>
  );
}
```

- [ ] **Step 4: `index.ts`**:

```ts
import type { ComponentType } from "react";
import CreativeOsContent from "./creative-os";
import CaseChatContent from "./case-chat";
import MsigContent from "./msig";

export const caseContent: Record<string, ComponentType> = {
  "creative-os": CreativeOsContent,
  "case-chat": CaseChatContent,
  msig: MsigContent,
};
```

- [ ] **Step 5: Verify + commit**

Run: `npm run check` — clean.

```bash
git add src/components/case/content
git commit -m "feat: per-case detail content, mock-tagged, behind a slug registry"
```

---

### Task 6: `CaseShell` + the `/work/[slug]` route

**Files:**
- Create: `src/components/case/CaseShell.tsx` + `CaseShell.module.css`
- Create: `src/app/work/[slug]/page.tsx`

**Interfaces:**
- Consumes: `CaseVisual` (Task 3), `caseContent` (Task 5), `cases`/`CaseStudy` (Task 1), `Header sub` (Task 2), `Footer` (existing at `@/components/sections/Footer`).
- Produces: routes `/work/creative-os`, `/work/case-chat`, `/work/msig`; the morph **target** named `case-visual-${slug}`.

- [ ] **Step 1: `CaseShell.module.css`**:

```css
.hero {
	position: relative;
	height: 100svh;
}

.heroVisual {
	position: absolute;
	inset: 0;
}

.fill {
	width: 100%;
	height: 100%;
}

/* readable ground for the hero text — tokens, never plain black */
.scrim {
	position: absolute;
	inset-inline: 0;
	bottom: 0;
	height: 45vh;
	background: linear-gradient(
		transparent,
		color-mix(in srgb, var(--bg) 92%, transparent)
	);
	pointer-events: none;
}

.heroText {
	position: absolute;
	inset-inline: 0;
	bottom: clamp(2rem, 6vh, 4rem);
}

.heroInner {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 1.1rem;
}

.backLink {
	color: var(--muted);
	transition: color 0.2s ease;
}

.backLink:hover {
	color: var(--fg);
}

.kicker {
	color: var(--accent);
	font-size: 0.9rem;
}

.headline {
	font-size: var(--text-statement);
	max-width: 22ch;
}

.cta {
	border-top: 1px solid var(--hairline);
	padding-block: clamp(4rem, 10vh, 7rem);
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 2rem;
}

.ctaLine {
	font-size: var(--text-h3);
	max-width: 24ch;
}

.btn {
	display: inline-block;
	border: 1px solid var(--fg);
	padding: 0.9rem 1.5rem;
	transition: background 0.2s ease, color 0.2s ease;
}

.btn:hover {
	background: var(--fg);
	color: var(--bg);
}
```

- [ ] **Step 2: `CaseShell.tsx`**:

```tsx
import Link from "next/link";
import { ViewTransition } from "react";
import type { CaseStudy } from "@/lib/data/cases";
import CaseVisual from "./CaseVisual";
import styles from "./CaseShell.module.css";

/** Shared detail template: the morph-target hero (the card's visual,
    now the whole viewport), free per-case sections, closing CTA.
    default="none" MUST keep its explicit share="morph" — dropping share
    silently kills the pair (Next view-transitions guide). */
export default function CaseShell({
  caseStudy,
  children,
}: {
  caseStudy: CaseStudy;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className={styles.hero}>
        <ViewTransition name={`case-visual-${caseStudy.slug}`} share="morph" default="none">
          <div className={styles.heroVisual}>
            <CaseVisual cover={caseStudy.cover} className={styles.fill} />
          </div>
        </ViewTransition>
        <div className={styles.scrim} aria-hidden="true" />
        <div className={styles.heroText}>
          <div className={`section-shell ${styles.heroInner}`}>
            <Link href="/#work" className={`mono-label ${styles.backLink}`}>
              ← Work
            </Link>
            <p className={`mono-label ${styles.kicker}`}>
              {caseStudy.num} / {caseStudy.category}
            </p>
            <h1 className={`serif-display ${styles.headline}`}>{caseStudy.headline}</h1>
          </div>
        </div>
      </div>

      {children}

      <section className={`section-shell ${styles.cta}`}>
        <p className={`serif-display ${styles.ctaLine}`}>
          Have a problem that doesn't fit a job title?
        </p>
        <a href="mailto:cyrilpdev@gmail.com" className={`mono-label ${styles.btn}`}>
          Start a conversation
        </a>
        <Link href="/#work" className={`mono-label ${styles.backLink}`}>
          ← All work
        </Link>
      </section>
    </>
  );
}
```

- [ ] **Step 3: `src/app/work/[slug]/page.tsx`**:

```tsx
import type { Metadata } from "next";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import CaseShell from "@/components/case/CaseShell";
import { caseContent } from "@/components/case/content";
import { cases } from "@/lib/data/cases";

/* Static export: every slug is pre-rendered; anything else 404s. */
export const dynamicParams = false;

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const c = cases.find((x) => x.slug === slug)!;
  return {
    title: `${c.headline} — Cyril Varghese`,
    description: c.built,
    openGraph: c.cover ? { images: [c.cover] } : undefined,
  };
}

export default async function CaseStudyPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const c = cases.find((x) => x.slug === slug)!;
  const Content = caseContent[slug];
  return (
    <>
      <Header sub />
      <main>
        <CaseShell caseStudy={c}>{Content ? <Content /> : null}</CaseShell>
      </main>
      <Footer />
    </>
  );
}
```

Note: `params` is a Promise in Next 16 (sync access removed); `PageProps<"/work/[slug]">` is generated into `.next` types by the build — run the build before `npm run check` the first time.

- [ ] **Step 4: Verify**

Run in order:
1. `npm run build` — succeeds; `ls out/work` shows `creative-os.html case-chat.html msig.html`.
2. `npm run check` — clean (route types now generated).
3. With the dev server on 3000: `node scripts/shot.mjs http://localhost:3000/work/msig <scratchpad>/t6-msig.png 1440 900 0 1` (full page) — hero fills the viewport with the cover + scrim + headline; sections and gallery render; CTA closes the page. Repeat for `/work/creative-os` and `/work/case-chat`.

- [ ] **Step 5: Commit**

```bash
git add src/components/case/CaseShell.tsx src/components/case/CaseShell.module.css "src/app/work/[slug]/page.tsx"
git commit -m "feat: /work/[slug] detail pages - full-viewport hero shell + static params"
```

---

### Task 7: Card morph wiring (Link + ViewTransition + reveal restructure)

**Files:**
- Modify: `src/components/sections/CaseStudies.tsx`
- Modify: `src/components/sections/CaseStudies.module.css`

**Interfaces:**
- Consumes: `CaseVisual` (Task 3), slugs (Task 1), the morph names from Task 6 (`case-visual-${slug}` — must match exactly).
- Produces: the morph **source**; real `Explore →` links.

- [ ] **Step 1: Rewire the card** — `src/components/sections/CaseStudies.tsx` becomes:

```tsx
"use client";

import Link from "next/link";
import { ViewTransition } from "react";
import { m } from "motion/react";
import { cases } from "@/lib/data/cases";
import CaseVisual from "@/components/case/CaseVisual";
import styles from "./CaseStudies.module.css";

const EASE_OUT_CUBIC = [0.215, 0.61, 0.355, 1] as const;

export default function CaseStudies() {
  return (
    <section className={`section-shell ${styles.section}`} aria-label="Selected work">
      <p className={`mono-label ${styles.sectionEyebrow}`}>Proof</p>
      <h2 className={`serif-display ${styles.sectionTitle}`}>Three shipped systems.</h2>

      {cases.map((c) => (
        /* The reveal lives on the TEXT column, not the article: a hidden
           ancestor above the ViewTransition would snapshot the visual at
           opacity 0 on back-navigation and the morph pair would never
           form. The visual is statically visible. */
        <article key={c.num} className={styles.case}>
          <m.div
            className={`${styles.caseText} fx-hidden`}
            initial={false}
            whileInView={{ opacity: 1, transform: "translateY(0px)" }}
            viewport={{ once: true, margin: "0px 0px -18% 0px" }}
            transition={{ duration: 0.55, ease: EASE_OUT_CUBIC }}
          >
            <p className={`mono-label ${styles.caseNum}`}>
              {c.num} / {c.category}
            </p>
            <h3 className={`serif-display ${styles.caseHeadline}`}>{c.headline}</h3>

            <div className={styles.row}>
              <p className={`mono-label ${styles.rowLabel}`}>Started with</p>
              <p className={styles.rowBody}>{c.startedWith}</p>
            </div>
            <div className={styles.row}>
              <p className={`mono-label ${styles.rowLabel}`}>Built</p>
              <p className={styles.rowBody}>{c.built}</p>
            </div>

            {c.results && (
              <div className={styles.results}>
                {c.results.map((r) => (
                  <div key={r.label}>
                    <p className={styles.resultValue}>{r.value}</p>
                    <p className={`mono-label ${styles.resultLabel}`}>{r.label}</p>
                  </div>
                ))}
              </div>
            )}

            <Link href={`/work/${c.slug}`} className={`mono-label ${styles.explore}`}>
              Explore →
            </Link>
          </m.div>

          <aside className={styles.caseAside}>
            <Link
              href={`/work/${c.slug}`}
              className={styles.visualLink}
              aria-label={`Open case study: ${c.headline}`}
            >
              <ViewTransition name={`case-visual-${c.slug}`} share="morph" default="none">
                <CaseVisual cover={c.cover} className={styles.visual} />
              </ViewTransition>
            </Link>
          </aside>
        </article>
      ))}
    </section>
  );
}
```

- [ ] **Step 2: CSS additions** — in `src/components/sections/CaseStudies.module.css`, replace the `.explore` rule and add `.visualLink`:

```css
.explore {
	color: var(--muted);
	margin-top: 0.5rem;
	width: fit-content;
	transition: color 0.2s ease;
}

.explore:hover {
	color: var(--fg);
}

.visualLink {
	display: block;
}
```

- [ ] **Step 3: Verify**

`npm run check` and `npm test` — green. Dev-server screenshot of the cards (`node scripts/shot.mjs http://localhost:3000 <scratchpad>/t7-cards.png 1440 900 0 1`) — layout unchanged, covers present; the text column still reveals on scroll.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/CaseStudies.tsx src/components/sections/CaseStudies.module.css
git commit -m "feat: cards link into /work pages - the visual is the morph source"
```

---

### Task 8: Production verification (morph is prod-only)

**Files:** none created — verification only.

- [ ] **Step 1: Full gates**

```bash
npm test
npm run build
npm run check
```

All green; `ls out/work` shows the three `.html` files.

- [ ] **Step 2: Serve the export** (prefetch — and therefore the morph — exists only in production):

```bash
npx serve out -l 3100
```

(`serve`'s cleanUrls maps `/work/msig` → `work/msig.html`; port 3100 avoids Cyril's dev server on 3000.)

- [ ] **Step 3: Screenshot the served pages**

```bash
node scripts/shot.mjs http://localhost:3100/ <scratchpad>/v-home.png 1440 900 0 1
node scripts/shot.mjs http://localhost:3100/work/creative-os <scratchpad>/v-creative-os.png 1440 900 0 1
node scripts/shot.mjs http://localhost:3100/work/case-chat <scratchpad>/v-case-chat.png 1440 900 0 1
node scripts/shot.mjs http://localhost:3100/work/msig <scratchpad>/v-msig.png 1440 900 0 1
node scripts/shot.mjs http://localhost:3100/work/msig <scratchpad>/v-msig-reduced.png 1440 900 1
```

Check: covers on cards; each hero fills the viewport with scrim + headline; MSIG gallery + stats render; reduced-motion page is complete and static.

- [ ] **Step 4: Manual browser pass (Cyril or implementer, on http://localhost:3100)**

- Click a card visual → it expands into the detail hero (morph plays; header does not move).
- Browser back → returns home (a reverse morph is best-effort; a plain crossfade is acceptable).
- From a detail page, header "Work" → lands on the home work section.
- Keyboard: tab reaches both the visual link (visible focus ring) and Explore →.
- Dev-mode note: `npm run dev` will NOT morph (no prefetch) — expected, not a bug.

- [ ] **Step 5: Report** — summarize results to Cyril; no push (his call).
