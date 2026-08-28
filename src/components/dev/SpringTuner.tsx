"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { spring } from "motion";
import styles from "./SpringTuner.module.css";

/* Dev-only tuner for the case-study morph. Nothing can animate
   ::view-transition-group from JS, so this does what globals.css does —
   samples motion's spring solver into a linear() easing — and injects it
   over the shipped rule. Adjust, click a case card, watch the real morph.

   It lives in the root layout so it survives the navigation: the panel is
   still there on the case study page to tune the reverse trip. */

/** the four selectors globals.css drives the morph with — the class for the
    forward trip, the three names for CaseBack's hand-driven reverse */
const SELECTORS = [
  "::view-transition-group(.morph)",
  "::view-transition-group(case-visual-creative-os)",
  "::view-transition-group(case-visual-case-chat)",
  "::view-transition-group(case-visual-msig)",
].join(",\n");

/** what is committed in globals.css, so "Reset" means something */
const SHIPPED = { visualDuration: 0.35, bounce: 0.27 };

function sample(visualDuration: number, bounce: number) {
  const generated = spring({ keyframes: [0, 1], visualDuration, bounce }).toString();
  const match = generated.match(/^(\d+)ms (linear\(([^)]+)\))$/);
  if (!match) return null;
  return {
    durationMs: Number(match[1]),
    easing: match[2],
    stops: match[3].split(",").map(Number),
  };
}

export default function SpringTuner() {
  const [visualDuration, setVisualDuration] = useState(SHIPPED.visualDuration);
  const [bounce, setBounce] = useState(SHIPPED.bounce);
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [reduced, setReduced] = useState(false);

  /* the reduced-motion block in globals.css flattens every view transition to
     0s !important, so with it on there is simply nothing to look at. Say so
     rather than letting the sliders appear broken. */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduced(mq.matches);
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);

  const curve = useMemo(() => sample(visualDuration, bounce), [visualDuration, bounce]);

  const css = useMemo(() => {
    if (!curve) return "";
    return `${SELECTORS} {
\tanimation-duration: ${curve.durationMs}ms;
\tanimation-timing-function: ${curve.easing};
}`;
  }, [curve]);

  /* Appended to <head> last, so it beats globals.css on document order at
     equal specificity — no !important, which would also outrank the
     reduced-motion block and take the choice away from the reader.

     The panel is pinned through the transition the same way the header is:
     its own group, no animation, old snapshot hidden. Without it the tuner
     cross-fades along with the page and you are grading the morph through a
     ghost of the thing you are grading it with. */
  useEffect(() => {
    if (!css) return;
    const el = document.createElement("style");
    el.setAttribute("data-spring-tuner", "");
    el.textContent = `${css}

::view-transition-group(spring-tuner) {
\tanimation: none;
\tz-index: 400;
}
::view-transition-old(spring-tuner) {
\tdisplay: none;
}
::view-transition-new(spring-tuner) {
\tanimation: none;
}`;
    document.head.append(el);
    return () => el.remove();
  }, [css]);

  const copy = useCallback(() => {
    const block = `/* motion spring { visualDuration: ${visualDuration}, bounce: ${bounce} } */
${css}`;
    void navigator.clipboard.writeText(block).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  }, [css, visualDuration, bounce]);

  if (!curve) return null;

  const peak = Math.max(...curve.stops);
  const overshoot = (peak - 1) * 100;
  const isShipped =
    visualDuration === SHIPPED.visualDuration && bounce === SHIPPED.bounce;

  /* plot the linear() stops themselves rather than re-solving the spring:
     these ARE what CSS will run, sampling resolution included */
  const W = 260;
  const H = 96;
  const top = Math.max(1.02, peak);
  const points = curve.stops
    .map((v, i) => {
      const x = (i / (curve.stops.length - 1)) * W;
      const y = H - (v / top) * H;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <aside
      className={styles.panel}
      style={{ viewTransitionName: "spring-tuner" }}
      data-open={open}
    >
      <button
        type="button"
        className={`mono-label ${styles.toggle}`}
        onClick={() => setOpen((o) => !o)}
      >
        Spring {open ? "—" : "+"}
      </button>

      {open && (
        <div className={styles.body}>
          <svg className={styles.graph} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
            {/* the target the morph is settling onto — overshoot is the
                distance the curve rides above this */}
            <line
              x1="0"
              y1={H - (1 / top) * H}
              x2={W}
              y2={H - (1 / top) * H}
              className={styles.target}
            />
            <polyline points={points} className={styles.trace} />
          </svg>

          <label className={styles.control}>
            <span className={`mono-label ${styles.name}`}>
              visualDuration <b className={styles.value}>{visualDuration.toFixed(2)}s</b>
            </span>
            <input
              type="range"
              min={0.15}
              max={0.8}
              step={0.01}
              value={visualDuration}
              onChange={(e) => setVisualDuration(Number(e.target.value))}
            />
          </label>

          <label className={styles.control}>
            <span className={`mono-label ${styles.name}`}>
              bounce <b className={styles.value}>{bounce.toFixed(2)}</b>
            </span>
            <input
              type="range"
              min={0}
              max={0.5}
              step={0.01}
              value={bounce}
              onChange={(e) => setBounce(Number(e.target.value))}
            />
          </label>

          <p className={`mono-label ${styles.readout}`}>
            {curve.durationMs}ms total · lands ~{Math.round(visualDuration * 1000)}ms ·
            overshoot {overshoot.toFixed(2)}%
          </p>

          {reduced && (
            <p className={`mono-label ${styles.warn}`}>
              Reduced motion is on — transitions are flattened to 0s, nothing will move.
            </p>
          )}

          <div className={styles.actions}>
            <button type="button" className={`mono-label ${styles.action}`} onClick={copy}>
              {copied ? "Copied" : "Copy CSS"}
            </button>
            <button
              type="button"
              className={`mono-label ${styles.action}`}
              onClick={() => {
                setVisualDuration(SHIPPED.visualDuration);
                setBounce(SHIPPED.bounce);
              }}
              disabled={isShipped}
            >
              Reset
            </button>
          </div>

          <p className={`mono-label ${styles.hint}`}>
            {isShipped ? "matches globals.css" : "overriding globals.css"} · click a case
            cover to run it
          </p>
        </div>
      )}
    </aside>
  );
}
