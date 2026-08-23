"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import styles from "./RoomLight.module.css";

/** the panel the reveal carries the reader to — the story proper */
export const FIRST_CHAPTER = "chapter-01";

/**
 * The threshold into the About page's light room.
 *
 * The page arrives on the dark ground the visitor just left, so nothing
 * jars on the way in, and the drawing sits without its colour. Clicking
 * it turns the whole page — every token at once, ground, ink, hairlines,
 * card shadows — spreading out from the spine the page is built on.
 *
 * A same-document view transition does the spreading: the browser
 * snapshots the dark page, `data-theme` goes on, it snapshots the light
 * one, and `globals.css` replaces its default cross-fade with a wipe
 * opening from the centre line. Nothing is rendered twice.
 *
 * Where that is unavailable — no support, or a reader who asked for less
 * motion — the theme simply lands. The page is fully legible on both
 * grounds, so there is nothing to fall back *to*.
 */
export default function RoomLight() {
  const [lit, setLit] = useState(false);
  const done = useRef(false);

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
    vt.finished.finally(() => {
      delete root.dataset.vt;
      enter();
    });
  };

  return (
    <button
      type="button"
      className={styles.room}
      onClick={light}
      disabled={lit}
      aria-label={lit ? "The story is open" : "Open the story"}
    >
      {/* the pulse is a ring behind the disc, not on it: a filter on the
          image would freeze mid-ease inside the snapshot */}
      <span className={styles.pulse} aria-hidden="true" />
      {/* Watterson's own characters under his words, and the switch */}
      <img
        src="/assets/about/quote.webp"
        alt="Calvin and Hobbes racing downhill in their wagon"
        className={styles.art}
      />
      <span className={`mono-label ${styles.hint}`} aria-hidden="true">
        Open the story
      </span>
    </button>
  );
}
