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

/** How large the closed knife peeks, as a multiple of its landing size. Above
    1 since the peek was asked to be much bigger (user, 2026-08-20): the sense
    of arrival is carried by the 90° righting and the fan, not by scale. */
export const PEEK_SCALE = 1.5;

/** Phones peek smaller than desktop but not small: the knife box fills far
    more of a narrow screen, so it cannot take the desktop 1.5, and the hero
    copy runs to roughly half of it, which leaves a real band underneath for
    the peek to sit in rather than a strip at the bottom edge. */
export const PEEK_SCALE_COMPACT = 1.35;

/** A short phone runs the same copy through a shallower viewport, so the band
    under it cannot hold the 1.35 peek — it either lands on the paragraph or
    hangs off the bottom edge. Below 760px tall the peek keeps its old size. */
export const PEEK_SCALE_COMPACT_SHORT = 1;

/** The peek lays the closed knife on a diagonal. Travel rotates it back to
    flat as it comes to centre, so the object rights itself on the way in. */
export const PEEK_ROTATION = -36;

/** Start offset, in seconds, for blade `i` of the fan. */
export function bladeDelay(i: number): number {
  return i * STAGGER;
}
