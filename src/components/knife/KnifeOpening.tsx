"use client";

import { useRef } from "react";
import { capabilities } from "@/lib/data/capabilities";
import {
  TRAVEL_START,
  TRAVEL_END,
  OPEN_AT,
  REARM_AT,
  BLADE_DUR,
  LABEL_DELAY,
  HANDOFF_START,
  HANDOFF_DUR,
  bladeDelay,
} from "@/lib/data/scroll";
import { gsap, useGSAP } from "@/lib/gsap";
import KnifeCanvas from "./KnifeCanvas";
import ToolLabels from "./ToolLabels";
import styles from "./knife-opening.module.css";

/**
 * The transition between the hero and the lineup. The knife arrives from the
 * hero's peek, travels to the middle and grows until it has the stage, then
 * fans open a blade at a time before dissolving into the morph section's
 * knife. No narrative — the copy that used to live here is being reworked.
 */
export default function KnifeOpening() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
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

          const section = sectionRef.current;
          const stage = stageRef.current;
          const wrap = wrapRef.current;
          if (!section || !stage || !wrap) return;

          // §32: compress blade angles on small screens
          const factor = compact ? 0.8 : 1;

          const blades = Array.from(wrap.querySelectorAll<HTMLElement>("[data-tool]"));
          const labels = Array.from(wrap.querySelectorAll<HTMLElement>("[data-label]"));

          // Layout values, not getBoundingClientRect: the knife starts tilted,
          // and a rotated element's rect is its axis-aligned box — wider than
          // the element. offset* is immune to transforms, so this stays correct
          // at every angle, scale and scroll position.
          const box = () => ({
            w: wrap.offsetWidth,
            cx: wrap.offsetLeft + wrap.offsetWidth / 2,
            cy: wrap.offsetTop + wrap.offsetHeight / 2,
          });

          // The same expression as OutcomeTransition's .inner width, so the two
          // knives are congruent when the crossfade happens.
          const targetW = () =>
            Math.min(0.58 * window.innerHeight, 0.54 * window.innerWidth, 660);

          // The fan runs on its own clock, fired once when the knife lands and
          // re-armed if the reader scrolls back up past REARM_AT.
          let fanned = false;
          const fan = gsap.timeline({ paused: true });
          capabilities.forEach((c, i) => {
            fan.fromTo(
              `[data-tool="${c.id}"]`,
              { rotation: 0 },
              {
                rotation: c.openAngle * factor,
                duration: BLADE_DUR,
                // sweeps a little past the resting angle and settles back —
                // the mechanical overshoot a real blade has
                ease: "back.out(1.5)",
                // without this the "from" pose renders at build time and the
                // knife starts fully open
                immediateRender: false,
              },
              bladeDelay(i)
            );
            fan.to(
              `[data-label="${c.id}"]`,
              { autoAlpha: 1, duration: 0.3, ease: "power2.out" },
              bladeDelay(i) + LABEL_DELAY
            );
          });

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.4,
              invalidateOnRefresh: true,
              onUpdate(self) {
                if (self.progress >= OPEN_AT && !fanned) {
                  fanned = true;
                  fan.restart();
                } else if (self.progress < REARM_AT && fanned) {
                  fanned = false;
                  fan.pause(0);
                  gsap.set(blades, { rotation: 0 });
                  gsap.set(labels, { autoAlpha: 0 });
                }
              },
            },
          });

          // spacer: every position below is literally a scroll fraction
          tl.to({}, { duration: 1 }, 0);

          // the knife travels to the middle, straightens and grows into the
          // stage. Lazy functions, so resize and mid-page reload both land.
          tl.to(
            wrap,
            {
              x: () =>
                // the art sits left of centre in its box, so the box lands
                // shifted right for the ART to read centred. OutcomeTransition
                // opens by sliding this same offset back to zero.
                stage.clientWidth / 2 - box().cx + 0.135 * targetW(),
              y: () => stage.clientHeight / 2 - box().cy,
              scale: () => targetW() / box().w,
              rotation: 0,
              duration: TRAVEL_END - TRAVEL_START,
              ease: "power2.inOut",
            },
            TRAVEL_START
          );

          // labels retire before the handoff, so no label-sized ghost survives
          // into a knife that has none
          tl.to(labels, { autoAlpha: 0, duration: 0.04, ease: "power2.in" }, HANDOFF_START - 0.05);

          // Crossfade rather than a hard swap: two near-identical frames
          // dissolving absorbs whatever lag the scrub is carrying, so there is
          // never a visible jump and never two knives.
          const morphKnife = document.querySelector("[data-knife-el]");
          if (morphKnife) {
            tl.to(morphKnife, { autoAlpha: 1, duration: HANDOFF_DUR, ease: "none" }, HANDOFF_START);
            tl.to(wrap, { autoAlpha: 0, duration: HANDOFF_DUR, ease: "none" }, HANDOFF_START);

            // The morph stage has not pinned yet during the crossfade — it is
            // still rising toward the top of the viewport and its knife rides
            // up with it. Both the rise and the timeline are linear in scroll,
            // so an equal counter-translation cancels it exactly and the
            // incoming knife holds dead centre while it dissolves in.
            const range = () => section.offsetHeight - window.innerHeight;
            tl.fromTo(
              morphKnife,
              { y: () => -HANDOFF_DUR * range() },
              { y: 0, duration: HANDOFF_DUR, ease: "none", immediateRender: false },
              HANDOFF_START
            );
          }

          // §39: once the fan has finished, hovering a blade dims the others
          // and lifts its own label. Desktop only.
          if (hoverOk && !compact) {
            const st = tl.scrollTrigger;

            const onOver = (e: MouseEvent) => {
              const hit = (e.target as Element | null)?.closest?.("[data-tool]");
              if (!hit || !st || st.progress < OPEN_AT) return;
              const id = hit.getAttribute("data-tool");
              blades.forEach((t) =>
                gsap.to(t, { opacity: t === hit ? 1 : 0.55, duration: 0.2, overwrite: "auto" })
              );
              labels.forEach((l) =>
                gsap.to(l, {
                  color: l.getAttribute("data-label") === id ? "#f8f4f2" : "#9e9493",
                  duration: 0.2,
                  overwrite: "auto",
                })
              );
            };

            const onLeave = () => {
              blades.forEach((t) => gsap.to(t, { opacity: 1, duration: 0.2, overwrite: "auto" }));
              labels.forEach((l) =>
                gsap.to(l, { color: "#eee8e6", duration: 0.2, overwrite: "auto" })
              );
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
    <section
      ref={sectionRef}
      className={styles.opening}
      aria-label="Capabilities"
      /* chapter marks: the knife lands, then the handoff */
      data-ruler-beats={`${TRAVEL_END},${HANDOFF_START}`}
    >
      <div className={styles.stage} ref={stageRef}>
        <div className={styles.knifeWrap} ref={wrapRef}>
          <KnifeCanvas />
          <ToolLabels />
        </div>
      </div>
    </section>
  );
}
