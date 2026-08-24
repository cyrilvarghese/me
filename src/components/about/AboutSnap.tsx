"use client";

import { useEffect } from "react";
import { gsap } from "@/lib/gsap";

/** Wheel silence that retires a spent gesture, in ms. */
const QUIET_MS = 150;

/** How long a gesture has to still be pushing, measured from the moment
    its glide began, before it is allowed to buy a second panel — and how
    much of its own peak it has to still be delivering. Momentum from a
    flick is well decayed by then; a hand that is still scrolling is not. */
const SUSTAIN_MS = 700;
const SUSTAIN_FRAC = 0.6;

/** How long a scroll the wheel did NOT drive — a scrollbar dragged, a
    PageDown — has to hold still before the page settles, in ms. */
const SETTLE_MS = 120;

/** Already standing on a panel, in px: inside this the page stays put.
    This is what keeps the door's own scrollIntoView landing (RoomLight)
    and the browser's scroll restoration from being answered with a
    glide to somewhere the reader never asked to go. */
const NEAR = 24;

/** Below this a wheel event is a tremor, and starts nothing. */
const MIN_DELTA = 4;

/**
 * The glide between chapters on the About page.
 *
 * The panels are one viewport each and the page comes to rest on one at
 * a time. CSS scroll snapping says only *where* to land, never how fast
 * or along what curve, so the wheel is taken whole here instead: the tick
 * never reaches the document, and one tween carries the entire panel.
 *
 * Two things make that hold, and both were learned the hard way
 * (Cyril, 2026-08-24):
 *
 * ONE GESTURE, ONE PANEL. A trackpad keeps delivering for the best part
 * of a second after the fingers lift, so the whole problem is knowing
 * when a gesture has ended. Two rules do it. Every event is swallowed
 * while a glide is spent, however small — a tail event under MIN_DELTA
 * used to escape, scroll the document natively, and kill the tween
 * through autoKill, which unlocked mid-panel and let the next event
 * start a second glide from halfway. And the test for "still pushing"
 * is against the gesture's PEAK, not the event before it: momentum
 * decays in integer steps and plateaus constantly, so comparing
 * neighbours read every plateau as a fresh push and bought a panel for
 * each one.
 *
 * SMOOTH MEANS THE CURVE, NOT JUST THE TIME. power1.inOut, which is the
 * ease the home page's own scroll snap settles on (OutcomeTransition) —
 * it leaves and arrives at zero speed, so neither end is a lurch.
 *
 * Three things stay the browser's: touch and reduced-motion keep the
 * native snap (globals.css); a chapter grown taller than the window
 * scrolls freely inside itself, because it is read rather than crossed;
 * and a scroll the wheel did not drive is left alone until it stops.
 *
 * The page never moves against the scroll (OutcomeTransition): one tick
 * down goes to the panel ahead, never back to the one just left.
 */
