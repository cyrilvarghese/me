"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { sectionArrival } from "@/lib/section-anchor";
import styles from "./ScrollRuler.module.css";

const TICKS = 48;

/** The stops named on the rail where they fall, id -> the word shown.
    The ruler already knew where every section starts; this says which.
    Kept as a map rather than the bare ids because the hero's anchor is
    "top" and the reader is being offered a beginning, not a coordinate. */
const NAMED = new Map([
  ["top", "Start"],
  ["work", "Work"],
  ["about", "About"],
  ["contact", "Contact"],
]);

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
  /* The named marks, each with the exact pixel offset the playhead stops
     at for that section. They are NOT hung off the 48 ticks: a tick is
     one of 48 evenly spaced positions, the playhead stops wherever the
     section actually starts, and rounding one to the other leaves the
     mark half a tick from the line that is supposed to meet it. Their own
     positions make the dash, the word and the playhead agree.

     `to` is set only on marks born from a named beat (see the
     data-ruler-beats parsing below): a beat lives at a scroll offset
     inside a pin spacer, not at an element, so its mark carries the
     target scrollY itself instead of an anchor href. */
  const [marks, setMarks] = useState<
    { id: string; name: string; y: number; to?: number }[]
  >([]);

  useEffect(() => {
    const rail = railRef.current;
    const marker = markerRef.current;
    if (!rail || !marker) return;

    /* [data-tick], not "span": a loose tag selector once swept the
       marker's own child up as a 49th tick, whose missing inner line then
       threw on every scroll frame. That child is gone, but the explicit
       hook is what stops the next one from doing it again. */
    const ticks = Array.from(rail.querySelectorAll<HTMLElement>("[data-tick]"));
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
      const H = rail.clientHeight;
      const majors = new Set<number>();
      const found: { id: string; name: string; y: number; to?: number }[] = [];
      const index = (f: number) =>
        Math.round(Math.min(1, Math.max(0, f)) * (TICKS - 1));
      const add = (f: number) => majors.add(index(f));
      document.querySelectorAll<HTMLElement>("main > section").forEach((s) => {
        const top = s.getBoundingClientRect().top + window.scrollY;
        add(top / max);
        const name = NAMED.get(s.id);
        if (name) {
          // the same expression update() uses for the playhead, so the
          // mark and the line cannot disagree. The offset is the section's
          // arrival, not its top — see sectionArrival.
          const f = Math.min(1, Math.max(0, sectionArrival(s) / max));
          found.push({ id: s.id, name, y: f * (H - 2) });
        }
        const range = s.offsetHeight - window.innerHeight;
        if (s.dataset.rulerBeats && range > 0) {
          // a beat is "0.416" or "0.416:Skills" — the bare form is a major
          // tick, the named form also gets a mark like the section names
          for (const b of s.dataset.rulerBeats.split(",")) {
            const [frac, beatName] = b.split(":");
            const f = parseFloat(frac);
            if (Number.isNaN(f)) continue;
            const at = top + f * range;
            add(at / max);
            if (beatName) {
              const bf = Math.min(1, Math.max(0, at / max));
              found.push({ id: `beat-${beatName}`, name: beatName, y: bf * (H - 2), to: at });
            }
          }
        }
      });
      /* Ticks near a named mark step aside by DISTANCE, not by rounded
         index. The mark sits at the exact section fraction; the ticks sit
         in 48 even slots. A section that lands midway between two slots is
         half a pitch from BOTH — hiding only the rounded one left its
         neighbour drawn 4px from the mark's dash, a doubled line beside
         the word. ¾ of a pitch clears whichever ticks crowd the dash and
         never reaches past the mark's immediate neighbours. */
      const pitch = (H - 1) / (TICKS - 1);
      ticks.forEach((el, i) => {
        el.classList.toggle(styles.major, majors.has(i));
        el.classList.toggle(
          styles.replaced,
          found.some((m) => Math.abs(i * pitch - m.y) < pitch * 0.75)
        );
      });
      setMarks((prev) =>
        JSON.stringify(prev) === JSON.stringify(found) ? prev : found
      );
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
        <span key={i} className={styles.tick} data-tick="">
          <i className={styles.line} />
        </span>
      ))}
      {/* tabIndex -1 on purpose: the rail is aria-hidden decoration, and a
          focusable child inside it would be a keyboard trap with no
          accessible name. The header carries the same three links for
          anyone not using a pointer. */}
      {marks.map((m) => {
        const to = m.to;
        return (
          <a
            key={m.id}
            /* section marks travel by hash so SmoothAnchors owns the glide;
               a beat mark has no element to name, so it glides itself with
               the same tuning, and jumps instead under reduced motion */
            href={to === undefined ? `#${m.id}` : undefined}
            onClick={
              to === undefined
                ? undefined
                : () => {
                    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                      window.scrollTo(0, to);
                      return;
                    }
                    const distance = Math.abs(to - window.scrollY);
                    gsap.to(window, {
                      scrollTo: { y: to, autoKill: true },
                      duration: gsap.utils.clamp(
                        0.5,
                        1.2,
                        0.4 + distance / (window.innerHeight * 6)
                      ),
                      ease: "power2.inOut",
                      overwrite: "auto",
                    });
                  }
            }
            className={styles.mark}
            style={{ transform: `translateY(${m.y}px)` }}
            tabIndex={-1}
          >
            <i className={styles.markDash} />
            <span className={styles.markName}>{m.name}</span>
          </a>
        );
      })}
      <div ref={markerRef} className={styles.marker} />
    </div>
  );
}
