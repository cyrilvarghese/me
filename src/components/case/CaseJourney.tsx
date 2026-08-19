"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./CaseJourney.module.css";

export type JourneyStage = {
  label: string;
  quote?: string;
  consequence?: string;
};

/** A journey told one stage at a time: a straight rail of stages with a
    red marker sliding along it, and a card giving the active stage's
    quote in real HTML type — legible at any width, which is the reason
    this is a component and not a 1200-unit SVG whose 12px labels shrink
    with the panel.

    Stages without a quote are pass-through: the marker crosses them but
    the card never stops there. Auto-advance walks the quoted stages and
    stops the moment the reader takes the wheel (arrows, or a stage dot);
    reduced motion never auto-advances and skips the slide. */
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
  const [active, setActive] = useState(quoted[0] ?? 0);
  const [driven, setDriven] = useState(false); // reader took over
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLElement>(null);

  /* run the walk only while the band is on screen, and never for a
     reduced-motion reader — for them the card is a paged list */
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

  useEffect(() => {
    if (driven || !inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => {
      const at = quoted.indexOf(active);
      setActive(quoted[(at + 1) % quoted.length]);
    }, 4200);
    return () => clearTimeout(t);
  }, [active, driven, inView, quoted]);

  const go = (i: number) => {
    setDriven(true);
    setActive(i);
  };
  const step = (dir: 1 | -1) => {
    const at = quoted.indexOf(active);
    go(quoted[(at + dir + quoted.length) % quoted.length]);
  };

  const stage = stages[active];
  const fraction = active / (stages.length - 1);

  return (
    <section ref={rootRef} className={`section-shell ${styles.block}`}>
      <div className={styles.head}>
        <p className={`mono-label ${styles.eyebrow}`}>{eyebrow}</p>
        <h2 className={`serif-display ${styles.heading}`}>{heading}</h2>
      </div>

      <div className={styles.panel}>
        {/* the rail. Dots are buttons — the timeline is the nav */}
        <div className={styles.rail}>
          <span className={styles.track} aria-hidden="true" />
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
              style={{ left: `${(i / (stages.length - 1)) * 100}%` }}
              data-active={i === active || undefined}
              data-passed={i < active || undefined}
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
        <div key={active} className={styles.card}>
          <img src={icon} alt={iconLabel} className={styles.avatar} />
          <div className={styles.words}>
            <p className={styles.quote}>&#8220;{stage.quote}&#8221;</p>
            {stage.consequence && (
              <p className={styles.consequence}>
                <span className={styles.mark} aria-hidden="true" />
                {stage.consequence}
              </p>
            )}
          </div>
        </div>

        <div className={styles.controls}>
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
            {String(quoted.indexOf(active) + 1).padStart(2, "0")} /{" "}
            {String(quoted.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}
