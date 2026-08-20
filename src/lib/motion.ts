import type { CSSProperties } from "react";

/** The curve a thing entering the screen takes — it arrives quickly and
    settles, rather than creeping in. Already the site's reveal easing;
    the three home sections keep their own copies for now. */
export const EASE_OUT_CUBIC = [0.215, 0.61, 0.355, 1] as const;

/** Deliberately a tenth of the home page's 28px. A case study stacks
    fifteen-odd blocks down one scroll, and at that count a real rise stops
    reading as arrival and starts reading as a ride. The fade carries the
    reveal; the rise only keeps it from looking switched on. */
export const REVEAL_RISE_PX = 10;

/** Longer than the 300ms a control would take, because nothing here is a
    control — the reader is arriving at a block, not operating it. */
export const REVEAL_DURATION = 0.5;

/**
 * Scroll reveal for a case-study block: the whole block — eyebrow, heading
 * and body together — fades up as one.
 *
 * The hidden state is NOT set here. It comes from `.fx-hidden` in
 * globals.css, which only exists inside
 * `@media (prefers-reduced-motion: no-preference)`, so a reduced-motion
 * reader is never hidden in the first place and needs no tween to be
 * brought back. That is also why `initial` stays false: letting Framer own
 * the starting state would hide the block for exactly the people the media
 * query is protecting. `src/lib/motion.test.ts` locks this.
 *
 * Spread onto a block's existing root element rather than a wrapper —
 * an extra node inside `section-shell` grids and the view-transition
 * contexts changes layout.
 */
export function reveal(className = "") {
  return {
    className: `${className} fx-hidden`.trim(),
    style: { "--fx-from": `translateY(${REVEAL_RISE_PX}px)` } as CSSProperties &
      Record<"--fx-from", string>,
    initial: false as const,
    /* a string transform, not `y` — only the string form goes to the
       compositor in Framer */
    whileInView: { opacity: 1, transform: "translateY(0px)" },
    transition: { duration: REVEAL_DURATION, ease: EASE_OUT_CUBIC },
    /* -22% so a block starts moving once it is properly on screen rather
       than at the very edge; matches the home page's reveals */
    viewport: { once: true, margin: "0px 0px -22% 0px" },
  };
}
