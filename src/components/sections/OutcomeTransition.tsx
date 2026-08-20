"use client";

import { useRef } from "react";
import { capabilities, type CapabilityId } from "@/lib/data/capabilities";
import { gsap, useGSAP } from "@/lib/gsap";
import KnifeCanvas from "@/components/knife/KnifeCanvas";
import ToolLabels from "@/components/knife/ToolLabels";
import CompassRose from "@/components/compass/CompassRose";
import knifeStyles from "@/components/knife/knife.module.css";
import styles from "./OutcomeTransition.module.css";

/** Where each discipline circle is born: its blade-tip position (% of the box). */
const START: Record<CapabilityId, { x: number; y: number }> = {
  research: { x: 39, y: 24 },
  product: { x: 21, y: 36 },
  design: { x: 12, y: 46 },
  code: { x: 15, y: 79 },
  ai: { x: 25, y: 90 },
  gtm: { x: 44, y: 95 },
};

/** Overlapping cluster: six circles on a small hexagon around center. */
const CLUSTER_R = 10;

/** The cluster/ring/compass sit this % of the box above center — room for
    the statement to breathe below (user, 2026-08-16). */
const LIFT = 5;

/** Timeline length in spacer units. The choreography runs 0 → 0.97 at the
    same vh-per-beat as always; 0.97 → DUR is pure runway — ~118vh of pinned
    scroll where the time-based needle hunt plays out with the wheel never
    blocked (replaces the old hard scroll lock). The module CSS height must
    stay 200vh + 420vh × DUR — 200 because the section is pulled up over the
    whole hero and the trigger's start is offset a viewport to match. */
