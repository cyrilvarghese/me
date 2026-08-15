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
 * The metaphor turns (user direction, 2026-08-15): the tool kit comes
 * apart, the parts stand side by side in a lineup — each with its years
 * and one line of history (user sketch) — then dissolve into overlapping
 * discipline circles that merge into a compass. Travel from here on.
 */
export default function OutcomeTransition() {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          motionOk: "(prefers-reduced-motion: no-preference)",
          compact: "(max-width: 768px)",
        },
        (ctx) => {
          const { motionOk, compact } = ctx.conditions as { motionOk: boolean; compact: boolean };
          if (!motionOk) return;
          const inner = innerRef.current;
          const stage = stageRef.current;
          if (!inner || !stage) return;

          const S = () => inner.offsetWidth;
          const frac = (pct: number) => () => (pct / 100) * S();
          /** x of lineup column k's center, relative to the stage. */
          const colX = (k: number) => {
            const W = Math.min(0.92 * stage.clientWidth, 1200);
            return stage.clientWidth / 2 - W / 2 + (k + 0.5) * (W / 6);
          };
          const innerLeft = () => (stage.clientWidth - S()) / 2;

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
          gsap.set("[data-needle]", { rotation: -130 });
          gsap.set("[data-statement]", { y: 16 });

          // labels go first, then the body dissolves out from under the tools
          tl.to("[data-label]", { autoAlpha: 0, duration: 0.05, stagger: 0.008, ease: "power2.in" }, 0.06);
          tl.to("[data-body]", { autoAlpha: 0, duration: 0.08, ease: "power2.in" }, 0.12);

          // the tools come apart, drifting free (user reference)
          const HINGE = { x: 50.5, y: 63 };
          const tools = gsap.utils.toArray<HTMLElement>("[data-tool]");
          tools.forEach((el) => {
            const id = el.dataset.tool as CapabilityId;
            const cap = capabilities.find((c) => c.id === id);
            if (!cap) return;
            const dir = { x: START[id].x - HINGE.x, y: START[id].y - HINGE.y };
            const len = Math.hypot(dir.x, dir.y) || 1;
            tl.to(
              el,
              {
                x: frac((dir.x / len) * 12),
                y: frac((dir.y / len) * 12),
                rotation: cap.openAngle + 12 * Math.sign(cap.openAngle),
                duration: 0.12,
                ease: "power2.out",
              },
              0.1
            );
          });

          if (!compact) {
            // THE LINEUP (user sketch): each part travels to its column and
            // stands upright — closed tools point left, so +90° = tip up.
            capabilities.forEach((c, k) => {
              tl.to(
                `[data-tool="${c.id}"]`,
                {
                  x: () => colX(k) - (innerLeft() + 0.505 * S()),
                  y: 0,
                  rotation: 90,
                  duration: 0.14,
                  ease: "power2.inOut",
                },
                0.26
              );
            });
            // beat 2: captions appear beneath each part, then dwell
            tl.to(
              "[data-col]",
              { autoAlpha: 1, y: 0, duration: 0.06, stagger: 0.015, ease: "power2.out" },
              0.4
            );

            // beat 3: captions leave; circles wrap each still-standing tool
            // while "Tools aren't the point." gradually rises
            tl.to("[data-col]", { autoAlpha: 0, duration: 0.04, ease: "power2.in" }, 0.56);
            capabilities.forEach((c, k) => {
              const s = START[c.id];
              tl.set(
                `[data-circle="${c.id}"]`,
                {
                  x: () => colX(k) - (innerLeft() + (s.x / 100) * S()),
                  y: () => (0.45 - s.y / 100) * S(),
                },
                0.56
              );
            });
            tl.to(
              "[data-circle]",
              { autoAlpha: 1, scale: 1, duration: 0.05, stagger: 0.008, ease: "power2.out" },
              0.58
            );

            // beat 4: only now do the tools leave
            tl.to("[data-tool]", { autoAlpha: 0, duration: 0.05, stagger: 0.006, ease: "power2.in" }, 0.62);
          } else {
            // compact: no room for the lineup — tools snap out, circles are
            // born at the blade tips as before
            tl.to("[data-tool]", { autoAlpha: 0, duration: 0.05, stagger: 0.01, ease: "power2.in" }, 0.5);
            tl.to(
              "[data-circle]",
              { autoAlpha: 1, scale: 1, duration: 0.06, stagger: 0.012, ease: "power2.out" },
              0.52
            );
          }

          // converge into the overlapping cluster, then merge into one ring
          circles.forEach((el, k) => {
            const id = el.dataset.circle as CapabilityId;
            const s = START[id];
            const a = ((k * 60 - 90) * Math.PI) / 180;
            const cl = { x: 50 + CLUSTER_R * Math.cos(a), y: 50 + CLUSTER_R * Math.sin(a) };

            tl.to(el, { x: frac(cl.x - s.x), y: frac(cl.y - s.y), duration: 0.1, ease: "power2.inOut" }, 0.68);
            tl.to(el, { x: frac(50 - s.x), y: frac(50 - s.y), duration: 0.08, ease: "power2.inOut" }, 0.78);
            if (k > 0) tl.to(el, { autoAlpha: 0, duration: 0.04, ease: "power2.in" }, 0.83);
          });

          // the last circle grows into the compass ring
          tl.to(circles[0], { scale: 1.9, duration: 0.08, ease: "power2.inOut" }, 0.8);
          tl.to(circles[0], { autoAlpha: 0, duration: 0.04 }, 0.86);
          tl.to("[data-compass]", { autoAlpha: 1, scale: 1, duration: 0.06, ease: "power2.out" }, 0.84);

          // needle finds north — same mechanical settle as the blades
          tl.to("[data-needle]", { rotation: 10, duration: 0.08, ease: "power3.inOut" }, 0.87).to(
            "[data-needle]",
            { rotation: 0, duration: 0.04, ease: "power1.out" },
            0.95
          );

          // copy
          tl.to("[data-statement='tools']", { autoAlpha: 1, y: 0, duration: 0.09, ease: "power1.inOut" }, 0.58)
            .to("[data-statement='tools']", { autoAlpha: 0, y: -16, duration: 0.04, ease: "power2.in" }, 0.8);
          tl.to("[data-statement='outcomes']", { autoAlpha: 1, y: 0, duration: 0.05, ease: "power2.out" }, 0.88);
          tl.to("[data-statement='navigate']", { autoAlpha: 1, duration: 0.04, ease: "power2.out" }, 0.95);
        }
      );

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.section} aria-label="From tools to navigation">
      <div className={styles.stage} ref={stageRef}>
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

        {/* the lineup captions: one column per standing tool (user sketch) */}
        <div className={styles.lineup} aria-hidden="true">
          {capabilities.map((c) => (
            <div key={c.id} data-col="" className={styles.col}>
              <p className={`mono-label ${styles.colLabel}`}>{c.label}</p>
              <p className={`mono-label ${styles.colYears}`}>{c.years}</p>
              <p className={styles.colLine}>{c.line}</p>
            </div>
          ))}
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
