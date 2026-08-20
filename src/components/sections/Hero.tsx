"use client";

import { useRef } from "react";
import { capabilities } from "@/lib/data/capabilities";
import {
  COPY_OUT_END,
  TRAVEL_START,
  TRAVEL_END,
  OPEN_AT,
  REARM_AT,
  LABELS_OUT,
  BLADE_DUR,
  LABEL_DELAY,
  PEEK_SCALE,
  PEEK_SCALE_COMPACT,
  PEEK_SCALE_COMPACT_SHORT,
  PEEK_ROTATION,
  bladeDelay,
} from "@/lib/data/scroll";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./Hero.module.css";

/**
 * The opening. Two viewports over a sticky stage: the copy leaves, the knife
 * travels in from its peek and grows, its blades fan open one at a time, and
 * the lineup's timeline picks the same element up where this one lets go.
 *
 * The knife itself belongs to OutcomeTransition — that section's stage is
 * pinned from the first pixel of the page, so its knife is already on screen
 * here. There is exactly one knife in the DOM and this drives it by the
 * [data-knife-intro] handle, leaving it at identity when the hero ends.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          motionOk: "(prefers-reduced-motion: no-preference)",
          compact: "(max-width: 768px)",
          /* a phone is not one shape. On a tall one the copy leaves a deep
             band underneath and the peek can be large and high in it; on a
             short one the same copy eats the band, so the peek stays small
             and low or it lands on the paragraph. */
          short: "(max-height: 760px)",
          hoverOk: "(hover: hover) and (pointer: fine)",
        },
        (ctx) => {
          const { motionOk, compact, short, hoverOk } = ctx.conditions as {
            motionOk: boolean;
            compact: boolean;
            short: boolean;
            hoverOk: boolean;
          };
          if (!motionOk) return;

          const section = sectionRef.current;
          const knifeEl = document.querySelector<HTMLElement>("[data-knife-el]");
          const intro = document.querySelector<HTMLElement>("[data-knife-intro]");
          if (!section || !knifeEl || !intro) return;

          // §32: compress blade angles on small screens
          const factor = compact ? 0.8 : 1;

          const blades = Array.from(intro.querySelectorAll<HTMLElement>("[data-tool]"));
          const labels = Array.from(intro.querySelectorAll<HTMLElement>("[data-label]"));

          // The knife box, centred in the viewport by OutcomeTransition's grid
          // and shifted right by 0.135 * S so the left-biased art reads centred.
          const S = () => knifeEl.offsetWidth;
          const artCentre = () => window.innerWidth / 2 + 0.135 * S();

          // Where the peek sits, as an offset from the knife's resting place.
          // Desktop: tucked to the right of the copy. Compact: low-right, clear
          // of the headline, matching where the hero's knife always sat.
          const peekScale = compact
            ? short
              ? PEEK_SCALE_COMPACT_SHORT
              : PEEK_SCALE_COMPACT
            : PEEK_SCALE;
          // Stood on end, the closed knife sits near the middle of its square
          // box rather than filling it, so aligning the BOX to the right edge
          // leaves the art stranded well inside. Place the art directly.
          const peekX = () => (compact ? (short ? 0.66 : 0.58) : 0.75) * window.innerWidth - artCentre();
          // desktop peeks above centre and travels down; on a phone the copy
          // owns the top half, so it waits below and rises into place.
          const peekY = () => (compact ? (short ? 0.3 : 0.095) : 0.108) * window.innerHeight;

          gsap.set(intro, {
            x: peekX,
            y: peekY,
            scale: peekScale,
            rotation: PEEK_ROTATION,
          });
          // the knife is held invisible by CSS until it is out at the peek, so
          // the untransformed server-rendered pose never gets a painted frame
          gsap.set(knifeEl, { autoAlpha: 1 });

          // The fan runs on its own clock, fired once when the knife lands and
          // re-armed if the reader scrolls back up past REARM_AT.
          let fanned = false;
          const fan = gsap.timeline({ paused: true });
          capabilities.forEach((c, i) => {
            // elements, not selector strings: useGSAP scopes selectors to this
            // section, and the knife lives in OutcomeTransition's stage
            const blade = blades.find((b) => b.dataset.tool === c.id);
            const label = labels.find((l) => l.dataset.label === c.id);
            if (!blade) return;
            fan.fromTo(
              blade,
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
            if (label) {
              fan.to(
                label,
                { autoAlpha: 1, duration: 0.3, ease: "power2.out" },
                bladeDelay(i) + LABEL_DELAY
              );
            }
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
                const p = self.progress;
                if (p >= OPEN_AT && p < LABELS_OUT && !fanned) {
                  fanned = true;
                  fan.restart();
                } else if (p >= LABELS_OUT && !fanned) {
                  // landed past the opening — a deep link, a refresh mid-page,
                  // or a jump. Play the fan to its end pose instantly rather
                  // than starting it here, where it would re-light labels the
                  // scrub has already retired.
                  fanned = true;
                  fan.progress(1).pause();
                  gsap.set(labels, { autoAlpha: 0 });
                } else if (p >= LABELS_OUT && fanned && fan.isActive()) {
                  // The fan runs on its own clock for about a second, and the
                  // scrub reaches LABELS_OUT only 37vh after it fires. Scroll
                  // that fast and the fan is still tweening labels toward
                  // visible while the scrub tries to hide them — the fan
                  // finishes last and they stay lit all the way to the
                  // compass. Past LABELS_OUT the hide is authoritative: jump
                  // the fan to its end so the blades still reach their open
                  // angles, then put the labels out for good.
                  fan.progress(1);
                  gsap.set(labels, { autoAlpha: 0 });
                } else if (p < REARM_AT && fanned) {
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

          // the copy leaves so the knife has the stage to itself
          tl.to(
            "[data-hero-copy]",
            { autoAlpha: 0, y: -48, duration: COPY_OUT_END, ease: "power2.in" },
            0
          );

          // the knife travels to centre, straightens and grows. Identity at the
          // end — which is exactly the pose the lineup's timeline assumes.
          tl.to(
            intro,
            {
              x: 0,
              y: 0,
              scale: 1,
              rotation: 0,
              duration: TRAVEL_END - TRAVEL_START,
              ease: "power2.inOut",
            },
            TRAVEL_START
          );

          // labels retire before the lineup starts pulling the blades apart
          tl.to(
            labels,
            { autoAlpha: 0, duration: 0.05, ease: "power2.in", overwrite: "auto" },
            LABELS_OUT
          );

          // §39: once the fan has finished, hovering a blade dims the others
          // and lifts its own label. Desktop only.
          if (hoverOk && !compact) {
            const st = tl.scrollTrigger;

            const onOver = (e: MouseEvent) => {
              const hit = (e.target as Element | null)?.closest?.("[data-tool]");
              if (!hit || !st || st.progress < OPEN_AT || st.progress > LABELS_OUT) return;
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

            intro.addEventListener("mouseover", onOver);
            intro.addEventListener("mouseleave", onLeave);
            return () => {
              intro.removeEventListener("mouseover", onOver);
              intro.removeEventListener("mouseleave", onLeave);
            };
          }
        }
      );

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.hero} id="top">
      <div className={styles.stage}>
        <div className={`section-shell ${styles.inner}`} data-hero-copy="">
          <p className={`mono-label ${styles.eyebrow}`}>Product Builder · Designer · Engineer</p>
          <h1 className={`serif-display ${styles.headline}`}>
            Owning the outcome, not a slice of the work.
          </h1>
          <p className={styles.desc}>
            I work across product, design, engineering and AI to turn ambiguous problems into
            shipped systems that make real impact.
          </p>
        </div>
      </div>
    </section>
  );
}
