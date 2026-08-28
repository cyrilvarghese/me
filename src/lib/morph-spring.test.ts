import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";
import { spring } from "motion";

/* The case-study morph (a cover image opening into the hero) is a spring,
   not a bezier. Nothing can animate it from JS — ::view-transition-group is
   a pseudo-element in the overlay tree, unreachable by any library — so the
   spring is sampled from motion's own solver into a linear() easing and
   pasted into globals.css as a constant.

   A pasted constant rots the moment someone retunes it, so this file is the
   source of truth: it regenerates the curve from the config below and fails
   if the stylesheet has drifted. Retuning means editing MORPH_SPRING, running
   the suite, and pasting what the failure prints. */
const MORPH_SPRING = { visualDuration: 0.35, bounce: 0.15 };

const generated = spring({ keyframes: [0, 1], ...MORPH_SPRING }).toString();
const [, duration, easing] = generated.match(/^(\d+ms) (linear\(.+\))$/)!;

const css = readFileSync(join(__dirname, "..", "app", "globals.css"), "utf8");

/** the declarations inside the first rule whose selector list contains `sel` */
function ruleBody(sel: string): string {
  const at = css.indexOf(sel);
  expect(at, `${sel} is not in globals.css`).toBeGreaterThan(-1);
  return css.slice(css.indexOf("{", at) + 1, css.indexOf("}", at));
}

describe("the case-study morph spring", () => {
  it("arrives before the old 420ms ease did, and settles after", () => {
    // visualDuration 0.35 is time-to-target; the rest is sub-pixel tail
    expect(Number.parseInt(duration)).toBeGreaterThan(420);
    expect(Number.parseInt(duration)).toBeLessThanOrEqual(800);
  });

  it("overshoots enough to read as weight, not enough to read as wobble", () => {
    const peak = Math.max(...easing.match(/[\d.]+/g)!.map(Number));
    expect(peak).toBeGreaterThan(1);
    expect(peak).toBeLessThan(1.01);
  });

  it("drives the forward morph — the card opening into the page", () => {
    const body = ruleBody("::view-transition-group(.morph)");
    expect(body).toContain(`animation-duration: ${duration}`);
    expect(body).toContain(`animation-timing-function: ${easing}`);
  });

  /* CaseBack drives the reverse by hand and pairs by name rather than class
     (startViewTransition never fires on popstate), so the named rules carry
     a second copy of the curve. Out of step, the morph springs one way and
     eases back the other. */
  it.each(["creative-os", "case-chat", "msig"])(
    "drives the reverse morph for %s at the identical pace",
    (slug) => {
      const body = ruleBody(`::view-transition-group(case-visual-${slug})`);
      expect(body).toContain(`animation-duration: ${duration}`);
      expect(body).toContain(`animation-timing-function: ${easing}`);
    },
  );

  it("still collapses for readers who asked for less motion", () => {
    const at = css.indexOf("prefers-reduced-motion: reduce");
    const block = css.slice(at, css.indexOf("}", css.indexOf("animation-delay", at)));
    expect(block).toContain("::view-transition-group(*)");
    expect(block).toContain("animation-duration: 0s !important");
  });
});
