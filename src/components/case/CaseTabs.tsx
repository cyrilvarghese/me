"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./CaseTabs.module.css";

export type Tab = { id: string; label: string; panel: React.ReactNode };

/** Two ways through the case, as tabs. The line-variant bar is one element
    that slides between triggers rather than a border per trigger, so the
    move reads as one object travelling — and it travels on transform
    alone (translate + scaleX against the list width), never on left/width,
    which would lay out on every frame.

    Each panel scrolls inside itself rather than lengthening the page, so
    switching tabs resets that panel to its top and leaves the page scroll
    exactly where the reader left it. */
export default function CaseTabs({ tabs, label }: { tabs: Tab[]; label: string }) {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const [bar, setBar] = useState<{ x: number; s: number } | null>(null);
  const [barH, setBarH] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
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

  /* the label widths and the bar's height move with the type scale */
  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    if (barRef.current) ro.observe(barRef.current);
    return () => ro.disconnect();
  }, [measure]);

  /* Each switch starts the new panel at its own top. Because the panel is
     the scroll container, this is a scrollTop reset on that element — the
     page scroll is never touched, so the reader stays where they were and
     only the tab body rewinds. Safe to run on mount and safe under
     StrictMode's double-invoke: setting an already-zero scrollTop to zero
     does nothing. */
  useLayoutEffect(() => {
    const panel = panelRefs.current[active];
    if (panel) panel.scrollTop = 0;
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
          /* a scroll container needs to be focusable, or its content is
             unreachable by keyboard alone */
          tabIndex={0}
          hidden={i !== active}
          className={styles.panel}
          data-dir={dir > 0 ? "forward" : "back"}
          /* the pane fills what the sticky bar leaves of the viewport;
             barH is measured, since the bar's height moves with the
             type scale */
          style={{ maxHeight: `calc(100svh - ${barH}px)` }}
        >
          {t.panel}
        </div>
      ))}
    </>
  );
}
