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
    section's ground rather than inside a white plate of its own. */

/** Percent of the figure's width taken by the screen, the gap, and the
    column of callouts. They are named here because the rails are drawn in
    the same percentage space and have to agree with the grid. */
const SCREEN = 52;
const COLUMN = 40;
/** Where a rail stops: short of the text, so the ray points at the callout
    rather than touching it. */
const RAIL_END = SCREEN + (100 - SCREEN - COLUMN) - 2;

export type Point = {
  /** Where the callout is pointing, as a fraction of the screenshot —
      0,0 is its top-left corner. Measured against the image itself, so a
      screen is measured once and never re-measured for the layout. */
  x: number;
  y: number;
  text: string;
  /** The clause the callout turns on. Red fails AA at body size on this
      ground, so the emphasis is a value step with the accent in the rule
      beneath it. */
  mark?: string;
  /** The one finding the shot is really about. Marks this node in the
      accent and nothing else — a figure with two has not decided. */
  accent?: boolean;
};

export default function CaseAnnotatedShot({
  image,
  alt,
  points,
}: {
  image: string;
  alt: string;
  points: Point[];
}) {
  return (
    <div className={styles.plot}>
      {/* Rails, in the figure's own percentage space. preserveAspectRatio
          "none" lets the box stretch to whatever the grid is, and
          non-scaling-stroke keeps the width and the dash period in screen
          pixels so the stretch cannot squash the pill.

          #9e9493 rather than the usual light rail: these rays cross a white
          screenshot on their way to a dark column, and it is the one house
          neutral legible on both grounds. */}
      <svg
        className={styles.rails}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {points.map((p, i) => (
          <line
            key={p.text}
            x1={p.x * SCREEN}
            y1={p.y * 100}
            x2={RAIL_END}
            y2={rowCentre(i, points.length)}
            stroke="#9e9493"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="1 5.5"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      <div className={styles.screenCell}>
        <div className={styles.screen}>
          <img src={image} alt={alt} className={styles.shot} />
          {points.map((p, i) => (
            <span
              key={p.text}
              className={styles.node}
              data-accent={p.accent ? "true" : undefined}
              style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
              aria-hidden="true"
            >
              {i + 1}
            </span>
          ))}
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
  );
}

/** The vertical middle of a callout's row, as a percent of the figure.
    Rows are equal and their contents centred, so this is fixed by the count
    alone — a rail aimed here lands on the callout whatever the text
    wrapping does, which hand-measured endpoints would not survive. */
function rowCentre(i: number, count: number) {
  return ((i + 0.5) / count) * 100;
}
