"use client";

import { useEffect, useState } from "react";
import styles from "./Header.module.css";

const ITEMS = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

/**
 * The nav, with the stop the reader is standing in marked by a red rule.
 *
 * Scroll position, not IntersectionObserver: the three pinned scrub
 * sections are 300–625vh tall with pin spacers between them, so at any
 * moment several of them intersect the viewport and the observer's
 * entries say nothing about which one the reader is actually in. A
 * section is current here once its top has crossed a probe line 45% down
 * the viewport — the same "has this arrived" test the eye makes.
 */
export default function SiteNav() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const probe = window.scrollY + window.innerHeight * 0.45;
      let current: string | null = null;
      for (const { id } of ITEMS) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top + window.scrollY <= probe) current = id;
      }
      // the last section is short and the page ends inside it, so its top
      // may never reach the probe — landing at the bottom means Contact
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && max - window.scrollY < 2) current = ITEMS[ITEMS.length - 1].id;
      setActive((prev) => (prev === current ? prev : current));
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
    <nav className={styles.nav} aria-label="Site">
      {ITEMS.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className="mono-label"
          /* "location", not "page": these are places within this page.
             It is also what draws the rule — one attribute carries the
             state to a screen reader and to the stylesheet alike. */
          aria-current={active === item.id ? "location" : undefined}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
