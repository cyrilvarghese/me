"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { m } from "motion/react";
import { reveal } from "@/lib/motion";
import styles from "./CaseJourney.module.css";

export type JourneyStage = {
  label: string;
  quote?: string;
  consequence?: string;
};

const TRAVEL = 900; // ms — the trail/marker transition (--msj-travel)
const DWELL = 4200; // reading time at a quoted stage
const END_HOLD = 1600; // the completed rail, held before the cycle restarts
const FADE = 1100; // ms — the card's entrance fade (--msj-fade)
const CURVE = "ease-in-out"; // the fade's timing curve (--msj-curve)
const CURVES = [
  "ease-in-out",
  "ease",
  "ease-in",
  "ease-out",
  "linear",
  "cubic-bezier(0.22, 1, 0.36, 1)",
] as const;

/** A journey told one stage at a time: a straight rail of stages with a
    red marker sliding along it, and a card giving the active stage's
    quote in real HTML type — legible at any width, which is the reason
    this is a component and not a 1200-unit SVG whose 12px labels shrink
    with the panel.

    Two-phase motion: `target` is where the marker is heading (it drives
    the trail and the slide), `shown` is where it has arrived — nodes pop
    and the card swaps only on arrival, never while the dot is still
    travelling. The auto walk visits every quoted stage, runs the final
    leg to the journey's end, holds the completed rail, then restarts in
    place — a cycle never plays in reverse. Reader input stops the walk;
    reduced motion never starts it and skips every slide. */
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
  const quoted = useMemo(
    () => stages.flatMap((s, i) => (s.quote ? [i] : [])),
    [stages]
  );
  const last = stages.length - 1;
  const [target, setTarget] = useState(quoted[0] ?? 0);
  const [shown, setShown] = useState(quoted[0] ?? 0);
  const [instant, setInstant] = useState(false); // kills the slide for one swap
  const [paused, setPaused] = useState(false); // by the reader: nav or the pause button
  const [inView, setInView] = useState(false);
  /* ?tune in the URL swaps the shipped timings for live sliders — a
     tuning bench, not a shipped control, so it costs nothing unasked */
  const [tune, setTune] = useState<null | {
    fade: number;
    travel: number;
    dwell: number;
    curve: string;
  }>(null);
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("tune")) {
      setTune({ fade: FADE, travel: TRAVEL, dwell: DWELL, curve: CURVE });
    }
  }, []);

  const fade = tune?.fade ?? FADE;
  const travel = tune?.travel ?? TRAVEL;
  const dwell = tune?.dwell ?? DWELL;
  const curve = tune?.curve ?? CURVE;

  const reduced = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* run the walk only while the band is on screen */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* arrival: the card and the pop wait for the dot */
  useEffect(() => {
    if (target === shown) return;
    const t = setTimeout(
      () => setShown(target),
      instant || reduced() ? 0 : travel
    );
    return () => clearTimeout(t);
  }, [target, shown, instant, travel]);

  /* the walk. From a quoted stage: dwell, then head for the next one —
     or for the journey's end after the last quote. From the end: hold
     the finished rail, then restart in place rather than rewinding. */
  useEffect(() => {
    if (paused || !inView || target !== shown) return;
    if (reduced()) return;
    const at = quoted.indexOf(shown);
    const t = setTimeout(
      () => {
        if (at === -1 || shown === last) {
          // finished rail held — restart without a reverse slide
          setInstant(true);
          setTarget(quoted[0]);
          setShown(quoted[0]);
        } else if (at === quoted.length - 1 && last !== shown) {
          setInstant(false);
          setTarget(last); // the final leg, so the journey visibly completes
        } else {
          setInstant(false);
          setTarget(quoted[(at + 1) % quoted.length]);
        }
      },
      at === -1 || shown === last ? END_HOLD : dwell
    );
    return () => clearTimeout(t);
  }, [shown, target, paused, inView, quoted, last, dwell]);

  /* the instant flag lives for exactly one swap */
  useEffect(() => {
    if (!instant) return;
    const t = setTimeout(() => setInstant(false), 50);
    return () => clearTimeout(t);
  }, [instant]);

  const go = (i: number) => {
    setPaused(true);
    setInstant(false);
    setTarget(i);
  };
  const step = (dir: 1 | -1) => {
    const at = quoted.indexOf(cardIndex);
    go(quoted[(at + dir + quoted.length) % quoted.length]);
  };

  /* the card voices where the dot is headed — its fade starts at
     departure and plays while the dot travels, so the dwell at the node
     is pure reading time. The node pop still waits for arrival. */
  const cardIndex = quoted.includes(target)
    ? target
    : quoted.filter((q) => q <= target).pop() ?? quoted[0];
  const stage = stages[cardIndex];
  const fraction = target / last;

  /* already a client component and it needs the ref, so it takes the reveal
     inline rather than through RevealSection */
  return (
    <m.section ref={rootRef} {...reveal(`section-shell ${styles.block}`)}>
      <div className={styles.head}>
        <p className={`mono-label ${styles.eyebrow}`}>{eyebrow}</p>
        <h2 className={`serif-display ${styles.heading}`}>{heading}</h2>
      </div>

      <div
        className={styles.panel}
        style={
          {
            "--msj-fade": `${fade}ms`,
            "--msj-travel": `${travel}ms`,
            "--msj-curve": curve,
          } as React.CSSProperties
        }
      >
        {/* the rail. Dots are buttons — the timeline is the nav */}
        <div className={styles.rail} data-instant={instant || undefined}>
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
              strokeWidth="3"
              strokeDasharray="2 14"
              strokeLinecap="round"
            />
          </svg>
          <span
            className={styles.trail}
            style={{ transform: `scaleX(${fraction})` }}
            aria-hidden="true"
          />
          <span
            className={styles.marker}
            style={{ left: `${fraction * 100}%` }}
            aria-hidden="true"
          />
          {stages.map((s, i) => (
            <button
              key={s.label}
              type="button"
              className={styles.stop}
              style={{ left: `${(i / last) * 100}%` }}
              data-active={(i === shown && shown === target && !!s.quote) || undefined}
              data-passed={
                i < shown || (i === shown && !s.quote) || undefined
              }
              data-quiet={!s.quote || undefined}
              disabled={!s.quote}
              onClick={() => go(i)}
              aria-label={s.quote ? `Stage: ${s.label}` : `${s.label} (no note)`}
            >
              <span className={styles.dot} aria-hidden="true" />
              <span className={`mono-label ${styles.stopLabel}`}>{s.label}</span>
            </button>
          ))}
        </div>

        {/* the card: one stage speaking. Keyed so the swap re-runs the
            entrance; min-height in the module keeps the rail still */}
        <div key={cardIndex} className={styles.card}>
          <img src={icon} alt={iconLabel} className={styles.avatar} />
          <div className={styles.words}>
            <p className={styles.quote}>&#8220;{stage.quote}&#8221;</p>
            {stage.consequence && (
              <p className={styles.consequence}>
                <span className={`mono-label ${styles.consequenceTag}`}>
                  Pain
                </span>
                {stage.consequence}
              </p>
            )}
          </div>
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className="btn btn-ghost btn-icon"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Play the walk" : "Pause the walk"}
          >
            {paused ? "▸" : "‖"}
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-icon"
            onClick={() => step(-1)}
            aria-label="Previous stage"
          >
            &#8592;
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-icon"
            onClick={() => step(1)}
            aria-label="Next stage"
          >
            &#8594;
          </button>
          <span className={`mono-label ${styles.count}`}>
            {String(quoted.indexOf(cardIndex) + 1).padStart(2, "0")} /{" "}
            {String(quoted.length).padStart(2, "0")}
          </span>
        </div>

        {tune && (
          <div className={styles.tuner}>
            {(
              [
                ["fade", "Card fade (ms)", 100, 4000, 50],
                ["travel", "Marker travel (ms)", 200, 2400, 50],
                ["dwell", "Dwell per stage (ms)", 1500, 9000, 100],
              ] as const
            ).map(([key, label, min, max, stepBy]) => (
              <label key={key} className={`mono-label ${styles.tunerRow}`}>
                {label}
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={stepBy}
                  value={tune[key]}
                  onChange={(e) =>
                    setTune({ ...tune, [key]: Number(e.target.value) })
                  }
                />
                {tune[key]}
              </label>
            ))}
            <label className={`mono-label ${styles.tunerRow}`}>
              Fade curve
              <select
                value={tune.curve}
                onChange={(e) => setTune({ ...tune, curve: e.target.value })}
              >
                {CURVES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>
    </m.section>
  );
}