export default function AboutSnap() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;

    /* the gesture is spent: it has already been answered with a panel */
    let spent = false;
    /* the tween itself has landed (the gesture outlives it) */
    let landed = true;
    /* our own scroll writes are not a gesture, and must not arm a settle */
    let gliding = false;
    /* the biggest event this gesture has delivered, and when its glide
       started — together these are how a hand still scrolling is told
       from a trackpad still coasting */
    let peak = 0;
    let glideAt = 0;
    let forget = 0;
    let settleTimer = 0;
    let lastY = window.scrollY;
    /* 1 down, -1 up: which way the reader was going when they stopped */
    let dir = 1;

    /* Panel tops and bottoms, measured once and kept until the page
       changes shape. They move when the door opens (the chapters go
       from display:none to nine viewports) and on every resize, and
       both change the document's height — so that is what the cache is
       keyed on. Measuring per wheel event would force a layout on every
       notch of the wheel. */
    let cache: { top: number; bottom: number }[] = [];
    let cachedHeight = -1;
    const panels = () => {
      const h = root.scrollHeight;
      if (h !== cachedHeight || !cache.length) {
        const y = window.scrollY;
        cache = Array.from(
          document.querySelectorAll<HTMLElement>("[data-panel]"),
          (el) => {
            const r = el.getBoundingClientRect();
            return { top: Math.round(r.top + y), bottom: Math.round(r.bottom + y) };
          }
        );
        cachedHeight = h;
      }
      return cache;
    };
    const remeasure = () => {
      cachedHeight = -1;
    };

    /* A chapter whose copy runs long on a short window grows past its
       viewport rather than clipping (about.module.css), and a panel
       taller than the window is READ by scrolling inside it. While
       there is still any of it to reach in the direction of travel the
       wheel goes straight back to the browser — carrying the reader off
       mid-paragraph is not a smoother arrival, it is a lost one. */
    const readingInside = (y: number, view: number, way: number) => {
      const here = [...panels()].reverse().find((p) => y >= p.top - NEAR);
      if (!here) return false;
      if (here.bottom - here.top <= view + NEAR) return false;
      return way >= 0 ? here.bottom > y + view + NEAR : y > here.top + NEAR;
    };

    /* the panel ahead in the direction of travel — never the one just
       left, which is what nearest-target snapping would reach for */
    const ahead = (y: number, way: number) => {
      const tops = panels().map((p) => p.top);
      return way >= 0
        ? tops.find((t) => t > y + NEAR)
        : [...tops].reverse().find((t) => t < y - NEAR);
    };

    /* the gesture stays spent while the wheel is still delivering
       anything at all; only silence retires it */
    const hold = () => {
      clearTimeout(forget);
      forget = window.setTimeout(() => {
        spent = false;
        peak = 0;
      }, QUIET_MS);
    };

    const glide = (to: number) => {
      const y = window.scrollY;
      const target = gsap.utils.clamp(0, root.scrollHeight - window.innerHeight, to);
      const distance = Math.abs(target - y);
      if (distance <= NEAR) return;
      spent = true;
      landed = false;
      gliding = true;
      glideAt = performance.now();
      clearTimeout(forget);
      gsap.to(window, {
        scrollTo: { y: target, autoKill: true },
        /* One panel takes about eight tenths of a second. That is slow
           for a UI animation and right for this: the thing moving is the
           whole page, and a viewport crossed in half a second reads as a
           cut rather than as travel. Scaled by distance so a scrollbar
           drag across three chapters does not cross them at one notch's
           speed. */
        duration: gsap.utils.clamp(0.5, 1.2, 0.4 + distance / (window.innerHeight * 2.4)),
        /* Leaves and arrives at zero speed. An `out` curve starts at its
           maximum, which on a whole-viewport move is the lurch that read
           as sudden; `inOut` has no abrupt end at either side. Same ease
           the home page's snap settles on (OutcomeTransition). */
        ease: "power1.inOut",
        overwrite: "auto",
        /* autoKill hands the scroll back if something else moves it — a
           scrollbar dragged mid-glide. The wheel cannot trigger it: it
           never reaches the document. */
        onAutoKill() {
          gliding = false;
          landed = true;
          spent = false;
          peak = 0;
          clearTimeout(forget);
          lastY = window.scrollY;
          arm();
        },
        onComplete() {
          gliding = false;
          landed = true;
          lastY = window.scrollY;
          /* not retired here — the trackpad is usually still coasting,
             and its tail must not buy a second panel */
          hold();
        },
      });
    };

    const onWheel = (e: WheelEvent) => {
      if (root.dataset.room !== "open") return;
      /* pinch-zoom is the browser's, always */
      if (e.ctrlKey) return;
      const abs = Math.abs(e.deltaY);

      if (spent) {
        /* Everything is swallowed, however small. A tail event slipping
           through here is what used to scroll the document behind the
           tween and kill it through autoKill, halfway between panels. */
        e.preventDefault();
        hold();
        if (abs > peak) peak = abs;
        if (!landed) return;
        /* still going, long after the coast would have died: a hand,
           not momentum. Anything else waits for silence. */
        if (performance.now() - glideAt < SUSTAIN_MS) return;
        if (abs < peak * SUSTAIN_FRAC) return;
        spent = false;
        clearTimeout(forget);
      }

      if (abs < MIN_DELTA) return;

      const way = e.deltaY > 0 ? 1 : -1;
      const view = window.innerHeight;
      const y = window.scrollY;
      if (readingInside(y, view, way)) return;

      const to = ahead(y, way);
      /* nothing ahead — the head going up, the close going down. Left to
         the browser so the page can still overscroll at its ends. */
      if (to === undefined) return;

      e.preventDefault();
      dir = way;
      peak = abs;
      glide(to);
    };

    /* Everything the wheel did not do: a scrollbar dragged, a PageDown,
       a keyboard arrow. Nothing is swallowed there — the browser scrolls
       as it always has, and the page only settles once it stops. */
    const arm = () => {
      clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settle, SETTLE_MS);
    };

    function settle() {
      settleTimer = 0;
      if (root.dataset.room !== "open") return;
      if (spent || gliding) return;
      const y = window.scrollY;
      const view = window.innerHeight;
      const list = panels();
      if (!list.length) return;
      /* standing on one already: stay */
      if (list.some((p) => Math.abs(p.top - y) <= NEAR)) return;
      if (readingInside(y, view, dir)) return;
      const to = ahead(y, dir);
      if (to === undefined) return;
      glide(to);
    }

    const onScroll = () => {
      const y = window.scrollY;
      if (gliding || spent) {
        lastY = y;
        return;
      }
      if (y !== lastY) dir = y > lastY ? 1 : -1;
      lastY = y;
      arm();
    };

    /* A focus change scrolls the browser to the focused element —
       tabbing to a chapter link, or to the way back. Settling a panel on
       from there would carry the focused thing off screen. */
    const dropSettle = () => {
      clearTimeout(settleTimer);
      settleTimer = 0;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", remeasure);
    document.addEventListener("focusin", dropSettle);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", remeasure);
      document.removeEventListener("focusin", dropSettle);
      clearTimeout(forget);
      clearTimeout(settleTimer);
      gsap.killTweensOf(window);
    };
  }, []);

  return null;
}
