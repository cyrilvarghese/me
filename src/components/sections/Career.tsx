"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./Career.module.css";

const STAGES = [
  { label: "Code", width: 26 },
  { label: "Code + Design", width: 46 },
  { label: "Code + Design + Product", width: 70 },
  { label: "Research + Product + Design + Code + AI", width: 100 },
];

export default function Career() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-bar]", {
          scaleX: 0,
          duration: 0.9,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={`section-shell ${styles.section}`} id="about" aria-label="Career">
      <h2 className={`serif-display ${styles.headline}`}>
        I didn&apos;t set out to become a generalist.
      </h2>
      <p className={styles.sub}>I kept expanding the part of the outcome I could own.</p>

      <ol className={styles.stages}>
        {STAGES.map((s) => (
          <li key={s.label}>
            <span className={`mono-label ${styles.stageLabel}`}>{s.label}</span>
            <div className={styles.bar} data-bar="" style={{ width: `${s.width}%` }} />
          </li>
        ))}
      </ol>

      <p className={`serif-display ${styles.kicker}`}>
        Expansion of ownership, <em>not career switching.</em>
      </p>
    </section>
  );
}
