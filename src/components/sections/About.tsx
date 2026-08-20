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

      <div className={styles.intro}>
        <div>
          <h2 className={`serif-display ${styles.title}`}>
            Where design meets code: creating products that scale from 0&rarr;1
          </h2>
          <p className={styles.lede}>
            From sketching stories as a kid to designing products as a designer, that
            same sense of <strong>curiosity and wonder still drives my work</strong>.
          </p>
          <p className={styles.lede}>
            With a background spanning product design, engineering and storytelling,
            I&apos;m now a{" "}
            <strong>
              digital product design engineer exploring how AI can reshape the way we
              learn, build and solve problems
            </strong>
            .
          </p>
        </div>
        {/* width/height are the real intrinsic size of the file: the box is
            reserved before the image lands, so the timeline below it never
            jumps. next/image is not in play here — the export is static and
            images are unoptimized, so every asset is pre-sized by hand. */}
        <div className={styles.portraitFrame}>
          <span className={styles.glow} aria-hidden="true" />
          <img
            src="/assets/profile.webp"
            width={1100}
            height={1100}
            alt='Cyril at a pottery wheel in a workshop, marked "me" in the photograph.'
            className={styles.portrait}
          />
        </div>
      </div>

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
