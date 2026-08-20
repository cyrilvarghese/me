/**
 * Beats for the knife's opening. Progress is 0..1 across the hero's 200vh:
 * the copy leaves, the one knife on the page travels from its peek to centre
 * stage and grows, the blades fan open on their own clock, then the lineup's
 * timeline takes the same element over.
 *
 * The fan is deliberately NOT on this scale — it runs in seconds, fired once
 * when the knife lands. Scrubbed easing reads as the reader's hand; time-based
 * easing reads as the object's own weight.
 */

/** The hero copy has fully cleared the stage by here. */
export const COPY_OUT_END = 0.2;

/** The knife's scrubbed travel from its peek to centre stage. */
export const TRAVEL_START = 0.08;
export const TRAVEL_END = 0.55;

/** Landing fires the fan. Scrolling back below REARM_AT re-arms it; the gap
    between the two is hysteresis, so jitter at the threshold cannot retrigger. */
export const OPEN_AT = TRAVEL_END;
export const REARM_AT = 0.45;

/** Labels retire before the lineup starts pulling the knife apart. */
export const LABELS_OUT = 0.92;

/** Seconds between blade starts. */
export const STAGGER = 0.1;
/** Seconds for one blade to swing out and settle. */
export const BLADE_DUR = 0.75;
/** Seconds after a blade starts before its label arrives. */
export const LABEL_DELAY = 0.22;

/** The peek is the same knife, smaller — so the travel is a genuine zoom in
    rather than the shrink two separate knives forced. */
export const PEEK_SCALE = 0.75;

/** Phones peek smaller. The knife box fills far more of a narrow screen, and
    the hero copy runs to roughly two thirds of it, so 0.75 leaves the peek
    jammed against the bottom edge with nowhere to sit. */
export const PEEK_SCALE_COMPACT = 0.5;

/** Start offset, in seconds, for blade `i` of the fan. */
export function bladeDelay(i: number): number {
  return i * STAGGER;
}