const DUR = 1.25;

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

          // Mobile stops before any of this. The hero opens the knife, the
          // stage scrolls away with it whole, and ToolCarousel takes over
          // below. Coming apart is a beat that only earns its place because
          // the lineup follows it — without one, it just orphans the parts
          // from the body (user, 2026-08-20).
          if (compact) return;

          const S = () => inner.offsetWidth;
          const frac = (pct: number) => () => (pct / 100) * S();
          /** x of lineup column k's center, relative to the stage. */
          const colX = (k: number) => {
            const W = Math.min(0.92 * stage.clientWidth, 1200);
            return stage.clientWidth / 2 - W / 2 + (k + 0.5) * (W / 6);
          };
          const innerLeft = () => (stage.clientWidth - S()) / 2;

          // The needle hunt is time-based, not scrubbed (user direction):
          // once the compass is up, the needle swings left and right and
          // settles on north like a physical compass. Scrolling back below
          // the compass re-arms it.
          let needlePlayed = false;
          const swing = gsap
            .timeline({ paused: true })
            .fromTo(
              "[data-needle]",
              { rotation: -130 },
              { rotation: 0, duration: 2.2, ease: "elastic.out(1, 0.38)" },
              0.25 // breath after the dial is fully in
            );

          // Caption hover re-lights the tool standing above it: toggling the
          // class that shares the tool's own :hover rule keeps one bloom.
          let glowing: HTMLElement | null = null;
          const clearGlow = () => {
            glowing?.classList.remove(knifeStyles.glow);
            glowing = null;
          };
          const colCleanups: Array<() => void> = [];

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: sectionRef.current,
              // The section is pulled up to document 0 so its stage is pinned
              // from the first pixel and the knife never rises into frame; the
              // timeline itself still begins where the hero's ends. Both ends
              // are absolute — a numeric start with a trigger-relative end
              // resolves to a range neither of them meant.
              start: () => window.innerHeight,
              end: () => (sectionRef.current?.offsetHeight ?? 0) - window.innerHeight,
              scrub: 0.4,
              invalidateOnRefresh: true,
              // snapping only from the individual-tools lineup through to the
              // compass landing — the scrub before is free (user direction),
              // and so is the runway after: leaving is never tugged back
              snap: {
                snapTo(value: number) {
                  const t = value * DUR;
                  if (t < 0.45) return value;
                  if (t > 1.02) return value;
                  const beats = [0.5, 0.66, 0.78, 0.97];
                  return beats.reduce((a, b) => (Math.abs(b - t) < Math.abs(a - t) ? b : a)) / DUR;
                },
                duration: { min: 0.25, max: 0.9 },
                delay: 0.08,
                ease: "power1.inOut",
              },
              onUpdate(self) {
                // beats live in timeline time (the spacer's units), not progress
                const t = self.progress * DUR;
                // a scrub can hide a hovered caption without the pointer
                // moving — no pointerleave, so drop stale glow here
                if (glowing && (t < 0.38 || t > 0.6)) clearGlow();
                // fire only after the dial's fade-in (0.87–0.97) has finished,
                // so appearing and swinging never overlap
                if (t >= 0.96 && !needlePlayed) {
                  needlePlayed = true;
                  swing.restart();
                } else if (t < 0.8 && needlePlayed) {
                  needlePlayed = false;
                  swing.pause(0);
                  gsap.set("[data-needle]", { rotation: -130 });
                }
              },
            },
          });

          tl.to({}, { duration: DUR }, 0);

          // The hero drives this same element by its [data-knife-intro]
          // handle and leaves it at identity — there is one knife on the page
          // and no swap left to get wrong (Hero.tsx).

          // Sits shifted right so the left-biased art reads centered, then
          // slides back to neutral while the tools drift apart — the motion
          // masks it and every later beat keeps plain math.
          tl.fromTo(
            "[data-knife-el]",
            { x: () => 0.135 * S() },
            { x: 0, duration: 0.16, ease: "power2.inOut" },
            0.1
          );

          const circles = gsap.utils.toArray<HTMLElement>("[data-circle]");
          circles.forEach((el) => gsap.set(el, { xPercent: -50, yPercent: -50, scale: 0.4 }));
          gsap.set("[data-compass]", { scale: 0.92 });
          gsap.set("[data-needle]", { rotation: -130 });
          gsap.set("[data-statement]", { y: 16 });

          // the body dissolves out from under the tools (labels already
          // retired at the end of the hero's timeline)
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
                  // stands 16% of the box above center — clear air around
                  // the settled headline below (user direction, 2026-08-16)
                  y: () => -0.16 * S(),
                  rotation: 90,
                  duration: 0.14,
                  ease: "power2.inOut",
                },
                0.26
              );
            });
            // beat 2: captions wait until the descending headline has
            // cleared their band (0.50), then fill it column by column
            tl.to(
              "[data-col]",
              { autoAlpha: 1, y: 0, duration: 0.05, stagger: 0.01, ease: "power2.out" },
              0.5
            );

            // hovering a caption blooms its standing tool (user request)
            gsap.utils.toArray<HTMLElement>("[data-col]").forEach((col) => {
              const tool = inner.querySelector<HTMLElement>(`[data-tool="${col.dataset.col}"]`);
              if (!tool) return;
              const enter = () => {
                clearGlow();
                glowing = tool;
                tool.classList.add(knifeStyles.glow);
              };
              col.addEventListener("pointerenter", enter);
              col.addEventListener("pointerleave", clearGlow);
              colCleanups.push(() => {
                col.removeEventListener("pointerenter", enter);
                col.removeEventListener("pointerleave", clearGlow);
              });
            });

            // beat 3: captions leave; circles wrap each still-standing tool.
            // Starts at 0.63, not sooner — the full lineup composition
            // (captions done 0.60) needs its reading dwell.
            tl.to("[data-col]", { autoAlpha: 0, duration: 0.04, ease: "power2.in" }, 0.63);
            capabilities.forEach((c, k) => {
              const s = START[c.id];
              tl.set(
                `[data-circle="${c.id}"]`,
                {
                  x: () => colX(k) - (innerLeft() + (s.x / 100) * S()),
                  // 0.45 wraps the standing tool; minus the 16% lineup lift
                  y: () => (0.29 - s.y / 100) * S(),
                },
                0.63
              );
            });
            tl.to(
              "[data-circle]",
              { autoAlpha: 1, scale: 1, duration: 0.05, stagger: 0.008, ease: "power2.out" },
              0.64
            );

            // beat 4: only now do the tools leave — the circles lift off them
            tl.to("[data-tool]", { autoAlpha: 0, duration: 0.05, stagger: 0.006, ease: "power2.in" }, 0.655);
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

          // the split's name-plate: fades in high the moment the tools
          // settle, then drifts slowly down to its resting spot while the
          // captions appear above it; leaves as the circles arrive
          // (compact has no lineup — it rides the drift instead)
          if (!compact) {
            tl.fromTo(
              "[data-statement='different']",
              { autoAlpha: 0, y: () => -0.16 * window.innerHeight },
              { autoAlpha: 1, duration: 0.03, ease: "power2.out" },
              0.405
            );
            // holds high through 0.46 (reading dwell), then descends the
            // still-empty caption band before the captions fill it at 0.50
            tl.to(
              "[data-statement='different']",
              { y: 0, duration: 0.045, ease: "power1.inOut" },
              0.455
            );
          } else {
            tl.to(
              "[data-statement='different']",
              { autoAlpha: 1, y: 0, duration: 0.03, ease: "power2.out" },
              0.14
            );
          }
          tl.to(
            "[data-statement='different']",
            { autoAlpha: 0, duration: 0.035, ease: "power2.in" },
            0.63
          );

          // converge into the overlapping cluster, then merge into one ring
          circles.forEach((el, k) => {
            const id = el.dataset.circle as CapabilityId;
            const s = START[id];
            const a = ((k * 60 - 90) * Math.PI) / 180;
            const cl = { x: 50 + CLUSTER_R * Math.cos(a), y: 50 - LIFT + CLUSTER_R * Math.sin(a) };

            tl.to(el, { x: frac(cl.x - s.x), y: frac(cl.y - s.y), duration: 0.1, ease: "power2.inOut" }, 0.66);
            tl.to(el, { x: frac(50 - s.x), y: frac(50 - LIFT - s.y), duration: 0.08, ease: "power2.inOut" }, 0.78);
            if (k > 0) tl.to(el, { autoAlpha: 0, duration: 0.04, ease: "power2.in" }, 0.83);
          });

          // backlight: blooms up behind the merging circle so the compass
          // emerges lit from behind, then settles to a faint ambient halo
          gsap.set("[data-bloom]", { scale: 0.7 });
          tl.to("[data-bloom]", { autoAlpha: 1, scale: 1, duration: 0.09, ease: "power2.out" }, 0.79);
          tl.to("[data-bloom]", { opacity: 0.4, scale: 1.04, duration: 0.08, ease: "power1.inOut" }, 0.9);

          // the last circle grows into the compass ring
          tl.to(circles[0], { scale: 1.9, duration: 0.1, ease: "power2.inOut" }, 0.8);
          tl.to(circles[0], { autoAlpha: 0, duration: 0.05 }, 0.89);
          // slower arrival: the dial eases in over a tenth of the section
          tl.to("[data-compass]", { autoAlpha: 1, scale: 1, duration: 0.1, ease: "power2.out" }, 0.87);

          // copy — sequenced, not simultaneous: the circles gather (0.66–0.76),
          // the statement rises as the cluster locks, THEN they fuse into one
          // ring at 0.78 — gather, name it, merge. The statement then stays,
          // shrinking and dimming so it reads with "Outcomes matter more."
          tl.to("[data-statement='tools']", { autoAlpha: 1, y: 0, duration: 0.07, ease: "power2.out" }, 0.745);
          tl.to(
            "[data-statement='tools']",
            { scale: 0.6, opacity: 0.5, transformOrigin: "center bottom", duration: 0.05, ease: "power2.inOut" },
            0.9
          );
          tl.to("[data-statement='outcomes']", { autoAlpha: 1, y: 0, duration: 0.05, ease: "power2.out" }, 0.92);

          // the runway: the telling is done by 0.97 — from there the stage
          // stays pinned while the compass and its backlight drift gently
          // down with the scroll, at rest but alive, giving the needle hunt
          // room to play before the pin releases (user direction, 2026-08-16)
          tl.to("[data-compass]", { y: () => 0.05 * S(), duration: DUR - 0.97 }, 0.97);
          tl.to("[data-bloom]", { y: () => 0.05 * S(), duration: DUR - 0.97 }, 0.97);

          return () => {
            colCleanups.forEach((fn) => fn());
            clearGlow();
          };
        }
      );

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-label="From tools to navigation"
      /* chapter marks: lineup, cluster, merge, compass landing — the snap
         beats as fractions of the section's scroll range (timeline ÷ DUR) */
      data-ruler-beats="0.4,0.53,0.62,0.78"
    >
      <div className={styles.stage} ref={stageRef}>
        <div className={styles.bloom} data-bloom="" aria-hidden="true" />

        <div className={styles.inner} ref={innerRef}>
          <div className={styles.knifeEl} data-knife-el="">
            {/* The Hero's timeline drives this wrapper — peek, travel, zoom,
                fan — and leaves it at identity exactly as that timeline ends.
                Everything below therefore sees the same geometry it always
                did, and there is only ever one knife on the page. */}
            <div className={styles.knifeIntro} data-knife-intro="">
              <KnifeCanvas />
              <ToolLabels />
            </div>
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
                  <circle cx="50" cy="50" r="48" stroke="rgba(248,244,242,0.4)" strokeWidth="1.2" />
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
            <div key={c.id} data-col={c.id} className={styles.col}>
              <p className={`mono-label ${styles.colLabel}`}>{c.label}</p>
              <p className={`mono-label ${styles.colYears}`}>{c.duration}</p>
              <p className={`mono-label ${styles.colPeriod}`}>{c.years}</p>
              <p className={styles.colLine}>
                {c.line.split("\n").map((fact, fi, facts) => (
                  <span
                    key={fact}
                    className={`${styles.fact} ${
                      facts.length > 1 && fi === facts.length - 1 ? styles.factNow : ""
                    }`}
                  >
                    {fact}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>

        <div className={styles.copy}>
          <p className={`serif-display ${styles.interLine}`} data-statement="different">
            One problem, many parts — a tool for each.
          </p>
          <h2 className={`serif-display ${styles.statement}`} data-statement="tools">
            Tools matter, but&nbsp;.&nbsp;.&nbsp;.
          </h2>
          <h2 className={`serif-display ${styles.statement}`} data-statement="outcomes">
            <em>Outcomes</em> matter more.
          </h2>
        </div>
      </div>
    </section>
  );
}
