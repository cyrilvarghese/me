"use client";

import { useEffect, useRef, useState } from "react";
import { m } from "motion/react";
import { capabilities } from "@/lib/data/capabilities";
import { experience } from "@/lib/data/experience";
import KnifeCanvas from "@/components/knife/KnifeCanvas";
import styles from "./Career.module.css";

const EASE_OUT_CUBIC = [0.215, 0.61, 0.355, 1] as const;

/**
 * Experience timeline: a sticky knife reconfigures per role — only the
 * blades that era actually used stay open (entry.caps). Entries are
 * one-liners + a single impact line by explicit user rule.
 */
export default function Career() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const items = Array.from(listRef.current?.querySelectorAll<HTMLElement>("[data-exp]") ?? []);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.exp));
        }
      },
      { rootMargin: "-42% 0px -42% 0px" }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const angles = Object.fromEntries(
    capabilities.map((c) => [c.id, experience[active].caps[c.id] ? c.openAngle : 0])
  );

  return (
    <section className={`section-shell ${styles.section}`} id="about" aria-label="Career">
      <h2 className={`serif-display ${styles.headline}`}>
        I didn&apos;t set out to become a generalist.
      </h2>
      <p className={styles.sub}>I kept expanding the part of the outcome I could own.</p>

      <div className={styles.timeline}>
        <div className={styles.knifeCol} aria-hidden="true">
          <KnifeCanvas angles={angles} animated />
        </div>

        <ol className={styles.entries} ref={listRef}>
          {experience.map((e, i) => (
            <li
              key={e.period}
              data-exp={i}
              className={`${styles.entry} ${i === active ? styles.entryActive : ""}`}
            >
              <m.div
                className="fx-hidden"
                initial={false}
                whileInView={{ opacity: 1, transform: "translateY(0px)" }}
                viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                transition={{ duration: 0.55, ease: EASE_OUT_CUBIC }}
              >
                <p className={`mono-label ${styles.meta}`}>
                  <span className={styles.duration}>{e.duration}</span>
                  <span className={styles.period}>{e.period}</span>
                </p>
                <h3 className={`serif-display ${styles.role}`}>{e.role}</h3>
                <p className={styles.impact}>{e.impact}</p>
              </m.div>
            </li>
          ))}
        </ol>
      </div>

      <p className={`serif-display ${styles.kicker}`}>
        Expansion of ownership, <em>not career switching.</em>
      </p>
    </section>
  );
}
