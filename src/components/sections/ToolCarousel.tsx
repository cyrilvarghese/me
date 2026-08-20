"use client";

import { useEffect, useRef, useState } from "react";
import { capabilities } from "@/lib/data/capabilities";
import KnifeLayer from "@/components/knife/KnifeLayer";
import CompassRose from "@/components/compass/CompassRose";
import knife from "@/components/knife/knife.module.css";
import styles from "./ToolCarousel.module.css";

/** Cover-flow shaping for a card `d` card-widths from centre. */
function pose(d: number) {
  const t = Math.min(Math.abs(d), 2);
  return {
    // A gentle tuck only. Pulling side cards far inward puts their visual
    // position well short of their snap position, which makes a single swipe
    // read as though it skipped a tool.
    translate: -d * 14,
    rotateY: -d * 34,
    scale: 1 - t * 0.2,
    opacity: 1 - t * 0.42,
  };
}

/**
 * The mobile view of the six tools. The desktop lineup is a scrubbed beat
 * inside OutcomeTransition and has never existed on phones — its years and
 * one-line histories simply went unseen. Here the tools are a swipe carousel
 * with the caption below it, and the compass close follows.
 *
 * Swipe is native CSS scroll-snap, so iOS momentum and keyboard both work for
 * free and the thing degrades to a plain horizontal scroller with JS off. The
 * only script is one passive scroll listener shaping the cover flow.
 */
export default function ToolCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const cards = Array.from(track.querySelectorAll<HTMLElement>("[data-card]"));
    const flat = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const shape = () => {
      raf = 0;
      const mid = track.scrollLeft + track.clientWidth / 2;
      let nearest = 0;
      let best = Infinity;

      cards.forEach((card, i) => {
        const d = (card.offsetLeft + card.offsetWidth / 2 - mid) / card.offsetWidth;
        // the backlight follows focus even under reduced motion — it is a
        // static highlight there, not movement
        card.style.setProperty("--focus", String(Math.max(0, 1 - Math.abs(d))));
        if (!flat) {
          const p = pose(d);
          card.style.transform = `perspective(760px) translateX(${p.translate}%) rotateY(${p.rotateY}deg) scale(${p.scale})`;
          card.style.opacity = String(p.opacity);
          // only the front card should ever catch a tap
          card.style.pointerEvents = Math.abs(d) < 0.5 ? "auto" : "none";
        }
        if (Math.abs(d) < best) {
          best = Math.abs(d);
          nearest = i;
        }
      });

      setActive(nearest);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(shape);
    };

    shape();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const go = (i: number) => {
    const track = trackRef.current;
    const card = track?.querySelectorAll<HTMLElement>("[data-card]")[i];
    if (!track || !card) return;
    track.scrollTo({
      left: card.offsetLeft + card.offsetWidth / 2 - track.clientWidth / 2,
      behavior: "smooth",
    });
  };

  const current = capabilities[active];

  return (
    <section className={styles.section} aria-label="The six tools">
      <p className={`serif-display ${styles.heading}`}>
        One problem, many parts — a tool for each.
      </p>

      <div className={styles.track} ref={trackRef}>
        {capabilities.map((c) => (
          <div key={c.id} className={styles.card} data-card={c.id} aria-hidden="true">
            {/* Rotating about the shared hinge leaves the standing tool in a
                narrow strip up the middle of the canvas — roughly 40% of its
                height. .artScale blows that strip up to fill the card. */}
            <div className={styles.artScale}>
              <div className={knife.canvas}>
                {/* closed tools point left, so +90° stands one upright — the
                    same pose the desktop lineup puts them in */}
                <div className={knife.tool} style={{ transform: "rotate(90deg)" }}>
                  <KnifeLayer id={c.id} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* one caption, swapped as you swipe — the tool is front and centre and
          its description reads below it */}
      <div className={styles.caption} aria-live="polite">
        <p className={`mono-label ${styles.label}`}>{current.label}</p>
        <p className={`mono-label ${styles.years}`}>{current.duration}</p>
        <p className={`mono-label ${styles.period}`}>{current.years}</p>
        <p className={styles.line}>
          {current.line.split("\n").map((fact, fi, facts) => (
            <span
              key={fact}
              className={`${styles.fact} ${
                facts.length > 1 && fi === facts.length - 1 ? styles.factNow : ""
              }`}
            >
              {fact}
            </span>
          ))}
        </p>
      </div>

      <div className={styles.dots}>
        {capabilities.map((c, i) => (
          <button
            key={c.id}
            type="button"
            className={`${styles.dot} ${i === active ? styles.dotOn : ""}`}
            aria-label={c.label}
            aria-current={i === active}
            onClick={() => go(i)}
          />
        ))}
      </div>

      <div className={styles.close}>
        <div className={styles.compass} aria-hidden="true">
          <CompassRose />
        </div>
        <h2 className={`serif-display ${styles.statement}`}>
          Tools matter, but&nbsp;.&nbsp;.&nbsp;.
        </h2>
        <h2 className={`serif-display ${styles.statement}`}>
          <em>Outcomes</em> matter more.
        </h2>
      </div>
    </section>
  );
}
