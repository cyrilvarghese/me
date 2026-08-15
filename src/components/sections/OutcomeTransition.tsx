"use client";

import { useRef } from "react";
import { capabilities, type CapabilityId } from "@/lib/data/capabilities";
import { gsap, useGSAP } from "@/lib/gsap";
import KnifeCanvas from "@/components/knife/KnifeCanvas";
import ToolLabels from "@/components/knife/ToolLabels";
import CompassRose from "@/components/compass/CompassRose";
import styles from "./OutcomeTransition.module.css";

const OPEN_ANGLES = Object.fromEntries(capabilities.map((c) => [c.id, c.openAngle]));

/** Where each discipline circle is born: its blade-tip position (% of the box). */
const START: Record<CapabilityId, { x: number; y: number }> = {
  research: { x: 39, y: 24 },
  product: { x: 21, y: 36 },
  design: { x: 13, y: 50 },
  code: { x: 15, y: 79 },
  ai: { x: 25, y: 90 },
  gtm: { x: 44, y: 95 },
};

/** Overlapping cluster: six circles on a small hexagon around center. */
const CLUSTER_R = 10;

/**
 * The metaphor turns (user direction, 2026-08-15): the tool kit dissolves
 * into six overlapping discipline circles, the circles merge into one ring,
 * and the ring becomes a compass — tools give way to navigation. Travel is
 * the metaphor from here to the CTA.
 */
export default function OutcomeTransition() {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const inner = innerRef.current;
        if (!inner) return;
        const frac = (pct: number) => () => (pct / 100) * inner.offsetWidth;

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        });

        tl.to({}, { duration: 1 }, 0);

        const circles = gsap.utils.toArray<HTMLElement>("[data-circle]");
        circles.forEach((el) => gsap.set(el, { xPercent: -50, yPercent: -50, scale: 0.4 }));
        gsap.set("[data-compass]", { scale: 0.92 });
        gsap.set("[data-needle]", { rotation: -130, svgOrigin: "500 500" });
        gsap.set("[data-statement]", { y: 16 });

        // knife exits: labels, blades, then the rest
        tl.to("[data-label]", { autoAlpha: 0, duration: 0.06, stagger: 0.01, ease: "power2.in" }, 0.08);
        tl.to("[data-tool]", { autoAlpha: 0, duration: 0.1, stagger: 0.012, ease: "power2.in" }, 0.18);
        tl.to("[data-knife-el]", { autoAlpha: 0, duration: 0.1, ease: "power2.in" }, 0.28);

        // circles are born at the blade tips
        tl.to(
          "[data-circle]",
          { autoAlpha: 1, scale: 1, duration: 0.08, stagger: 0.014, ease: "power2.out" },
          0.2
        );

        // converge into an overlapping cluster, then merge into one ring
        circles.forEach((el, k) => {
          const id = el.dataset.circle as CapabilityId;
          const s = START[id];
          const a = ((k * 60 - 90) * Math.PI) / 180;
          const cl = { x: 50 + CLUSTER_R * Math.cos(a), y: 50 + CLUSTER_R * Math.sin(a) };

          tl.to(el, { x: frac(cl.x - s.x), y: frac(cl.y - s.y), duration: 0.16, ease: "power2.inOut" }, 0.34);
          tl.to(el, { x: frac(50 - s.x), y: frac(50 - s.y), duration: 0.12, ease: "power2.inOut" }, 0.56);
          if (k > 0) tl.to(el, { autoAlpha: 0, duration: 0.05, ease: "power2.in" }, 0.64);
        });

        // the last circle grows into the compass ring
        tl.to(circles[0], { scale: 1.9, duration: 0.12, ease: "power2.inOut" }, 0.58);
        tl.to(circles[0], { autoAlpha: 0, duration: 0.05 }, 0.7);
        tl.to("[data-compass]", { autoAlpha: 1, scale: 1, duration: 0.08, ease: "power2.out" }, 0.66);

        // needle finds north — same mechanical settle as the blades.
        // svgOrigin on every tween: invalidateOnRefresh re-parses transforms,
        // and without it GSAP re-derives the pivot from the rotated bbox.
        tl.to(
          "[data-needle]",
          { rotation: 10, svgOrigin: "500 500", duration: 0.12, ease: "power3.inOut" },
          0.72
        ).to(
          "[data-needle]",
          { rotation: 0, svgOrigin: "500 500", duration: 0.05, ease: "power1.out" },
          0.84
        );

        // copy
        tl.to("[data-statement='tools']", { autoAlpha: 1, y: 0, duration: 0.06, ease: "power2.out" }, 0.36)
          .to("[data-statement='tools']", { autoAlpha: 0, y: -16, duration: 0.05, ease: "power2.in" }, 0.52);
        tl.to("[data-statement='outcomes']", { autoAlpha: 1, y: 0, duration: 0.07, ease: "power2.out" }, 0.76);
        tl.to("[data-statement='navigate']", { autoAlpha: 1, duration: 0.05, ease: "power2.out" }, 0.88);
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.section} aria-label="From tools to navigation">
      <div className={styles.stage}>
        <div className={styles.inner} ref={innerRef}>
          <div className={styles.knifeEl} data-knife-el="">
            <KnifeCanvas angles={OPEN_ANGLES} />
            <ToolLabels visible />
          </div>

          <div className={styles.circles} aria-hidden="true">
            {capabilities.map((c) => (
              <div
                key={c.id}
                data-circle={c.id}
                className={styles.circle}
                style={{ left: `${START[c.id].x}%`, top: `${START[c.id].y}%` }}
              >
                <svg viewBox="0 0 100 100" fill="none">
                  <circle cx="50" cy="50" r="48" stroke="rgba(248,248,248,0.4)" strokeWidth="1.2" />
                  <circle cx="50" cy="50" r="48" stroke="rgba(234,0,0,0.18)" strokeWidth="0.4" />
                </svg>
              </div>
            ))}
          </div>

          <div className={styles.compassWrap} data-compass="" aria-hidden="true">
            <div>
              <CompassRose />
            </div>
          </div>
        </div>

        <div className={styles.copy}>
          <h2 className={`serif-display ${styles.statement}`} data-statement="tools">
            Tools aren&apos;t the point.
          </h2>
          <h2 className={`serif-display ${styles.statement}`} data-statement="outcomes">
            <em>Outcomes</em> are.
          </h2>
          <p className={styles.navigate} data-statement="navigate">
            I navigate to them.
          </p>
        </div>
      </div>
    </section>
  );
}
