"use client";

import { m } from "motion/react";
import styles from "./Career.module.css";

const STAGES = [
  { label: "Code", width: 26 },
  { label: "Code + Design", width: 46 },
  { label: "Code + Design + Product", width: 70 },
  { label: "Research + Product + Design + Code + AI", width: 100 },
];

const EASE_OUT_QUART = [0.165, 0.84, 0.44, 1] as const;

export default function Career() {
  return (
    <section className={`section-shell ${styles.section}`} id="about" aria-label="Career">
      <h2 className={`serif-display ${styles.headline}`}>
        I didn&apos;t set out to become a generalist.
      </h2>
      <p className={styles.sub}>I kept expanding the part of the outcome I could own.</p>

      <ol className={styles.stages}>
        {STAGES.map((s, i) => (
          <li key={s.label}>
            <span className={`mono-label ${styles.stageLabel}`}>{s.label}</span>
            <m.div
              className={`${styles.bar} fx-hidden`}
              style={{ width: `${s.width}%`, ["--fx-from" as string]: "scaleX(0)" }}
              initial={false}
              whileInView={{ opacity: 1, transform: "scaleX(1)" }}
              viewport={{ once: true, margin: "0px 0px -30% 0px" }}
              transition={{ duration: 0.7, ease: EASE_OUT_QUART, delay: i * 0.12 }}
            />
          </li>
        ))}
      </ol>

      <p className={`serif-display ${styles.kicker}`}>
        Expansion of ownership, <em>not career switching.</em>
      </p>
    </section>
  );
}
