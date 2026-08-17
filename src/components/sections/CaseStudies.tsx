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
