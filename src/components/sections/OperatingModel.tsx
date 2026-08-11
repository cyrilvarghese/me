"use client";

import { Fragment, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./OperatingModel.module.css";

const STEPS = [
  { name: "Understand", copy: "What is actually happening?" },
  { name: "Frame", copy: "What outcome matters?" },
  { name: "Make", copy: "Build the smallest thing capable of testing the idea." },
  { name: "Ship", copy: "Put something real in people's hands." },
  { name: "Learn", copy: "Observe behaviour and improve the model." },
];

export default function OperatingModel() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-step]", {
          autoAlpha: 0,
          y: 24,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={`section-shell ${styles.section}`} aria-label="Operating model">
      <h2 className={`serif-display ${styles.headline}`}>I work backwards from the outcome.</h2>

      <ol className={styles.loop}>
        {STEPS.map((s, i) => (
          <Fragment key={s.name}>
            {i > 0 && (
              <li className={styles.arrow} aria-hidden="true">
                →
              </li>
            )}
            <li className={styles.step} data-step="">
              <span className={`mono-label ${styles.stepName}`}>{s.name}</span>
              <p className={styles.stepCopy}>{s.copy}</p>
            </li>
          </Fragment>
        ))}
      </ol>

      <div className={styles.returnPath} aria-hidden="true" />

      <p className={`serif-display ${styles.footerLine}`}>
        Different tools. <em>Same loop.</em>
      </p>
    </section>
  );
}
