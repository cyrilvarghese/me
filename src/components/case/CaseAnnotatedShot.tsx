import type { CSSProperties } from "react";
import { MarkText } from "./CaseMark";
import styles from "./CaseAnnotatedShot.module.css";

/** One screen in the showcase, with the reasoning pinned to the parts it
    belongs to.

    What this replaced is a screenshot exported with its annotations already
    burned into the pixels. A raster export cannot see the type ladder, the
    mono voice or the dark ground, so it arrives as a white rectangle
    carrying somebody else's rails. Drawing the annotation layer here costs
    a component and buys a shot that reads as part of the site.

    HTML rather than an SVG diagram: a callout runs two and three lines and
    wraps at whatever width the page gives it, which is the case the diagram
    skill sends to HTML. The rails stay real SVG so their dash still paints
    the round-capped pill.

    The screens are transparent PNGs, so the app sits directly on the
    panel's surface rather than inside a white plate of its own. */

/** Percent of the figure's width between the screen and its callouts, when
    they sit side by side. The rails are drawn in the same percentage
    space, so the grid is handed these numbers rather than keeping a copy. */
const GAP = 8;
const SCREEN = 52;

export type Point = {
  /** Where the callout points, as fractions of the screen — 0,0 is its
      top-left corner. More than one when a single claim is true of two
      places at once, which is what the source decks drew as one label with
      two rails. */
  at: { x: number; y: number }[];
  text: string;
  /** The clause the callout turns on. Red fails AA at body size on this
      ground, so the emphasis is a value step with the accent in the rule
      beneath it. */
  mark?: string;
  /** The one finding the shot is really about. Marks this point's nodes in
      the accent and nothing else — a figure with two has not decided. */
  accent?: boolean;
};

/** One screenshot inside a composite, placed as percentages of the
    composite box. Two cards overlapping on the diagonal is how the source
    decks showed a step that spans two screens, and stacking them apart
    loses the "these are one moment" the overlap is doing. */
export type Layer = {
  src: string;
  alt: string;
  left: number;
  top: number;
  width: number;
};

export default function CaseAnnotatedShot({
  image,
  alt,
  layers,
  aspect,
  points,
  screen = SCREEN,
}: {
  /** A single screen, sizing the figure from its own height. */
  image?: string;
  alt?: string;
  /** Or several, overlapping. Needs `aspect` (width / height of the
      composite box), because absolutely placed layers cannot give the box
      a height of its own. */
  layers?: Layer[];
  aspect?: number;
  points: Point[];
  /** Percent of the figure's width the screen takes. A portrait screen is
      happy at half; a landscape one needs closer to two thirds, or its own
      UI type falls under the legibility floor. The callouts still sit
      beside it either way — a reader has to see the screen and the note
      about it at the same time, which is the one thing running the notes
      underneath cannot do. */
  screen?: number;
}) {
  /** Where a rail stops: short of the text, so the ray points at the
      callout rather than touching it. */
  const railEnd = screen + GAP - 2;

  return (
    <div className={styles.panel}>
      <div
        className={styles.plot}
        style={
          {
            "--screen": `${screen}%`,
            "--column": `${100 - screen - GAP}%`,
            "--gap": `${GAP}%`,
          } as CSSProperties
        }
      >
        {/* Rails, in the figure's own percentage space. preserveAspect-
            Ratio "none" lets the box stretch to whatever the grid is, and
            non-scaling-stroke keeps the width and the dash period in screen
            pixels so the stretch cannot squash the pill.

            #9e9493 rather than the usual light rail: these rays cross a
            white screenshot on their way to a dark column, and it is the
            one house neutral legible on both grounds. */}
        <svg
          className={styles.rails}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {points.flatMap((p, i) =>
            p.at.map((a) => (
              <line
                key={`${p.text}-${a.x}-${a.y}`}
                x1={a.x * screen}
                y1={a.y * 100}
                x2={railEnd}
                y2={rowCentre(i, points.length)}
                stroke="#9e9493"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeDasharray="1 5.5"
                vectorEffect="non-scaling-stroke"
              />
            ))
          )}
        </svg>

        <div className={styles.screenCell}>
          <div
            className={styles.screen}
            style={aspect ? ({ aspectRatio: String(aspect) } as CSSProperties) : undefined}
          >
            {layers
              ? layers.map((l) => (
                  <img
                    key={l.src}
                    src={l.src}
                    alt={l.alt}
                    className={styles.layer}
                    style={{ left: `${l.left}%`, top: `${l.top}%`, width: `${l.width}%` }}
                  />
                ))
              : image && <img src={image} alt={alt ?? ""} className={styles.shot} />}

            {points.flatMap((p, i) =>
              p.at.map((a) => (
                <span
                  key={`${p.text}-${a.x}-${a.y}`}
                  className={styles.node}
                  data-accent={p.accent ? "true" : undefined}
                  style={{ left: `${a.x * 100}%`, top: `${a.y * 100}%` }}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
              ))
            )}
          </div>
        </div>

        <ol className={styles.notes}>
          {points.map((p, i) => (
            <li key={p.text} className={styles.note}>
              <span className={`mono-label ${styles.index}`} aria-hidden="true">
                {i + 1}
              </span>
              <MarkText text={p.text} mark={p.mark} className={styles.noteText} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/** The vertical middle of a callout's row, as a percent of the figure.
    Rows are equal and their contents centred, so this is fixed by the count
    alone — a rail aimed here lands on its callout whatever the text
    wrapping does, which hand-measured endpoints would not survive. */
function rowCentre(i: number, count: number) {
  return ((i + 0.5) / count) * 100;
}
