"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./UnknownProblem.module.css";

const PAIRS = [
  { q: "Agentic system?", a: "Build it." },
  { q: "New market?", a: "Understand it." },
  { q: "Need someone?", a: "Find them." },
  { q: "Unknown industry?", a: "Learn fast." },
];

export default function UnknownProblem() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            autoAlpha: 0,
            y: 40,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 75%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Unknown problems">
      <div className={styles.block}>
        <h2 className={`serif-display ${styles.question}`} data-reveal="">
          What if I&apos;ve never done it before?
        </h2>
      </div>

      <div className={styles.block}>
        <p className={`serif-display ${styles.good}`} data-reveal="">
          Good.
        </p>
      </div>

      <div className={styles.block}>
        <p className={styles.resolve} data-reveal="">
          I&apos;ll understand the problem, find the people who know what I don&apos;t, build a model
          of how it works, and start moving.
        </p>
      </div>

      <ul className={styles.pairs}>
        {PAIRS.map((p) => (
          <li key={p.q} data-reveal="">
            <p className={`mono-label ${styles.pairQ}`}>{p.q}</p>
            <p className={styles.pairA}>{p.a}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
