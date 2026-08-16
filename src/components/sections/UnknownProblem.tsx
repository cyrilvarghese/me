"use client";

import { m } from "motion/react";
import styles from "./UnknownProblem.module.css";

const PAIRS = [
  { q: "Agentic system?", a: "Build it." },
  { q: "New market?", a: "Understand it." },
  { q: "Need someone?", a: "Find them." },
  { q: "Unknown industry?", a: "Learn fast." },
];

const EASE_OUT_CUBIC = [0.215, 0.61, 0.355, 1] as const;

/* Hidden start state comes from .fx-hidden (globals.css), gated behind
   prefers-reduced-motion: no-preference — so reduced users see everything. */
const reveal = {
  show: {
    opacity: 1,
    transform: "translateY(0px)",
    transition: { duration: 0.6, ease: EASE_OUT_CUBIC },
  },
};

const viewport = { once: true, margin: "0px 0px -22% 0px" };
const fromY32 = { ["--fx-from" as string]: "translateY(32px)" };

export default function UnknownProblem() {
  return (
    <section className={styles.section} aria-label="Unknown problems">
      <div className={styles.block}>
        <m.h2
          className={`serif-display ${styles.question} fx-hidden`}
          style={fromY32}
          variants={reveal}
          initial={false}
          whileInView="show"
          viewport={viewport}
        >
          What if I&apos;ve never done it before?
        </m.h2>
      </div>

      <div className={styles.block}>
        <m.p
          className={`serif-display ${styles.good} fx-hidden`}
          style={fromY32}
          variants={reveal}
          initial={false}
          whileInView="show"
          viewport={viewport}
        >
          Good.
        </m.p>
      </div>

      <div className={styles.block}>
        <m.p
          className={`${styles.resolve} fx-hidden`}
          style={fromY32}
          variants={reveal}
          initial={false}
          whileInView="show"
          viewport={viewport}
        >
          Learning is one of my core strengths — I&apos;ll understand the problem, find the people
          who know what I don&apos;t, build a model of how it works, and start moving.
        </m.p>
      </div>

      <m.ul
        className={styles.pairs}
        initial={false}
        whileInView="show"
        viewport={viewport}
        transition={{ staggerChildren: 0.06 }}
      >
        {PAIRS.map((p) => (
          <m.li key={p.q} className="fx-hidden" style={fromY32} variants={reveal}>
            <p className={`mono-label ${styles.pairQ}`}>{p.q}</p>
            <p className={styles.pairA}>{p.a}</p>
          </m.li>
        ))}
      </m.ul>
    </section>
  );
}
