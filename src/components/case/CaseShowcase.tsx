"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CaseVisual from "./CaseVisual";
import styles from "./CaseShowcase.module.css";

type Shot = { src: string; caption: string };

/** How long the panel takes to leave. The dialog is closed on a timer
    rather than on transitionend, because a cancelled transition (a second
    click, a reduced-motion user) never fires one and the dialog would be
    stranded open. */
const EXIT_MS = 200;

/** Above this the bento is a grid and a tile is a thumbnail worth opening;
    at or below it the bento is one column, every shot is already full
    width, and a lightbox would only cover a picture with the same picture.
    Kept in step with the max-width: 900px block in the stylesheet. */
const ZOOMABLE = "(min-width: 901px)";

/** Closing evidence: the screens and the demo, laid out as one bento.

    Shots are a flat list because position lives in the stylesheet, not in
    the data — the grid names five areas (a…e) and hands them out in source
    order, so reading order, DOM order and visual order are the same thing.
    Five is the shape the areas describe; anything past that auto-places
    into implicit rows rather than breaking the layout.

    Only the demo carries an aspect ratio. It spans the two 1fr rows, so
    grid splits its height between them and the left-hand tiles take their
    size from the demo instead of from hand-tuned ratios.

    Two interactions make this a client component. Tiles open a lightbox,
    and the demo is handed over to the browser's own controls only once the
    reader has pressed the red play mark — before that the panel is the
    first frame and nothing else. */
export default function CaseShowcase({
  eyebrow,
  shots,
  video,
  poster,
  videoCaption,
}: {
  eyebrow: string;
  shots: Shot[];
  video?: string;
  poster?: string;
  videoCaption: string;
}) {
  const [playing, setPlaying] = useState(false);
  /* an index, not the shot itself: the lightbox is a position in the list
     now, and prev/next/dots all just move that position */
  const [at, setAt] = useState<number | null>(null);
  /* separate from `open` so the fade has a state to travel from: a dialog
     goes display:none → block, and you cannot transition out of that */
  const [shown, setShown] = useState(false);
  /* false on the server and on first paint, so the markup a phone gets is
     the markup it keeps — the desktop upgrade adds a button around a frame
     that is styled identically, so nothing moves */
  const [zoomable, setZoomable] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const shot = at === null ? null : shots[at];

  /* wraps rather than stopping at the ends: with the dots showing position
     there is no need for a control that sometimes does nothing */
  const go = useCallback(
    (step: number) =>
      setAt((i) => (i === null ? i : (i + step + shots.length) % shots.length)),
    [shots.length]
  );

  useEffect(() => {
    const mq = window.matchMedia(ZOOMABLE);
    const sync = () => {
      setZoomable(mq.matches);
      /* close through the element, not the state, so the close event still
         runs and React and the DOM stay in step */
      if (!mq.matches && dialogRef.current?.open) dialogRef.current.close();
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = dialogRef.current;
    if (at === null || !el) return;
    if (!el.open) el.showModal();
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
    /* only the first opening animates; stepping through swaps outright */
  }, [at === null]);

  /* fade first, close after — the dialog's own close event is what clears
     React's state, so Esc and the buttons all land in the same place */
  const requestClose = useCallback(() => {
    setShown(false);
    window.setTimeout(() => dialogRef.current?.close(), EXIT_MS);
  }, []);

  const start = () => {
    setPlaying(true);
    videoRef.current?.play().catch(() => {
      /* rejected play leaves the native controls showing, which is the
         same recovery the reader would reach for anyway */
    });
  };

  return (
    <section className={`section-shell ${styles.section}`}>
      <p className={`mono-label ${styles.eyebrow}`}>{eyebrow}</p>

      <div className={styles.bento}>
        {shots.map((s, i) => (
          <figure key={s.src} className={styles.cell}>
            {/* the button wraps only the frame; the caption stays outside
                it so the accessible name is not read out twice */}
            {zoomable ? (
              <button
                type="button"
                className={styles.trigger}
                onClick={() => setAt(i)}
                aria-label={`${s.caption} — view larger`}
              >
                <CaseVisual cover={s.src} className={styles.frame} />
              </button>
            ) : (
              <CaseVisual cover={s.src} className={styles.frame} />
            )}
            <figcaption className={`mono-label ${styles.caption}`}>{s.caption}</figcaption>
          </figure>
        ))}

        <figure className={`${styles.cell} ${styles.demo}`}>
          {video ? (
            <div className={styles.playerWrap}>
              <video
                ref={videoRef}
                className={styles.player}
                src={video}
                poster={poster}
                controls={playing}
                playsInline
                preload="metadata"
              />
              {!playing && (
                <button
                  type="button"
                  className={styles.playBtn}
                  onClick={start}
                  aria-label={`Play demo — ${videoCaption}`}
                >
                  <span className={styles.playMark} aria-hidden="true" />
                </button>
              )}
            </div>
          ) : (
            <div className={styles.waiting} aria-label="Demo video — in production">
              <span className={styles.play} aria-hidden="true" />
              <span className={`mono-label ${styles.waitingLabel}`}>Demo — in production</span>
            </div>
          )}
          <figcaption className={`mono-label ${styles.caption}`}>{videoCaption}</figcaption>
        </figure>

        {/* Native dialog: the top layer, the backdrop, Esc, and focus
            containment are the browser's job here rather than ours. It is
            display:none while closed, so it never becomes a grid item. */}
        {zoomable && (
        <dialog
          ref={dialogRef}
          className={styles.dialog}
          data-open={shown ? "true" : "false"}
          aria-label={shot?.caption}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") go(-1);
            else if (e.key === "ArrowRight") go(1);
          }}
          onCancel={(e) => {
            /* Esc closes instantly by default — take it over so the panel
               leaves the same way it arrived */
            e.preventDefault();
            requestClose();
          }}
          onClose={() => {
            setAt(null);
            setShown(false);
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) requestClose();
          }}
        >
          <div className={styles.panel}>
            {/* first in the DOM, so showModal lands focus on the way out */}
            <button
              type="button"
              className={styles.close}
              onClick={requestClose}
              aria-label="Close image"
            >
              <span aria-hidden="true">×</span>
            </button>

            {shot && (
              <figure className={styles.lightbox}>
                <img src={shot.src} alt="" className={styles.lightboxImg} />
                <figcaption className={`mono-label ${styles.lightboxCaption}`}>
                  {shot.caption}
                </figcaption>

                {/* one dot per shot, so the reader can see how many there
                    are and jump rather than step */}
                <div className={styles.dots} role="group" aria-label="Choose an image">
                  {shots.map((s2, i) => (
                    <button
                      key={s2.src}
                      type="button"
                      className={styles.dot}
                      aria-current={i === at ? "true" : undefined}
                      aria-label={s2.caption}
                      onClick={() => setAt(i)}
                    />
                  ))}
                </div>
              </figure>
            )}
          </div>

          {/* outside the panel, on the backdrop: the arrows never cover the
              screenshot the reader opened them to look at. The dialog's
              side padding is what makes room for them. */}
          <button
            type="button"
            className={styles.nav}
            data-dir="prev"
            onClick={() => go(-1)}
            aria-label="Previous image"
          >
            <span aria-hidden="true" className={styles.navMark}>‹</span>
          </button>
          <button
            type="button"
            className={styles.nav}
            data-dir="next"
            onClick={() => go(1)}
            aria-label="Next image"
          >
            <span aria-hidden="true" className={styles.navMark}>›</span>
          </button>
        </dialog>
        )}
      </div>
    </section>
  );
}
