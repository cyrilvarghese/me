"use client";

import { useEffect, useRef, useState } from "react";
import { m } from "motion/react";
import { reveal } from "@/lib/motion";
import styles from "./CaseJourney.module.css";

/** Read a CSS time custom property in milliseconds.
    getComputedStyle normalises a time to seconds — "4000ms" comes back as
    "4s" — so parseFloat alone reads 4, and timers built from it all fire
    inside a frame of each other. */
function cssMs(el: Element, prop: string, fallback: number) {
  const raw = getComputedStyle(el).getPropertyValue(prop).trim();
  const n = parseFloat(raw);
  if (!Number.isFinite(n)) return fallback;
  return raw.endsWith("ms") ? n : n * 1000;
}

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
  heading,
  icon,
  iconLabel,
  stages,
}: {
  eyebrow: string;
  heading: string;
  icon: string;
  iconLabel: string;
  stages: JourneyStage[];
}) {
  const last = stages.length - 1;
  const railRef = useRef<HTMLDivElement>(null);
  /* One observer for the whole rail rather than one per card: the stagger
     is driven off `step`, so all this has to decide is the single moment
     the walk starts. Once only — a
     journey that re-ran every time it scrolled back into view would be
     the carousel again, in slower clothes. */
  const [lit, setLit] = useState(false);
  /* which stop the dash has left for. Every position on the rail derives
     from this, so a journey with five stops and one with six both walk
     correctly — the CSS keyframes this replaced hard-coded six stops
     (0/20/40/60/80/100%) and left Journey 02's dash stopping at 20%
     while its second dot sat at 25% (Cyril, 2026-08-21). */
  const [step, setStep] = useState(0);

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

  /* The walk itself: one leg every --leg, from the first stop to the
     last. The dash and the trail are CSS transitions off `step`, so the
     travel is the browser's to draw and this only has to say when. */
  useEffect(() => {
    if (!lit) return;
    const rail = railRef.current;
    if (!rail) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(last);
      return;
    }
    const leg = cssMs(rail, "--leg", 4000);
    const timers = Array.from({ length: last }, (_, k) =>
      window.setTimeout(() => setStep(k + 1), (k + 1) * leg),
    );
    return () => timers.forEach(clearTimeout);
  }, [lit, last]);

  /* On a phone only one quote fits, so the note the dash is standing at
     is the one on screen — the rest are stacked behind it in the same
     cell and take their turn as the walk reaches them. */
  const current = stages.reduce(
    (at, stage, i) => (stage.quote && i <= step ? i : at),
    -1
  );

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
          {/* Counted here rather than written into the data: it is the
              claim the whole figure makes, and a hand-kept number drifts
              the first time a stage is added. */}
          {painCount > 0 && (
            <p className={`mono-label ${styles.eyebrowNote}`}>
              {painCount} of {stages.length} steps hurt
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

          {/* the trail fills behind the traveller, and the traveller is the
              same flat round-capped dash the diagrams use — a fat dot just
              sits where a dash reads as motion */}
          <span
            className={styles.trail}
            style={{ transform: `scaleX(${last ? step / last : 0})` }}
            aria-hidden="true"
          />
          <span
            className={styles.marker}
            style={{ left: `${last ? (step / last) * 100 : 0}%` }}
            aria-hidden="true"
          />

          {stages.map((s, i) => (
            <div
              key={s.label}
              className={styles.stop}
              style={{ left: `${(i / last) * 100}%` }}
              data-pain={s.quote ? "" : undefined}
              data-shown={i <= step ? "" : undefined}
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
                    } as React.CSSProperties
                  }
                  data-side={i % 2 === 0 ? "up" : "down"}
                  data-shown={i <= step ? "" : undefined}
                data-current={i === current ? "" : undefined}
                  /* the end stops sit on the rail's edges, so their cards
                   align to the edge instead of centring off it */
                  data-edge={
                    i === 0 ? "first" : i === last ? "last" : undefined
                  }
                >
                  {/* the reveal moves this inner box, so the note itself
                      keeps the transform that centres it on its stop —
                      the two would otherwise overwrite each other */}
                  <div className={styles.noteIn}>
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
                </div>
              ) : null,
            )}
          </div>
        </div>
      </div>
    </m.section>
  );
}
