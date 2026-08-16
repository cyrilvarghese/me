"use client";

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
        <m.article
          key={c.num}
          className={`${styles.case} fx-hidden`}
          initial={false}
          whileInView={{ opacity: 1, transform: "translateY(0px)" }}
          viewport={{ once: true, margin: "0px 0px -18% 0px" }}
          transition={{ duration: 0.55, ease: EASE_OUT_CUBIC }}
        >
          <div className={styles.caseText}>
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

            <p className={`mono-label ${styles.explore}`} title="Case study pages coming soon">
              Explore →
            </p>
          </div>

          <aside className={styles.caseAside}>
            <CaseVisual cover={c.cover} className={styles.visual} />
          </aside>
        </m.article>
      ))}
    </section>
  );
}
