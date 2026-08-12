"use client";

import { useRef } from "react";
import { cases } from "@/lib/data/cases";
import { gsap, useGSAP } from "@/lib/gsap";
import ToolDots from "./ToolDots";
import styles from "./CaseStudies.module.css";

export default function CaseStudies() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-case]").forEach((el) => {
          gsap.from(el, {
            autoAlpha: 0,
            y: 32,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 78%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={`section-shell ${styles.section}`} aria-label="Selected work">
      <p className={`mono-label ${styles.sectionEyebrow}`}>Proof</p>
      <h2 className={`serif-display ${styles.sectionTitle}`}>Three shipped systems.</h2>

      {cases.map((c) => (
        <article key={c.num} className={styles.case} data-case="">
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
            <div className={styles.visual} aria-hidden="true">
              <p className={`mono-label ${styles.visualCaption}`}>Interface visual — in production</p>
            </div>
            <ToolDots tools={c.tools} />
          </aside>
        </article>
      ))}
    </section>
  );
}
