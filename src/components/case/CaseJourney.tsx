"use client";

import { useEffect, useRef, useState } from "react";
import { m } from "motion/react";
import { reveal } from "@/lib/motion";
import styles from "./CaseJourney.module.css";

export type JourneyStage = {
  label: string;
  quote?: string;
  consequence?: string;
};

/** One journey, whole, on one screen.
 *
 *  This was a carousel: the rail walked itself and a card below swapped
 *  to the quote for whichever stage the marker had reached. It read badly
 *  for two reasons (Cyril, 2026-08-21). The marker moved in one place
 *  while the text changed in another, so there was nowhere to look; and
 *  four of the five pains were hidden at any instant, behind a timer,
 *  when the accumulation — five of six steps hurt — IS the argument.
 *
 *  So nothing moves and nothing is hidden. Each quote hangs off its own
 *  stop, alternating above and below the rail so a card can be wider than
 *  the gap between two stops without touching its neighbours. Red marks
 *  the stops that hurt; the ones that do not stay neutral, which is what
 *  makes "five of six" legible at a glance.
 *
 *  They arrive one at a time, in journey order, alternating sides — and
 *  then they HOLD. The build is the walk the carousel used to do; the
 *  holding is the part it never did.
 */
export default function CaseJourney({
  eyebrow,
  eyebrowNote,
  heading,
  icon,
  iconLabel,
  stages,
}: {
  eyebrow: string;
  /** A second label under the eyebrow, in the accent — what the walk
      below is showing. Optional: a journey without one just carries the
      eyebrow, and nothing is rendered in its place. */
  eyebrowNote?: string;
  heading: string;
  icon: string;
  iconLabel: string;
  stages: JourneyStage[];
}) {
  const last = stages.length - 1;
  const railRef = useRef<HTMLDivElement>(null);
  /* One observer for the whole rail rather than one per card: the stagger
     is a CSS animation-delay keyed off each note's own --k, so all this
     has to decide is the single moment the build starts. Once only — a
     journey that re-ran every time it scrolled back into view would be
     the carousel again, in slower clothes. */
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLit(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* the order a pain appears in, which is not its stage index — the two
     stops with nothing to say are skipped rather than leaving a gap in
     the count */
  const painOrder = new Map<number, number>();
  stages.forEach((s, i) => {
    if (s.quote) painOrder.set(i, painOrder.size);
  });
  /* The persona is one person saying all of these, so the icon is drawn
     once beside the heading rather than repeated against every quote —
     five copies of the same face reads as a row of holes, not as five
     remarks by the same agent. */
  const painCount = stages.filter((s) => s.quote).length;

  return (
    <m.section {...reveal(`section-shell ${styles.block}`)}>
      <div className={styles.head}>
        <div>
          <p className={`mono-label ${styles.eyebrow}`}>{eyebrow}</p>
          {eyebrowNote && (
            <p className={`mono-label ${styles.eyebrowNote}`}>
              {eyebrowNote} — {painCount} of {stages.length} steps
            </p>
          )}
        </div>
        <div className={styles.headMain}>
          <h2 className={`serif-display ${styles.heading}`}>{heading}</h2>
          <p className={styles.persona}>
            <img src={icon} alt="" className={styles.avatar} />
            <span className={`mono-label ${styles.personaName}`}>
              {iconLabel}
            </span>
          </p>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.rail} ref={railRef} data-lit={lit || undefined}>
          {/* a real SVG line, not a CSS gradient: the house ground is a
              round-capped "2 14" dash, and gradient dots rasterize square
              at this size */}
          <svg className={styles.track} aria-hidden="true">
            <line
              x1="0"
              y1="1.5"
              x2="100%"
              y2="1.5"
              stroke="rgba(248,244,242,0.28)"
              strokeWidth="2.25"
              strokeDasharray="1.5 10.5"
              strokeLinecap="round"
            />
          </svg>

          {stages.map((s, i) => (
            <div
              key={s.label}
              className={styles.stop}
              style={
                {
                  left: `${(i / last) * 100}%`,
                  "--k": painOrder.get(i) ?? 0,
                } as React.CSSProperties
              }
              data-pain={s.quote ? "" : undefined}
              data-side={s.quote ? (i % 2 === 0 ? "up" : "down") : undefined}
            >
              <span className={styles.dot} aria-hidden="true" />
              <span className={`mono-label ${styles.stopLabel}`}>
                {s.label}
              </span>
            </div>
          ))}

          {/* The notes live in their own layer, not inside their stop, for
              two reasons: a percentage width resolves against this box
              (the rail) rather than a zero-width post, and on a phone the
              whole layer becomes one snapping row without touching the
              rail above it. */}
          <div className={styles.notes}>
            {stages.map((s, i) =>
              s.quote ? (
                <div
                  key={`${s.label}-note`}
                  className={styles.note}
                  style={
                    {
                      left: `${(i / last) * 100}%`,
                      "--k": painOrder.get(i) ?? 0,
                    } as React.CSSProperties
                  }
                  data-side={i % 2 === 0 ? "up" : "down"}
                  /* the end stops sit on the rail's edges, so their cards
                   align to the edge instead of centring off it */
                  data-edge={
                    i === 0 ? "first" : i === last ? "last" : undefined
                  }
                >
                  {/* the stage name travels with the quote — under six
                    nodes on a phone there is no room to label them */}
                  <span className={`mono-label ${styles.noteStage}`}>
                    {s.label}
                  </span>
                  <p className={styles.quote}>&#8220;{s.quote}&#8221;</p>
                  {s.consequence && (
                    <p className={styles.consequence}>
                      <span className={`mono-label ${styles.painTag}`}>
                        Pain
                      </span>
                      {s.consequence}
                    </p>
                  )}
                </div>
              ) : null,
            )}
          </div>
        </div>
      </div>
    </m.section>
  );
}
