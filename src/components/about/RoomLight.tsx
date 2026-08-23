"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import styles from "./RoomLight.module.css";

/** the panel the reveal carries the reader to — the story proper */
export const FIRST_CHAPTER = "chapter-01";

/** how long the drop takes to spread — globals.css runs the bloom on
    the same number, so the feather dries exactly as the light arrives */
const BLOOM_MS = 2200;
/** how far the feather pushes the rim in and out while the paper is
    still wet, in px — roughness of the boundary, not its shape */
const FEATHER_MAX = 70;

/**
 * The threshold into the About page's light room.
 *
 * The page arrives on the dark ground the visitor just left, so nothing
 * jars on the way in, and the drawing sits without its colour. Clicking
 * it turns the whole page — every token at once, ground, ink, hairlines,
 * card shadows — the way a drop of ink takes to paper: landing on the
 * disc, spreading fast while the paper is wet, creeping as it dries,
 * with an edge that wicks unevenly along the grain.
 *
 * A same-document view transition does the spreading: the browser
 * snapshots the dark page, `data-theme` goes on, it snapshots the light
 * one, and `globals.css` replaces its default cross-fade with a radial
 * mask blooming from the disc, roughened by the filter below. Nothing
 * is rendered twice.
 *
 * Where that is unavailable — no support, or a reader who asked for less
 * motion — the theme simply lands. The page is fully legible on both
 * grounds, so there is nothing to fall back *to*.
 */
export default function RoomLight() {
  const [lit, setLit] = useState(false);
  const done = useRef(false);
  const discRef = useRef<HTMLImageElement>(null);

  /* The room is shut until it is asked for: the page is one panel, the
     document does not scroll, and nothing below the quote is drawn.
     Set from an effect rather than in the markup so a reader without
     JavaScript is handed the whole page instead of a locked one.

     Both marks belong to this page, not to the site — leaving takes
     them with us, or Home comes back lit and locked. */
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.room = "shut";
    return () => {
      delete root.dataset.room;
      delete root.dataset.theme;
    };
  }, []);

  const light = () => {
    if (done.current) return;
    done.current = true;

    const root = document.documentElement;
    /* the drop lands where the disc is */
    const disc = discRef.current?.getBoundingClientRect();
    /* flushSync so the button's own change is inside the snapshot the
       browser takes — a state update left to React would land after it */
    const apply = () =>
      flushSync(() => {
        root.dataset.theme = "light";
        root.dataset.room = "open";
        setLit(true);
      });

    /* the room lights first, then it takes the reader in — two beats,
       so the turn is watched rather than scrolled past */
    const enter = () => {
      const first = document.getElementById(FIRST_CHAPTER);
      first?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof document.startViewTransition !== "function") {
      apply();
      enter();
      return;
    }

    /* the mark the wipe is scoped to, so no other transition on the site
       picks up this animation */
    root.dataset.vt = "room";
    const vt = document.startViewTransition(apply);

    /* One loop drives the blot: the radius spreads and the feather
       dries. Both in JS because an SVG filter's scale cannot be
       animated from CSS, and driving the radius here too keeps the two
       on exactly the same clock.

       Absorption, not a wipe: most of the spread happens while the
       paper is wet, then it creeps. The reader sees the drop finish,
       never the fast part. */
    const blot = document.getElementById("ink-blot");
    const feather = document.querySelector<SVGFEDisplacementMapElement>("#ink-feather feDisplacementMap");
    const cx = disc ? disc.left + disc.width / 2 : window.innerWidth / 2;
    const cy = disc ? disc.top + disc.height / 2 : window.innerHeight / 2;
    /* far enough to clear the corner furthest from the drop, plus the
       fall-off, or a corner is still dim when the snapshot is dropped */
    const reach =
      Math.hypot(Math.max(cx, window.innerWidth - cx), Math.max(cy, window.innerHeight - cy)) * 1.7;
    blot?.setAttribute("cx", String(cx));
    blot?.setAttribute("cy", String(cy));

    const t0 = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 4);
    const spread = () => {
      const t = Math.min(1, (performance.now() - t0) / BLOOM_MS);
      const e = ease(t);
      blot?.setAttribute("r", String(reach * e));
      feather?.setAttribute("scale", String(FEATHER_MAX * (1 - e)));
      if (t < 1) requestAnimationFrame(spread);
    };
    requestAnimationFrame(spread);

    vt.finished.finally(() => {
      delete root.dataset.vt;
      feather?.setAttribute("scale", "0");
      blot?.setAttribute("r", "0");
      enter();
    });
  };

  return (
    <>
      {/* The blot itself, and the paper it sinks into.

          The filter goes on the MASK's shape, never on the page: a
          filter on ::view-transition-new displaces the snapshot, which
          drags the type and the drawing along with the edge. Here
          feTurbulence is the paper's fibre and feDisplacementMap pushes
          the circle's rim in and out along it, so what wicks is the
          boundary of the light and nothing else.

          The circle is filled with a soft-edged gradient rather than
          flat white, so the rim has a fall-off for the displacement to
          chew on — a hard-edged circle would come out merely scalloped.

          Sized and animated from `light()`; in the document rather than
          a file so that ::view-transition-new can reference it by id. */}
      <svg className={styles.filterHost} aria-hidden="true">
        <defs>
          <filter id="ink-feather" x="-25%" y="-25%" width="150%" height="150%">
            <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="4" seed="7" result="grain" />
            <feDisplacementMap in="SourceGraphic" in2="grain" scale="0" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          {/* opaque well into the blot, then a long fall-off to nothing */}
          <radialGradient id="ink-falloff">
            <stop offset="0" stopColor="#fff" />
            <stop offset="0.62" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </radialGradient>
          {/* Explicit bounds: with userSpaceOnUse a mask's default region
              is a percentage of the host SVG's viewport, and this host is
              0x0 — so the region came out empty and masked the whole page
              away. Numbers big enough for any viewport. */}
          <mask id="ink-mask" maskUnits="userSpaceOnUse" x="-4000" y="-4000" width="12000" height="12000">
            <circle id="ink-blot" cx="0" cy="0" r="0" fill="url(#ink-falloff)" filter="url(#ink-feather)" />
          </mask>
        </defs>
      </svg>
    <button
      type="button"
      className={styles.room}
      onClick={light}
      disabled={lit}
      aria-label={lit ? "The story is open" : "Open the story"}
    >
      {/* Watterson's own characters under his words, and the switch */}
      <img
        ref={discRef}
        src="/assets/about/quote.webp"
        alt="Calvin and Hobbes racing downhill in their wagon"
        className={styles.art}
      />
      <span className={`mono-label ${styles.hint}`} aria-hidden="true">
        Open the story
      </span>
    </button>
    </>
  );
}
