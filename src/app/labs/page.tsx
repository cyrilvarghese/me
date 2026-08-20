import type { Metadata } from "next";
import CaseDiagram from "@/components/case/CaseDiagram";
import styles from "./labs.module.css";

export const metadata: Metadata = {
  title: "Labs — Cyril Varghese",
  robots: { index: false },
};

const SCENES = [
  { src: "/assets/CaseChat/diagrams/scenes/classroom.svg", name: "classroom.svg" },
  { src: "/assets/CaseChat/diagrams/scenes/self-study.svg", name: "self-study.svg" },
  { src: "/assets/CaseChat/diagrams/scenes/bedside.svg", name: "bedside.svg" },
];

/** Drafting room for diagram work — never linked, never indexed. Drawings
    are rendered through CaseDiagram so they inherit the same inlining, the
    same mono voice and the same motion sheet they will have on a case
    study page; anything that looks right here looks right there. */
export default function LabsPage() {
  return (
    <main className={styles.page}>
      <p className={`mono-label ${styles.eyebrow}`}>Labs</p>
      <h1 className={`serif-display ${styles.headline}`}>Rooms instead of blocks.</h1>
      <p className={styles.rule}>
        The same pain point drawn two ways. Both obey the house rules — one hue, mono text, no
        inner frames — but one argues with labelled rectangles and the other draws the rooms a
        student actually sits in. Red is held back for the single moment that matters.
      </p>

      <p className={`mono-label ${styles.sectionLabel}`}>Scenes — diagrams/scenes</p>
      <p className={styles.rule}>
        Flat shapes, no outlines. Depth is a value step: nearest figures sit at{" "}
        <code>--muted</code>, the room behind them fades toward the rail neutral, and the
        brightest fill marks whoever the drawing is about.
      </p>
      <div className={styles.scenes}>
        {SCENES.map((s) => (
          <figure key={s.name} className={styles.scene}>
            <CaseDiagram src={s.src} />
            <figcaption className={`mono-label ${styles.name}`}>{s.name}</figcaption>
          </figure>
        ))}
      </div>

      <p className={`mono-label ${styles.sectionLabel}`}>Pain point 01 — drawn as scenes</p>
      <div className={styles.wide}>
        <CaseDiagram src="/assets/CaseChat/diagrams/01-today-scenes.svg" />
      </div>

      <p className={`mono-label ${styles.sectionLabel}`}>Pain point 01 — as it ships today</p>
      <div className={styles.wide}>
        <CaseDiagram src="/assets/CaseChat/diagrams/01-today.svg" />
      </div>
    </main>
  );
}
