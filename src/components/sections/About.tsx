"use client";

import { m } from "motion/react";
import { experience } from "@/lib/data/experience";
import styles from "./About.module.css";

const EASE_OUT_CUBIC = [0.215, 0.61, 0.355, 1] as const;

/* Hidden start state comes from .fx-hidden (globals.css), gated behind
   prefers-reduced-motion: no-preference — so reduced users get the
   whole timeline straight from CSS, with no initial prop to undo. */
const fromY24 = { ["--fx-from" as string]: "translateY(24px)" };
const viewport = { once: true, margin: "0px 0px -18% 0px" };

export default function About() {
  return (
    <section className={`section-shell ${styles.section}`} id="about" aria-label="About">
      <p className={`mono-label ${styles.eyebrow}`}>About</p>
      <h2 className={`serif-display ${styles.title}`}>
        Sixteen years across engineering, design and product.
      </h2>
      <p className={styles.lede}>
        I work best in small teams with real ownership, on problems that are still being
        defined.
      </p>

      <ol className={styles.timeline}>
        {experience.map((role, i) => (
          <m.li
            key={role.title + role.from}
            className={`${styles.entry} fx-hidden`}
            style={fromY24}
            initial={false}
            whileInView={{ opacity: 1, transform: "translateY(0px)" }}
            viewport={viewport}
            transition={{ duration: 0.5, ease: EASE_OUT_CUBIC, delay: i * 0.08 }}
          >
            <p className={`mono-label ${styles.years}`}>{role.years}</p>
            {/* the rung: the dot sits on the rule that runs the column, and
                only the running role's dot is filled */}
            <span
              className={`${styles.dot} ${i === 0 ? styles.dotNow : ""}`}
              aria-hidden="true"
            />
            <div className={styles.detail}>
              <h3 className={styles.role}>{role.title}</h3>
              <p className={`mono-label ${styles.org}`}>{role.org}</p>
              {role.body && <p className={styles.body}>{role.body}</p>}
              <p className={`mono-label ${styles.tools}`}>{role.tools.join(" · ")}</p>
            </div>
          </m.li>
        ))}
      </ol>
    </section>
  );
}
