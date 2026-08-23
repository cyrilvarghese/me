import type { Metadata } from "next";
import {
  BODY_FILL,
  TOOL_BACK,
  TOOL_BACK_DETAIL,
  TOOL_FRONT,
  TOOL_FRONT_DETAIL,
  EDGE_WHITE,
  EDGE_WHITE_SOFT,
  ETCH,
  RED,
  RED_DEEP,
  RED_EDGE,
  SCREW,
} from "@/components/knife/placeholders/common";
import styles from "./design.module.css";

export const metadata: Metadata = {
  title: "Design system — Cyril Varghese",
  robots: { index: false },
};

/** Reference page for the palette. Token values mirror src/app/tokens.css —
    update both together (the steels import live from the art constants). */
const TOKENS = [
  { name: "--bg", value: "#151111", note: "page ground" },
  { name: "--surface", value: "#1e1818", note: "lifted panels" },
  { name: "--fg", value: "#e7e3e1", note: "text" },
  { name: "--fg-soft", value: "#ddd8d6", note: "secondary text" },
  { name: "--muted", value: "#9e9493", note: "captions, labels" },
  { name: "--accent", value: "#ea0000", note: "signal red — decorative / large type only" },
  { name: "--accent-deep", value: "#c90000", note: "deep red — frames, needle" },
  {
    name: "--accent-lift",
    value: "#d95a5a",
    note: "red that may be text — 4.96:1, and desaturated so it stops buzzing",
  },
  { name: "--hairline", value: "rgba(248, 244, 242, 0.1)", note: "rules" },
  { name: "--hairline-red", value: "rgba(234, 0, 0, 0.28)", note: "red rules" },
];

const STEELS = [
  { name: "BODY_FILL", value: BODY_FILL, note: "knife body" },
  { name: "TOOL_BACK", value: TOOL_BACK, note: "back-layer tools" },
  { name: "TOOL_BACK_DETAIL", value: TOOL_BACK_DETAIL, note: "back tool details" },
  { name: "TOOL_FRONT", value: TOOL_FRONT, note: "front-layer tools" },
  { name: "TOOL_FRONT_DETAIL", value: TOOL_FRONT_DETAIL, note: "front tool details" },
  { name: "EDGE_WHITE", value: EDGE_WHITE, note: "steel edge highlight" },
  { name: "EDGE_WHITE_SOFT", value: EDGE_WHITE_SOFT, note: "soft edge highlight" },
  { name: "ETCH", value: ETCH, note: "plate etching" },
  { name: "RED", value: RED, note: "blade tips" },
  { name: "RED_DEEP", value: RED_DEEP, note: "deep red accents" },
  { name: "RED_EDGE", value: RED_EDGE, note: "blade edge line" },
  { name: "SCREW", value: SCREW, note: "pivot screws" },
];

/** The type ladder, mirrored from src/app/tokens.css — update both together.
    `px` is what the rung renders at; a clamp shows its two ends. */
const TYPE = [
  { name: "--text-display", px: "44 → 104", voice: "serif", usage: "hero line, one per page" },
  { name: "--text-statement", px: "32 → 68", voice: "serif", usage: "section statement, case headline" },
  { name: "--text-h3", px: "21.6 → 32", voice: "serif", usage: "band heading" },
  { name: "--text-quote", px: "20", voice: "mono", usage: "a quote pulled into a figure" },
  { name: "--text-body", px: "16 → 18", voice: "sans", usage: "running text, 45–75ch" },
  { name: "--text-sublabel", px: "15", voice: "sans", usage: "a name or value under a mark" },
  { name: "--text-small", px: "14", voice: "sans", usage: "captions, running detail" },
  { name: "--text-caption", px: "13", voice: "sans", usage: "labels inside a figure" },
  { name: "--text-label", px: "12", voice: "mono", usage: "eyebrows, control labels" },
  { name: "--text-fine", px: "11", voice: "mono", usage: "smallest mark on the page — the floor" },
];

const VOICE_CLASS: Record<string, string> = {
  serif: "serif-display",
  mono: "mono-label",
  sans: "",
};

