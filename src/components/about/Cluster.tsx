"use client";

import { m } from "motion/react";
import { EASE_OUT_CUBIC } from "@/lib/motion";
import { layout, type LayoutKind } from "@/lib/cluster-layout";
import styles from "./Cluster.module.css";

export type Shot = {
  /** the file this card is waiting for */
  src: string;
  ready: boolean;
  alt: string;
  /** the picture's own shape — the cards in a cluster are not one size */
  ratio: string;
  /** no card chrome: a logo or a sticker floats on the page rather
      than sitting in a photograph's frame */
  bare?: boolean;
};

/** longer than the 0.5s block reveal: these travel further than 10px,
    and duration follows distance or the movement reads as a snap */
const DURATION = 0.62;
/** each card behind the one before it, so the cluster assembles rather
    than appearing — small enough that the last card is not a wait */
const STAGGER = 0.07;
/** a sticker lands with a slap: shorter than the slide, with a little
    overshoot, because a pop that eases out reads as inflation */
const POP_DURATION = 0.38;
const EASE_POP = [0.34, 1.56, 0.64, 1] as const;
/** stickers wait for their surface to land first */
const POP_DELAY = 0.3;

/** "4 / 3" → 4/3 — the CSS aspect-ratio strings, as numbers */
const parseRatio = (r: string) => {
  const [w, h] = r.split("/").map(Number);
  return h ? w / h : w;
};

/**
 * A handful of pictures laid out by what they are, and the way they
 * arrive.
 *
 * Placement comes from `layout()` — seeded, so the server and the
 * browser agree and the arrangement survives a rebuild. Sliding cards
 * come in from the side of the cluster they already sit on; sticker
 * cards pop on in place, after the surface beneath them has landed.
 *
 * Reduced motion is handled the way the whole site handles it: the
 * hidden state is `.fx-hidden` in globals.css, which only exists under
 * `prefers-reduced-motion: no-preference`. A reader who has asked for
 * less gets the finished cluster, rotations and all, with no tween to
 * undo — which is why `initial` stays false and the rotation lives in a
 * custom property on the card rather than in the animation.
 */
export default function Cluster({
  shots,
  ratio,
  seed,
  kind,
}: {
  shots: Shot[];
  /** the box the cards are scattered inside */
  ratio: string;
  seed: number;
  kind: LayoutKind;
}) {
  const cards = layout(
    kind,
    shots.map((s) => parseRatio(s.ratio)),
    parseRatio(ratio),
    seed
  );

  return (
    <div className={styles.cluster} data-kind={kind} style={{ aspectRatio: ratio }}>
      {shots.map((shot, i) => {
        const card = cards[i];
        const file = shot.src.slice(shot.src.lastIndexOf("/") + 1);
        return (
          <div
            key={shot.src}
            className={styles.card}
            /* custom properties, not a direct transform: a media query
               cannot override an inline style, and the stacked layout
               below has to be able to straighten these out */
            style={
              {
                "--l": `${card.left}%`,
                "--t": `${card.top}%`,
                "--w": `${card.width}%`,
                "--rot": `${card.rotate}deg`,
                zIndex: card.z,
              } as React.CSSProperties
            }
          >
            <m.div
              className={`${styles.arrive} fx-hidden`}
              style={
                {
                  "--fx-from": card.pop
                    ? "scale(0.4)"
                    : `translate(${card.from.x}px, ${card.from.y}px)`,
                } as React.CSSProperties
              }
              initial={false}
              /* a string transform, not x/y — only the string form is
                 handed to the compositor by Framer */
              whileInView={
                card.pop
                  ? { opacity: 1, transform: "scale(1)" }
                  : { opacity: 1, transform: "translate(0px, 0px)" }
              }
              transition={
                card.pop
                  ? {
                      duration: POP_DURATION,
                      ease: EASE_POP,
                      delay: POP_DELAY + i * STAGGER,
                    }
                  : { duration: DURATION, ease: EASE_OUT_CUBIC, delay: i * STAGGER }
              }
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            >
              <figure
                className={`${styles.shot}${shot.bare ? ` ${styles.bare}` : ""}`}
                style={{ aspectRatio: shot.ratio }}
              >
                {shot.ready ? (
                  <img src={shot.src} alt={shot.alt} className={styles.img} />
                ) : (
                  /* The frame is drawn at the exact shape its picture
                     will have, with the filename it wants inside it — so
                     the layout is finished before the photographs are,
                     and dropping them in moves nothing. */
                  <span className={styles.slot} aria-hidden="true">
                    <span className={`mono-label ${styles.slotName}`}>{file}</span>
                    <span className={`mono-label ${styles.slotRatio}`}>{shot.ratio}</span>
                  </span>
                )}
              </figure>
            </m.div>
          </div>
        );
      })}
    </div>
  );
}
