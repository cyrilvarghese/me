"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import styles from "./RoomLight.module.css";

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

  /* the light belongs to this page, not to the site: leaving takes it
     with us, or Home comes back lit */
  useEffect(
    () => () => {
      delete document.documentElement.dataset.theme;
    },
    []
  );

  const light = () => {
    if (done.current) return;
    done.current = true;

    const root = document.documentElement;
    /* flushSync so the button's own change is inside the snapshot the
       browser takes — a state update left to React would land after it */
    const apply = () =>
      flushSync(() => {
        root.dataset.theme = "light";
        setLit(true);
      });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof document.startViewTransition !== "function") {
      apply();
      return;
    }

    /* the mark the wipe is scoped to, so no other transition on the site
       picks up this animation */
    root.dataset.vt = "room";
    const vt = document.startViewTransition(apply);
    vt.finished.finally(() => {
      delete root.dataset.vt;
    });
  };

  return (
    <button
      type="button"
      className={styles.room}
      onClick={light}
      disabled={lit}
      aria-label={lit ? "The page is lit" : "Light the page"}
    >
      {/* Watterson's own characters under his words, and the switch */}
      <img
        src="/assets/about/quote.webp"
        alt="Calvin and Hobbes racing downhill in their wagon"
        className={styles.art}
      />
      <span className={`mono-label ${styles.hint}`} aria-hidden="true">
        Light the page
      </span>
    </button>
  );
}
