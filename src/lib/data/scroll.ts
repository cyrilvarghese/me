/**
 * Scroll-progress windows for the knife story section (spec §37).
 * Progress is 0..1 across the 600vh section: intro, six tool windows, complete.
 */
export const INTRO_END = 0.1;
export const WINDOW = 0.13;
export const COMPLETE_START = INTRO_END + WINDOW * 6; // 0.88

export function windowFor(i: number): { start: number; end: number } {
  return {
    start: INTRO_END + i * WINDOW,
    end: INTRO_END + (i + 1) * WINDOW,
  };
}

/**
 * Beats for the knife opening. Progress is 0..1 across the section's 200vh:
 * the knife arrives from the hero and grows into the stage, the blades fan
 * open on their own clock, then it dissolves into the morph section's knife.
 *
 * The fan is deliberately NOT on this scale — it runs in seconds, fired once
 * when the knife lands. Scrubbed easing reads as the reader's hand; time-based
 * easing reads as the object's own weight.
 */

/** The knife's scrubbed travel from the hero's peek to centre stage. */
export const TRAVEL_START = 0.05;
export const TRAVEL_END = 0.42;

/** Landing fires the fan. Scrolling back below REARM_AT re-arms it; the gap
    between the two is hysteresis, so jitter at the threshold cannot retrigger. */
export const OPEN_AT = TRAVEL_END;
export const REARM_AT = 0.34;

/** Seconds between blade starts. */
export const STAGGER = 0.1;
/** Seconds for one blade to swing out and settle. */
export const BLADE_DUR = 0.75;
/** Seconds after a blade starts before its label arrives. */
export const LABEL_DELAY = 0.22;

/** The crossfade into OutcomeTransition's knife, ending exactly as this
    section unpins and that one pins. */
export const HANDOFF_DUR = 0.1;
export const HANDOFF_START = 1 - HANDOFF_DUR;

/** Start offset, in seconds, for blade `i` of the fan. */
export function bladeDelay(i: number): number {
  return i * STAGGER;
}
