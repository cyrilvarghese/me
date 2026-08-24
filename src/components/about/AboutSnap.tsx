"use client";

import { useEffect } from "react";
import { gsap } from "@/lib/gsap";

/** Wheel silence before a spent gesture is forgotten, in ms. */
const QUIET_MS = 140;

/** How long a scroll the wheel did NOT drive — a scrollbar dragged, a
    PageDown — has to hold still before the page settles, in ms. */
const SETTLE_MS = 120;

/** Already standing on a panel, in px: inside this the page stays put.
    This is what keeps the door's own scrollIntoView landing (RoomLight)
    and the browser's scroll restoration from being answered with a
    glide to somewhere the reader never asked to go. */
const NEAR = 24;

/** Below this a wheel event is a tremor, not an intention. */
const MIN_DELTA = 4;

/**
 * The glide between chapters on the About page.
 *
 * The panels are one viewport each and the page comes to rest on one at
 * a time — that part was never in question. What was is the arrival.
 *
 * CSS scroll snapping says only *where* to land, never how fast or along
 * what curve, and Chromium's own snap animation is hardcoded and short,
 * so a single wheel tick landed like a wall. Softening it by letting the
 * browser scroll and then easing the remainder was worse, not better:
 * the page moved, stopped, paused, and moved again, which reads as a
 * stagger rather than as travel (Cyril, 2026-08-24).
 *
 * So the wheel is taken whole. Nothing scrolls natively — the tick is
 * swallowed and one tween carries the entire panel, because a single
 * continuous motion is the only arrangement there is anything smooth to
 * feel in.
 *
 * Three things stay the browser's, because a tween has no business in
 * any of them: touch and reduced-motion keep the native snap
 * (globals.css); a chapter grown taller than the window scrolls freely
 * inside itself, because it is read rather than crossed; and a scroll
 * the wheel did not drive is left alone until it stops, then settled.
 *
 * The rule the home page learned the hard way holds here too
 * (OutcomeTransition): the page never moves against the scroll. One tick
 * down goes to the panel *ahead*, never back to the one just left.
 */
export default function AboutSnap() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;

    /* the gesture is spent: it has already been answered with a panel */
    let spent = false;
    /* the tween itself has landed (the lock outlives it — see onWheel) */
    let landed = true;
    /* our own scroll writes are not a gesture, and must not arm a settle */
    let gliding = false;
    /* the size of the last wheel event, which is how a gesture still
       being made is told from the tail of one already answered */
    let lastAbs = 0;
    let forget = 0;
    let settleTimer = 0;
    let lastY = window.scrollY;
    /* 1 down, -1 up: which way the reader was going when they stopped */
    let dir = 1;

    /* Panel tops and bottoms, measured once and kept until the page
       changes shape. They move when the door opens (the chapters go
       from display:none to nine viewports) and on every resize, and
       both of those change the document's height — so that is what the
       cache is keyed on. Measuring per wheel event instead would force
       a layout on every notch of the wheel. */
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
       wheel is handed straight back to the browser — carrying the
       reader off mid-paragraph is not a smoother arrival, it is a lost
       one. The snap picks up again on the panel below, which fits. */
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

    /* the gesture stays spent while the wheel is still delivering; only
       silence retires it */
    const hold = () => {
      clearTimeout(forget);
      forget = window.setTimeout(() => {
        spent = false;
        lastAbs = 0;
      }, QUIET_MS);
    };

    const glide = (to: number, ease: string) => {
      const y = window.scrollY;
      const target = gsap.utils.clamp(0, root.scrollHeight - window.innerHeight, to);
      const distance = Math.abs(target - y);
      if (distance <= NEAR) return;
      spent = true;
      landed = false;
      gliding = true;
      clearTimeout(forget);
      gsap.to(window, {
        scrollTo: { y: target, autoKill: true },
        /* One panel lands a little over half a second: long enough to
           read as travel between two places rather than as a cut, short
           enough that a reader moving quickly is never waiting on it.
           Scaled by distance so a scrollbar drag across three chapters
           does not cross them at one notch's speed. */
        duration: gsap.utils.clamp(0.35, 0.9, 0.28 + distance / (window.innerHeight * 3.4)),
        ease,
        overwrite: "auto",
        /* autoKill hands the scroll back if something else moves it — a
           scrollbar dragged mid-glide. The wheel cannot trigger it any
           more: it never reaches the document. */
        onAutoKill() {
          gliding = false;
          landed = true;
          spent = false;
          clearTimeout(forget);
          lastY = window.scrollY;
          arm();
        },
        onComplete() {
          gliding = false;
          landed = true;
          lastY = window.scrollY;
          /* the gesture is not retired here — the trackpad is usually
             still coasting, and its tail must not buy a second panel */
          hold();
        },
      });
    };

    const onWheel = (e: WheelEvent) => {
      if (root.dataset.room !== "open") return;
      /* pinch-zoom is the browser's, always */
      if (e.ctrlKey) return;
      const abs = Math.abs(e.deltaY);
      if (abs < MIN_DELTA) return;

      if (spent) {
        /* swallow it either way: nothing may scroll behind the tween,
           and nothing may scroll on the coast that follows it */
        e.preventDefault();
        hold();
        /* Momentum from a flick decays event over event, so a delta no
           larger than the one before it is the tail of the gesture that
           has already been answered. Anything holding steady or growing
           — a sustained two-finger scroll, the discrete notch of a
           mouse wheel — is the reader still asking, and buys the next
           panel as soon as the current one has landed. */
        if (!landed || abs < lastAbs) {
          lastAbs = abs;
          return;
        }
        spent = false;
        clearTimeout(forget);
      }

      const way = e.deltaY > 0 ? 1 : -1;
      const view = window.innerHeight;
      const y = window.scrollY;
      lastAbs = abs;

      if (readingInside(y, view, way)) return;

      const to = ahead(y, way);
      /* nothing ahead — the head going up, the close going down. Left to
         the browser so the page can still overscroll at its ends. */
      if (to === undefined) return;

      e.preventDefault();
      dir = way;
      /* ease-OUT, not the inOut a thing drifting across the screen would
         take: this is answering an input, and a slow first 150ms after
         the wheel moves reads as the page hesitating. Out leaves at once
         and settles into the panel. */
      glide(to, "power2.out");
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
      /* inOut here: no input is being answered, the page is moving of
         its own accord, so it accelerates and brakes */
      glide(to, "power2.inOut");
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
