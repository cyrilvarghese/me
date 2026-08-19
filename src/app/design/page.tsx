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

export default function DesignSystemPage() {
  return (
    <main className={styles.page}>
      <p className={`mono-label ${styles.eyebrow}`}>Design system</p>
      <h1 className={`serif-display ${styles.headline}`}>Black, white, red — warmed.</h1>
      <p className={styles.rule}>
        Every neutral carries a ~2% blend toward the accent at constant lightness — never plain
        black or plain white. Red is decorative and large-type only; it fails AA contrast for
        small text on this ground.
      </p>

      <p className={`mono-label ${styles.sectionLabel}`}>Core tokens — tokens.css</p>
      <Swatches items={TOKENS} />

      <p className={`mono-label ${styles.sectionLabel}`}>Knife art — placeholders/common.ts</p>
      <Swatches items={STEELS} />

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
      <div className={styles.controls}>
        <span className="mono-label btn">Start a conversation</span>
        <span className="mono-label btn btn-ghost">Secondary</span>
        <span className="mono-label btn btn-icon" aria-hidden="true">
          ×
        </span>
      </div>
    </main>
  );
}
