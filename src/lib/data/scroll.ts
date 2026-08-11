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
