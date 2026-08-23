"use client";

import { useRef } from "react";
import { capabilities } from "@/lib/data/capabilities";
import { gsap, useGSAP } from "@/lib/gsap";
import KnifeCanvas from "@/components/knife/KnifeCanvas";
import { ART_CENTRE_SHIFT } from "@/components/knife/art";
import ContactActions from "@/components/ContactActions";
import styles from "./FinalCTA.module.css";

const OPEN_ANGLES = Object.fromEntries(capabilities.map((c) => [c.id, c.openAngle]));

/**
 * Spec §29: the knife returns fully open and folds closed tool by tool
 * (reverse order), silently. Only once closed does the ask appear.
 */
export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          motionOk: "(prefers-reduced-motion: no-preference)",
          compact: "(max-width: 768px)",
        },
        (ctx) => {
          const { motionOk, compact } = ctx.conditions as {
            motionOk: boolean;
            compact: boolean;
          };
          if (!motionOk) return;
          /* Phones fold nothing back. The reverse close only reads as a
             close because the reader watched it open, and no opening plays
             at this width any more (Hero.tsx) — so this is the knife shut
             above the ask, from CSS. */
          if (compact) return;

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

        [...capabilities].reverse().forEach((c, i) => {
          tl.to(
            `[data-tool="${c.id}"]`,
            { rotation: 0, duration: 0.07, ease: "power3.inOut" },
            0.06 + i * 0.08
          );
        });

          tl.to("[data-knife-final]", { yPercent: -14, duration: 0.14, ease: "power2.inOut" }, 0.58);
          // and it dissolves on the way up, clearing the stage for the ask.
          // The knife used to hold its place while the question faded in
          // underneath it, which put a closed knife across the middle of the
          // line (Cyril, 2026-08-21). Gone by 0.72, which is exactly when
          // "Let's get started." starts to arrive.
          tl.to("[data-knife-final]", { autoAlpha: 0, duration: 0.1, ease: "power2.in" }, 0.62);
          tl.to("[data-final='question']", { autoAlpha: 1, y: 0, duration: 0.07, ease: "power2.out" }, 0.62);
          tl.to("[data-final='give']", { autoAlpha: 1, y: 0, duration: 0.08, ease: "power2.out" }, 0.72);
          tl.to("[data-final='ctas']", { autoAlpha: 1, y: 0, duration: 0.07, ease: "power2.out" }, 0.82);
        }
      );

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    /* The ask lands at 0.82 of this section's own scroll and has settled by
       0.89; everything before that is the knife folding, with no contact
       copy on the page. So this is where the section counts as reached —
       the rail's CONTACT mark, the nav's current stop and the anchor jump
       all read it (see sectionArrival) instead of pointing at the top. */
    <section
      ref={sectionRef}
      className={styles.section}
      id="contact"
      aria-label="Contact"
      data-ruler-arrive="0.86"
    >
      <div className={styles.stage}>
        <div className={styles.knifeWrap} data-knife-final="">
          {/* the inner box carries the shift, not knifeWrap — GSAP writes
              yPercent to knifeWrap and would overwrite a transform here */}
          <div style={{ transform: `translateX(${ART_CENTRE_SHIFT * 100}%)` }}>
            <KnifeCanvas angles={OPEN_ANGLES} reducedPose="closed" />
          </div>
        </div>

        <div className={styles.copy}>
          <p className={`serif-display ${styles.question}`} data-final="question">
            Have a problem that needs more than one perspective?
          </p>
          <p className={`serif-display ${styles.give}`} data-final="give">
            Let&apos;s get <em>started.</em>
          </p>
          <div className={styles.ctas} data-final="ctas">
            <ContactActions />
          </div>
        </div>
      </div>
    </section>
  );
}
