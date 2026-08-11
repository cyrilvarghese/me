"use client";

import { useRef } from "react";
import { capabilities } from "@/lib/data/capabilities";
import { gsap, useGSAP } from "@/lib/gsap";
import KnifeCanvas from "@/components/knife/KnifeCanvas";
import ToolLabels from "@/components/knife/ToolLabels";
import styles from "./OutcomeTransition.module.css";

const OPEN_ANGLES = Object.fromEntries(capabilities.map((c) => [c.id, c.openAngle]));

/**
 * Spec §20: the metaphor turns on itself. The fully-open knife dissolves in
 * layer order (labels → blades → body) until only typography remains.
 */
export default function OutcomeTransition() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.4,
          },
        });

        tl.to({}, { duration: 1 }, 0);

        tl.to("[data-label]", { autoAlpha: 0, duration: 0.1, ease: "power2.in", stagger: 0.012 }, 0.14);
        tl.to("[data-tool]", { autoAlpha: 0, duration: 0.14, ease: "power2.in", stagger: 0.018 }, 0.28);
        tl.to("[data-knife-static]", { autoAlpha: 0, duration: 0.12, ease: "power2.in" }, 0.5);

        tl.to("[data-statement='tools']", { autoAlpha: 1, y: 0, duration: 0.08, ease: "power2.out" }, 0.56)
          .to("[data-statement='tools']", { autoAlpha: 0, y: -20, duration: 0.06, ease: "power2.in" }, 0.74);
        tl.to("[data-statement='outcomes']", { autoAlpha: 1, y: 0, duration: 0.08, ease: "power2.out" }, 0.84);
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Tools are not the point">
      <div className={styles.stage}>
        <div className={styles.knifeWrap} data-knife-static="">
          <div>
            <KnifeCanvas angles={OPEN_ANGLES} />
            <ToolLabels visible />
          </div>
        </div>
        <h2 className={`serif-display ${styles.statement}`} data-statement="tools">
          Tools aren&apos;t the point.
        </h2>
        <h2 className={`serif-display ${styles.statement}`} data-statement="outcomes">
          <span>
            <em>Outcomes</em> are.
          </span>
        </h2>
      </div>
    </section>
  );
}