function Swatches({ items }: { items: { name: string; value: string; note: string }[] }) {
  return (
    <div className={styles.grid}>
      {items.map((c) => (
        <div key={c.name} className={styles.swatch}>
          <div className={styles.chip}>
            <div style={{ background: c.value }} />
          </div>
          <div className={styles.meta}>
            <p className={`mono-label ${styles.name}`}>{c.name}</p>
            <p className={`mono-label ${styles.value}`}>{c.value}</p>
            <p className={styles.note}>{c.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function TypeScale() {
  return (
    <div className={styles.typeList}>
      {TYPE.map((t) => (
        <div key={t.name} className={styles.typeRow}>
          <div className={styles.specimenBox}>
            <span
              className={`${VOICE_CLASS[t.voice]} ${styles.specimen}`}
              style={{ fontSize: `var(${t.name})` }}
            >
              {t.name.replace("--text-", "")}
            </span>
          </div>
          <div className={styles.typeMeta}>
            <p className={`mono-label ${styles.name}`}>{t.name}</p>
            <p className={`mono-label ${styles.value}`}>{t.px}&nbsp;px</p>
            <p className={styles.note}>{t.usage}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <main className={styles.page}>
      <p className={`mono-label ${styles.eyebrow}`}>Design system</p>
      <h1 className={`serif-display ${styles.headline}`}>Black, white, red — warmed.</h1>
      <p className={styles.rule}>
        Every neutral carries a ~2% blend toward the accent at constant lightness — never plain
        black or plain white. <code>--accent</code> is decorative and large-type only — 4.02:1,
        under the AA floor. <code>--accent-lift</code> is the one red that may be running text:
        4.96:1 here, 4.64:1 on <code>--surface</code>, and desaturated to 63% so it stops buzzing
        against the dark. Contrast is only one axis on this ground.
      </p>

      <p className={`mono-label ${styles.sectionLabel}`}>Core tokens — tokens.css</p>
      <Swatches items={TOKENS} />

      <p className={`mono-label ${styles.sectionLabel}`}>Knife art — placeholders/common.ts</p>
      <Swatches items={STEELS} />

      <p className={`mono-label ${styles.sectionLabel}`}>Type — tokens.css</p>
      <p className={styles.rule}>
        Ten rungs, top to bottom. Everything the reader reads comes from one of them; a size off
        the ladder carries a comment saying why. The scale is set for reading rather than for
        interface density — body runs 16–18&nbsp;px on a 45–75&nbsp;ch measure, and 11&nbsp;px is
        the floor for the short labels below it. Display lines composed against the viewport, and
        glyphs sized as geometry rather than type, sit outside it.
      </p>
      <TypeScale />
      <p className={styles.rule}>
        Diagrams are standalone SVG files and cannot read these variables, so they carry the same
        rungs in viewBox units: 20 quote, 15 sublabel, 14 small, 13 caption, 12 label, at 1:1
        render. Multiply by viewBox width ÷ rendered width when the two differ. The table lives in
        the <code>case-study-diagrams</code> skill.
      </p>

      <p className={`mono-label ${styles.sectionLabel}`}>Geometry — tokens.css</p>

      <p className={styles.rule}>
        Square-cornered by system. The only rounding is the 2&nbsp;px hairline on knife plates and
        etched panels — nothing on this site is pill-shaped.
      </p>
      <div className={styles.grid}>
        {[
          { name: "--radius", value: "0", note: "every panel, frame and control" },
          { name: "--radius-sm", value: "2px", note: "knife plates, etched panels" },
        ].map((r) => (
          <div key={r.name} className={styles.swatch}>
            <div className={styles.geo}>
              <div style={{ borderRadius: r.value }} />
            </div>
            <div className={styles.meta}>
              <p className={`mono-label ${styles.name}`}>{r.name}</p>
              <p className={`mono-label ${styles.value}`}>{r.value}</p>
              <p className={styles.note}>{r.note}</p>
            </div>
          </div>
        ))}
      </div>

      <p className={`mono-label ${styles.sectionLabel}`}>Controls — .btn voices in globals.css</p>
      <p className={styles.rule}>
        One geometry for every button, link-button and icon control: accent outline, square
        corners, fills with the accent on hover. Pair with <code>.mono-label</code> for the label.
        Variants are <code>.btn-ghost</code> (quiet, hairline border) and <code>.btn-icon</code>{" "}
        (square, <code>--control-size</code>).
      </p>
      <p className={styles.rule}>
        A finger is not a cursor. Where the pointer is coarse — or the viewport is phone width —
        every <code>.btn</code> grows its <em>target</em> to <code>--control-touch</code> (3.5rem)
        while the control itself stays <code>--control-size</code> (2.75rem). Nothing on screen
        changes size; nothing gets easier to miss. It is an overlay rather than padding, so the
        border and the label stay where they were aligned. Anything that is not a{" "}
        <code>.btn</code> — a scroll chevron, a bare icon — opts in with{" "}
        <code>.touch-target</code>.
      </p>
      <div className={styles.controls}>
        <span className="mono-label btn">Start a conversation</span>
        <span className="mono-label btn btn-ghost">Secondary</span>
        <span className="mono-label btn btn-icon" aria-hidden="true">
          ×
        </span>
      </div>

      <p className={`mono-label ${styles.sectionLabel}`}>Links — .link voices in globals.css</p>
      <p className={styles.rule}>
        A link in running copy is not a control, so it does not take the{" "}
        <code>.btn</code> geometry. It is the lifted red on a hairline of the same hue, both
        coming up to the signal red on hover: <code>--accent-lift</code> rather than{" "}
        <code>--accent</code> because a link is lower case at reading size, where the signal red
        misses AA. The light room re-rungs that token itself, so a link needs no{" "}
        <code>[data-theme]</code> branch of its own.
      </p>
      <p className={styles.rule}>
        The variant is <code>.link-mark</code>, for a link that carries a glyph — the rule moves
        onto a <code>.link-label</code> child so the mark beside it stays clear of the line.{" "}
        <code>.link</code> deliberately sets no <code>display</code>: the voice is colour and
        motion, and where the link sits — inline, a block with a margin above it, centred under a
        picture — belongs to the component.
      </p>
      <p className={styles.rule}>
        Both press on <code>:active</code> with the same <code>scale(0.97)</code> over 100ms as{" "}
        <code>.btn</code>, and both drop it under reduced motion. Press depth is constant{" "}
        <em>travel</em>, not a constant ratio — 0.97 of a 15px line is about a pixel and a half.
        Anything substantially larger tunes its own scale down to match, which is why About&apos;s
        portrait disc presses at 0.995 rather than 0.97.
      </p>
      <div className={styles.controls}>
        <span className="mono-label link">My journey so far &rarr;</span>
        <span className="mono-label link-mark">
          <span className="link-label">View CV</span>
        </span>
      </div>
    </main>
  );
}
