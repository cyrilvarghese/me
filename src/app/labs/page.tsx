import type { Metadata } from "next";
import CaseDiagram from "@/components/case/CaseDiagram";
import CaseVoices from "@/components/case/CaseVoices";
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

      <p className={`mono-label ${styles.sectionLabel}`}>Research — supplied icons, house text and rails</p>
      <p className={styles.rule}>
        Where a drawing would be slower than a mark the reader already knows, the persona is a
        supplied icon on a light disc. Everything around it is the house: mono quotes, the dotted
        rail, and the accent on the clause each quote turns on.
      </p>
      <CaseVoices
        eyebrow="What we heard"
        heading="Both sides name the same gap."
        lede="Students describe theory they cannot apply and exams they do not feel ready for. Their teachers agree that cases are the answer, and cannot find the hours to build them."
        groups={[
          {
            icon: "/assets/CaseChat/icons/students.png",
            label: "Student",
            quotes: [
              {
                text: "I am not confident in my clinical exams and they are very stressful",
                mark: "not confident in my clinical exams",
              },
              { text: "Lectures are lengthy and boring", mark: "boring" },
              {
                text: "We often have to refer 4000 page textbooks to make sense of the concepts",
                mark: "have to refer 4000 page textbooks",
              },
              {
                text: "I don't know how this applies to the real world",
                mark: "don't know how this applies",
              },
            ],
          },
          {
            icon: "/assets/CaseChat/icons/doctor-teachers.png",
            label: "Doctor",
            quotes: [
              {
                text: "Cases are the most important method of teaching I can think of but students don't get enough practice",
                mark: "but students don't get enough practice",
              },
              {
                text: "I don't have the time needed to prepare cases for my classroom teaching",
                mark: "don't have the time needed",
              },
            ],
          },
        ]}
      />
    </main>
  );
}
