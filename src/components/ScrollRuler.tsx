"use client";

import { useEffect, useRef } from "react";
import styles from "./ScrollRuler.module.css";

const TICKS = 48;

/** The nav's three destinations, named on the rail where they fall. The
    ruler already knew where every section starts; this says which. */
const NAMED = new Set(["work", "about", "contact"]);

/**
 * Line minimap: a fixed tick ruler on the left with a red playhead that
 * tracks overall page progress. The pinned scrub sections make the page
 * feel stuck — this is standing proof that scrolling moves the story.
 * Direct transform writes on a passive listener; no easing, so it also
 * behaves as plain scroll feedback under reduced motion.
 */
export default function ScrollRuler() {
  const railRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rail = railRef.current;
    const marker = markerRef.current;
    if (!rail || !marker) return;

    const ticks = Array.from(rail.querySelectorAll<HTMLElement>("span"));
    /* the wave scales the LINE inside each tick, never the tick itself —
       a scaleX on the tick would stretch the section label with it */
    const lines = ticks.map((t) => t.firstElementChild as HTMLElement);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // major ticks land on the page's real beats: every section start is a
    // chapter, and scrubbed sections declare their internal completion
    // beats via data-ruler-beats (fractions of their own scroll range) —
    // the ruler is a map of the choreography, not decoration
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const majors = new Set<number>();
      const labels = new Map<number, string>();
      const index = (f: number) =>
        Math.round(Math.min(1, Math.max(0, f)) * (TICKS - 1));
      const add = (f: number) => majors.add(index(f));
      document.querySelectorAll<HTMLElement>("main > section").forEach((s) => {
        const top = s.getBoundingClientRect().top + window.scrollY;
        add(top / max);
        if (NAMED.has(s.id)) labels.set(index(top / max), s.id);
        const range = s.offsetHeight - window.innerHeight;
        if (s.dataset.rulerBeats && range > 0) {
          for (const b of s.dataset.rulerBeats.split(",")) {
            const f = parseFloat(b);
            if (!Number.isNaN(f)) add((top + f * range) / max);
          }
        }
      });
      ticks.forEach((el, i) => {
        el.classList.toggle(styles.major, majors.has(i));
        const label = labels.get(i);
        if (label) el.dataset.rulerLabel = label;
        else delete el.dataset.rulerLabel;
      });
    };

    let raf = 0;
    const update = () => {
      raf = 0;
      const H = rail.clientHeight;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      const y = p * (H - 2);
      marker.style.transform = `translateY(${y}px)`;

      if (reduce) return;
      // proximity wave: ticks swell as the playhead nears and relax as it
      // leaves — distance-driven, so the bulge physically rides with it
      const step = H / (TICKS - 1);
      const RADIUS = 3.5; // in ticks
      for (let i = 0; i < ticks.length; i++) {
        const d = Math.abs(i * step - y) / step;
        if (d >= RADIUS) {
          if (lines[i].style.transform) lines[i].style.transform = "";
          continue;
        }
        const t = 1 - d / RADIUS;
        const ease = t * t * (3 - 2 * t); // smoothstep falloff
        lines[i].style.transform = `scaleX(${1 + 1.1 * ease})`;
      }
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const remeasure = () => {
      measure();
      queue();
    };

    measure();
    update();
    // GSAP pin spacers finish laying out after hydration — measure again
    // once the dust settles so the beats sit at their final offsets
    const settle = window.setTimeout(measure, 1000);
    window.addEventListener("load", remeasure);
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", remeasure);
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("load", remeasure);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", remeasure);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={railRef} className={styles.rail} aria-hidden="true">
      {Array.from({ length: TICKS }, (_, i) => (
        <span key={i} className={styles.tick}>
          <i className={styles.line} />
        </span>
      ))}
      <div ref={markerRef} className={styles.marker} />
    </div>
  );
}
