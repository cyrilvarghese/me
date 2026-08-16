"use client";

import { useEffect, useRef } from "react";
import styles from "./ScrollRuler.module.css";

const TICKS = 48;

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

    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      marker.style.transform = `translateY(${p * (rail.clientHeight - 2)}px)`;
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={railRef} className={styles.rail} aria-hidden="true">
      {Array.from({ length: TICKS }, (_, i) => (
        <span key={i} className={`${styles.tick} ${i % 8 === 0 ? styles.major : ""}`} />
      ))}
      <div ref={markerRef} className={styles.marker} />
    </div>
  );
}
