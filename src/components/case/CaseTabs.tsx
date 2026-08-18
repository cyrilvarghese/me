"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./CaseTabs.module.css";

export type Tab = { id: string; label: string; panel: React.ReactNode };

/** Two ways through the case, as tabs. The line-variant bar is one element
    that slides between triggers rather than a border per trigger, so the
    move reads as one object travelling — and it travels on transform
    alone (translate + scaleX against the list width), never on left/width,
    which would lay out on every frame. */
export default function CaseTabs({ tabs, label }: { tabs: Tab[]; label: string }) {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const [bar, setBar] = useState<{ x: number; s: number } | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const mounted = useRef(false);

  const measure = useCallback(() => {
    const el = refs.current[active];
    const list = listRef.current;
    if (!el || !list) return;
    const width = list.offsetWidth || 1;
    setBar({ x: el.offsetLeft, s: el.offsetWidth / width });
  }, [active]);

  /* before paint, so the bar is never seen at the wrong place */
  useLayoutEffect(measure, [measure]);

  /* the label widths move with the type scale, so re-measure on resize */
  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [measure]);

  /* Every switch starts the new panel at its top. Left alone the reader
     keeps whatever scroll position they had, which lands them in the
     middle — or, when the new panel is shorter, past its end, where the
     browser clamps and the scroll looks thrown away.

     Measured from the PANEL, not the bar: the bar is sticky, so once
     pinned its getBoundingClientRect().top is 0 by definition and
     `rect.top + scrollY` merely returns the current scroll position —
     scrolling there does nothing. The panel is in normal flow, so its
     rect is honest; subtracting the bar's height puts the panel's first
     line directly under the pinned bar.

     Instant, not smooth: the content has already swapped, so a glide
     would only animate toward something that already changed. */
  useLayoutEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const panel = panelRefs.current[active];
    const barEl = barRef.current;
    if (!panel || !barEl) return;
    const top = panel.getBoundingClientRect().top + window.scrollY - barEl.offsetHeight;
    window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
  }, [active]);

  const go = (next: number) => {
    setDir(next > active ? 1 : -1);
    setActive(next);
  };

  /* roving focus: one tab stop for the list, arrows move within it */
  function onKeyDown(e: React.KeyboardEvent) {
    const last = tabs.length - 1;
    const next =
      e.key === "ArrowRight" ? (active === last ? 0 : active + 1)
      : e.key === "ArrowLeft" ? (active === 0 ? last : active - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : -1;
    if (next < 0) return;
    e.preventDefault();
    go(next);
    refs.current[next]?.focus();
  }

  return (
    <>
      {/* the sticky ground is full-bleed and the shell sits inside it —
          if the sticky element itself carried .section-shell, its
          max-width would let the page scroll past it at both gutters */}
      <div ref={barRef} className={styles.bar}>
        <div className="section-shell">
          <div
            ref={listRef}
            role="tablist"
            aria-label={label}
            className={styles.list}
            onKeyDown={onKeyDown}
          >
            {tabs.map((t, i) => (
              <button
                key={t.id}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${t.id}`}
                aria-controls={`panel-${t.id}`}
                aria-selected={i === active}
                tabIndex={i === active ? 0 : -1}
                className={`mono-label ${styles.tab}`}
                onClick={() => go(i)}
              >
                {t.label}
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
          </div>
        </div>
      </div>

      {tabs.map((t, i) => (
        <div
          key={t.id}
          ref={(el) => {
            panelRefs.current[i] = el;
          }}
          role="tabpanel"
          id={`panel-${t.id}`}
          aria-labelledby={`tab-${t.id}`}
          hidden={i !== active}
          className={styles.panel}
          data-dir={dir > 0 ? "forward" : "back"}
        >
          {t.panel}
        </div>
      ))}
    </>
  );
}
