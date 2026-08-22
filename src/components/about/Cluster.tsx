"use client";

import { useEffect, useRef } from "react";
import { m, useReducedMotion } from "motion/react";
import { EASE_OUT_CUBIC } from "@/lib/motion";
import { layout, type Card, type LayoutKind } from "@/lib/cluster-layout";
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
  /** a printed one-sheet: paper margin around the artwork with a
      keyline where the art meets the margin */
  poster?: boolean;
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

/** "4 / 3" → 4/3 — the CSS aspect-ratio strings, as numbers */
const parseRatio = (r: string) => {
  const [w, h] = r.split("/").map(Number);
  return h ? w / h : w;
};

/** A video card. Playback starts from an effect rather than an
    `autoPlay` attribute: the attribute would have to differ between
    the server render and a reduced-motion client, and React refuses to
    patch that up (hydration mismatch). The effect runs after
    hydration, where asking the reader's preference is safe. */
function Film({ src, alt }: { src: string; alt: string }) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (reducedMotion) {
      video.pause();
      /* a paused film should still be a picture — the first frame is
         black, so hold one from a beat in */
      video.currentTime = 0.35;
    } else {
      void video.play().catch(() => {});
    }
  }, [reducedMotion]);
  return (
    <video
      ref={ref}
      src={src}
      className={styles.img}
      loop
      muted
      playsInline
      aria-label={alt}
    />
  );
}

/**
 * A handful of pictures laid out by what they are, and the way they
 * arrive.
 *
 * Placement comes from `layout()` — seeded, so the server and the
 * browser agree and the arrangement survives a rebuild. Sliding cards
 * come in from the side of the cluster they already sit on; popping
 * cards scale up in place, each on the seeded beat the layout dealt it
 * (`card.delay`), so a lid stickers itself in no particular order.
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
  placed,
  surface,
}: {
  shots: Shot[];
  /** the box the cards are scattered inside */
  ratio: string;
  seed: number;
  kind: LayoutKind;
  /** hand-placed cards, one per shot in order — for the composition
      that is art-directed rather than derived (the seed goes unused) */
  placed?: Card[];
  /** draw the box itself as a light surface with the card shadow */
  surface?: boolean;
}) {
  const cards =
    placed ??
    layout(kind, shots.map((s) => parseRatio(s.ratio)), parseRatio(ratio), seed);
  return (
    <div
      className={`${styles.cluster}${surface ? ` ${styles.surface}` : ""}`}
      data-kind={kind}
      style={{ aspectRatio: ratio }}
    >
      {shots.map((shot, i) => {
        const card = cards[i];
        const file = shot.src.slice(shot.src.lastIndexOf("/") + 1);
        return (
          <div
            key={shot.src}
            className={styles.card}
            /* custom properties, not direct styles: an inline style
               outranks every class rule, so a media query could not
               straighten the rotation and :hover could not lift the
               card — both read these through var() instead */
            style={
              {
                "--l": `${card.left}%`,
                "--t": `${card.top}%`,
                "--w": `${card.width}%`,
                "--rot": `${card.rotate}deg`,
                "--z": card.z,
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
              transition={{
                duration: card.pop ? POP_DURATION : DURATION,
                ease: card.pop ? EASE_POP : EASE_OUT_CUBIC,
                delay: card.delay ?? i * STAGGER,
              }}
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            >
              <figure
                className={`${styles.shot}${shot.bare ? ` ${styles.bare}` : ""}${
                  shot.poster ? ` ${styles.poster}` : ""
                }`}
                style={{ aspectRatio: shot.ratio }}
              >
                {shot.ready ? (
                  /\.(mp4|webm)$/.test(shot.src) ? (
                    <Film src={shot.src} alt={shot.alt} />
                  ) : (
                    <img src={shot.src} alt={shot.alt} className={styles.img} />
                  )
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
                {shot.poster && (
                  /* SVG rather than a border: percentage-placed, the
                     keyline stays hairline-crisp at every card size and
                     the frame can sit deeper at the foot, the way a
                     printed one-sheet's margin does */
                  <svg className={styles.posterRule} aria-hidden="true">
                    <rect
                      x="2.2%"
                      y="2.2%"
                      width="95.6%"
                      height="94.6%"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                  </svg>
                )}
              </figure>
            </m.div>
          </div>
        );
      })}
    </div>
  );
}
