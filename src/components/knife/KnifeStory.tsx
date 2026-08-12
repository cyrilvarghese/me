"use client";

import { useRef } from "react";
import { capabilities } from "@/lib/data/capabilities";
import { INTRO_END, COMPLETE_START, windowFor } from "@/lib/data/scroll";
import { gsap, useGSAP } from "@/lib/gsap";
import KnifeCanvas from "./KnifeCanvas";
import ToolLabels from "./ToolLabels";
import styles from "./knife-story.module.css";

/**
 * The 600vh knife story (spec §13–18). The stage is sticky for the whole
 * section while one scrubbed timeline opens six tools and swaps narrative
 * panels. All tween positions are the scroll fractions from scroll.ts —
 * the spacer tween pins the timeline's total duration to exactly 1.
 */
export default function KnifeStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          motionOk: "(prefers-reduced-motion: no-preference)",
          compact: "(max-width: 768px)",
          hoverOk: "(hover: hover) and (pointer: fine)",
        },
        (ctx) => {
          const { motionOk, compact, hoverOk } = ctx.conditions as {
            motionOk: boolean;
            compact: boolean;
            hoverOk: boolean;
          };
          if (!motionOk) return;

          // §32: compress blade angles on small screens
          const factor = compact ? 0.8 : 1;

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

          capabilities.forEach((c, i) => {
            const { start, end } = windowFor(i);
            const dur = end - start;
            const blade = `[data-tool="${c.id}"]`;
            const panel = `[data-panel="${c.id}"]`;
            const open = c.openAngle * factor;

            // §15 mechanical overshoot: sweep past resting angle, settle back.
            tl.to(blade, { rotation: open * 1.06, duration: dur * 0.8, ease: "power3.inOut" }, start).to(
              blade,
              { rotation: open, duration: dur * 0.2, ease: "power1.out" },
              start + dur * 0.8
            );

            tl.to(panel, { autoAlpha: 1, y: 0, duration: 0.025, ease: "power2.out" }, start + 0.005).to(
              `${panel} [data-tag]`,
              { autoAlpha: 1, y: 0, duration: 0.02, stagger: 0.008, ease: "power2.out" },
              start + 0.022
            );

            const fadeAt = i === capabilities.length - 1 ? COMPLETE_START : end;
            tl.to(panel, { autoAlpha: 0, y: -16, duration: 0.018, ease: "power2.in" }, fadeAt - 0.014);

            tl.to(`[data-label="${c.id}"]`, { autoAlpha: 1, duration: 0.015 }, start + dur * 0.55);
          });

          tl.to('[data-panel="intro"]', { autoAlpha: 0, y: -16, duration: 0.02, ease: "power2.in" }, INTRO_END - 0.012);
          tl.to('[data-panel="complete"]', { autoAlpha: 1, y: 0, duration: 0.03, ease: "power2.out" }, 0.905);
          tl.to("[data-complete-line]", { autoAlpha: 1, duration: 0.025 }, 0.955);

          // §39: once fully open, hovering a blade dims the others (desktop only)
          if (hoverOk && !compact && wrapRef.current) {
            const wrap = wrapRef.current;
            const tools = Array.from(wrap.querySelectorAll<HTMLElement>("[data-tool]"));
            const st = tl.scrollTrigger;

            const onOver = (e: MouseEvent) => {
              const hit = (e.target as Element | null)?.closest?.("[data-tool]");
              if (!hit || !st || st.progress < COMPLETE_START) return;
              const id = hit.getAttribute("data-tool");
              tools.forEach((t) =>
                gsap.to(t, { opacity: t === hit ? 1 : 0.55, duration: 0.2, overwrite: "auto" })
              );
              gsap.to(`[data-label]:not([data-label="${id}"])`, { color: "#9a9a9a", duration: 0.2, overwrite: "auto" });
              gsap.to(`[data-label="${id}"]`, { color: "#f8f8f8", duration: 0.2, overwrite: "auto" });
            };

            const onLeave = () => {
              tools.forEach((t) => gsap.to(t, { opacity: 1, duration: 0.25, overwrite: "auto" }));
              gsap.to("[data-label]", { color: "#ededed", duration: 0.2, overwrite: "auto" });
            };

            wrap.addEventListener("mouseover", onOver);
            wrap.addEventListener("mouseleave", onLeave);
            return () => {
              wrap.removeEventListener("mouseover", onOver);
              wrap.removeEventListener("mouseleave", onLeave);
            };
          }
        }
      );

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.story} id="work" aria-label="Capabilities">
      <div className={styles.stage}>
        <div className={styles.stageInner}>
          <div className={styles.narrative}>
            <div className={styles.panel} data-panel="intro">
              <p className={`serif-display ${styles.statement}`}>
                Sometimes the problem isn&apos;t a design problem.
              </p>
            </div>

            {capabilities.map((c, i) => (
              <div key={c.id} className={`${styles.panel} ${styles.hiddenPanel}`} data-panel={c.id}>
                <p className={`mono-label ${styles.eyebrow}`}>
                  <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span> / {c.label}
                </p>
                <h2 className={`serif-display ${styles.statement}`}>{c.statement}</h2>
                <ul className={styles.tags}>
                  {c.tags.map((t) => (
                    <li key={t} data-tag className={`mono-label ${styles.tag}`}>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className={`${styles.panel} ${styles.hiddenPanel}`} data-panel="complete">
              <h2 className={`serif-display ${styles.statement}`}>
                One person.
                <br />
                Multiple points of leverage.
              </h2>
              <p data-complete-line className={styles.completeLine}>
                Different problems require different tools.
              </p>
            </div>
          </div>

          <div className={styles.knifeWrap} ref={wrapRef}>
            <KnifeCanvas />
            <ToolLabels />
          </div>
        </div>
      </div>
    </section>
  );
}
