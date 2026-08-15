"use client";

import { Fragment } from "react";
import { m } from "motion/react";
import styles from "./OperatingModel.module.css";

const STEPS = [
  { name: "Understand", copy: "What is actually happening?" },
  { name: "Frame", copy: "What outcome matters?" },
  { name: "Make", copy: "Build the smallest thing capable of testing the idea." },
  { name: "Ship", copy: "Put something real in people's hands." },
  { name: "Learn", copy: "Observe behaviour and improve the model." },
];

const EASE_OUT_CUBIC = [0.215, 0.61, 0.355, 1] as const;

/* Hidden start state comes from .fx-hidden in globals.css (gated behind
   prefers-reduced-motion: no-preference), so variants only define "show". */
const stepVariants = {
  show: {
    opacity: 1,
    transform: "translateY(0px)",
    transition: { duration: 0.45, ease: EASE_OUT_CUBIC },
  },
};

export default function OperatingModel() {
  return (
    <section className={`section-shell ${styles.section}`} aria-label="Operating model">
      <h2 className={`serif-display ${styles.headline}`}>I work backwards from the outcome.</h2>

      <m.ol
        className={styles.loop}
        initial={false}
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -22% 0px" }}
        transition={{ staggerChildren: 0.08 }}
      >
        {STEPS.map((s, i) => (
          <Fragment key={s.name}>
            {i > 0 && (
              <li className={styles.arrow} aria-hidden="true">
                →
              </li>
            )}
            <m.li
              className={`${styles.step} fx-hidden`}
              style={{ ["--fx-from" as string]: "translateY(20px)" }}
              variants={stepVariants}
            >
              <span className={`mono-label ${styles.stepName}`}>{s.name}</span>
              <p className={styles.stepCopy}>{s.copy}</p>
            </m.li>
          </Fragment>
        ))}
      </m.ol>

      <div className={styles.returnPath} aria-hidden="true" />

      <p className={`serif-display ${styles.footerLine}`}>
        Different tools. <em>Same loop.</em>
      </p>
    </section>
  );
}
