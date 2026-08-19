"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./CaseTabs.module.css";

export type Section = { id: string; label: string; body: React.ReactNode };

/** Section nav for a case study. Not tabs: both sections are always on the
    page, and the bar scrolls to them rather than swapping what exists.

    That distinction is the whole design. Tabs hide half the case from
    search engines and from anyone who scrolls rather than clicks, and they
    make the page's length lie. Here the reader can scroll straight through
    and the bar simply tracks where they are.

    Buttons, not anchors: the app intercepts every `a[href^="#"]` at the
    document to drive its own GSAP glide, which needs a ScrollTrigger on
    the page to neutralise CSS smooth-scroll — and the case routes build
    none, so anchors silently do nothing here. scrollIntoView is not
    intercepted and honours scroll-margin-top on its own. */
export default function CaseNav({ sections, label }: { sections: Section[]; label: string }) {
  const [active, setActive] = useState(0);
  const [bar, setBar] = useState<{ x: number; s: number } | null>(null);
  const [barH, setBarH] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const measure = useCallback(() => {
    const el = refs.current[active];
    const list = listRef.current;
    if (!el || !list) return;
    const width = list.offsetWidth || 1;
    setBar({ x: el.offsetLeft, s: el.offsetWidth / width });
    if (barRef.current) setBarH(barRef.current.offsetHeight);
  }, [active]);

  /* before paint, so the bar is never seen at the wrong place */
  useLayoutEffect(measure, [measure]);

  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    if (barRef.current) ro.observe(barRef.current);
    return () => ro.disconnect();
  }, [measure]);

  /* The bar follows the reader rather than the reader following the bar.
     The top margin is the bar's own height, so a section counts as current
     the moment it clears the bar; the bottom margin keeps the band shallow
     so only one section qualifies at a time. */
  useEffect(() => {
    const els = sectionRefs.current.filter(Boolean) as HTMLElement[];
    if (!els.length || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting);
        if (!seen.length) return;
        const topmost = seen.reduce((a, b) =>
          a.boundingClientRect.top <= b.boundingClientRect.top ? a : b
        );
        const i = els.indexOf(topmost.target as HTMLElement);
        if (i >= 0) setActive(i);
      },
      { rootMargin: `-${barH + 4}px 0px -55% 0px`, threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [barH, sections.length]);

  /* scroll-margin-top on the target does the offsetting, so the heading
     lands under the bar rather than behind it. Behaviour is left to CSS,
     which already turns the glide off under prefers-reduced-motion. */
  const goTo = (i: number) => sectionRefs.current[i]?.scrollIntoView({ block: "start" });

  return (
    <>
      {/* the sticky ground is full-bleed and the shell sits inside it —
          if the sticky element itself carried .section-shell, its
          max-width would let the page scroll past it at both gutters */}
      <div ref={barRef} className={styles.bar}>
        <div className="section-shell">
          <nav ref={listRef} aria-label={label} className={styles.list}>
            {sections.map((s, i) => (
              <button
                key={s.id}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="button"
                /* aria-current, not aria-selected: nothing is being
                   selected — this reports where the reader is */
                aria-current={i === active ? "true" : undefined}
                className={`mono-label ${styles.tab}`}
                onClick={() => goTo(i)}
              >
                {s.label}
              </button>
            ))}

            {/* one travelling bar. Hidden until measured so it never
                flashes at x=0; `data-ready` also gates the transition, so
                the first paint places it rather than sliding it in. */}
            <span
              aria-hidden="true"
              className={styles.indicator}
              data-ready={bar ? "true" : "false"}
              style={bar ? { transform: `translateX(${bar.x}px) scaleX(${bar.s})` } : undefined}
            />
          </nav>
        </div>
      </div>

      {sections.map((s, i) => (
        <div
          key={s.id}
          ref={(el) => {
            sectionRefs.current[i] = el;
          }}
          id={s.id}
          style={{ scrollMarginTop: `${barH}px` }}
        >
          {s.body}
        </div>
      ))}
    </>
  );
}
