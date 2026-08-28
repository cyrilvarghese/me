import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";
import { spring } from "motion";

/* The case-study morph opens on a spring and closes on a plain curve.

   Nothing can animate it from JS — ::view-transition-group is a pseudo-element
   in the overlay tree, unreachable by any library — so the spring is sampled
   from motion's own solver into a linear() easing and pasted into globals.css
   as a constant. A pasted constant rots the moment someone retunes it, so this
   file is the source of truth: it regenerates the curve from the config below
   and fails if the stylesheet has drifted. Retuning means editing MORPH_SPRING,
   running the suite, and pasting what the failure prints. */
const MORPH_SPRING = { visualDuration: 0.35, bounce: 0.27 };

/** the way back: no spring, no timing function, UA `ease` */
const BACK_DURATION = "420ms";

const generated = spring({ keyframes: [0, 1], ...MORPH_SPRING }).toString();
const [, duration, easing] = generated.match(/^(\d+ms) (linear\(.+\))$/)!;

const css = readFileSync(join(__dirname, "..", "app", "globals.css"), "utf8");
const caseBack = readFileSync(
  join(__dirname, "..", "components", "case", "CaseBack.tsx"),
  "utf8",
);

/** the declarations inside the first rule whose selector list contains `sel` */
function ruleBody(sel: string): string {
  const at = css.indexOf(sel);
  expect(at, `${sel} is not in globals.css`).toBeGreaterThan(-1);
  return css.slice(css.indexOf("{", at) + 1, css.indexOf("}", at));
}

describe("the case-study morph spring", () => {
  it("arrives before the old 420ms ease did, and settles after", () => {
    // visualDuration 0.35 is time-to-target; the rest is the settle
    expect(Number.parseInt(duration)).toBeGreaterThan(420);
    expect(Number.parseInt(duration)).toBeLessThanOrEqual(800);
  });

  /* Cyril picked a bounce you are meant to notice, so the bound is no longer
     "barely there" — it is "springs visibly, without looking broken". */
  it("springs visibly past the mark rather than easing onto it", () => {
    const stops = easing.match(/[\d.]+/g)!.map(Number);
    const peak = Math.max(...stops);
    expect(peak).toBeGreaterThan(1.01);
    expect(peak).toBeLessThan(1.06);
  });

  it("drives the forward morph — the card opening into the page", () => {
    const body = ruleBody("::view-transition-group(.morph)");
    expect(body).toContain(`animation-duration: ${duration}`);
    expect(body).toContain(`animation-timing-function: ${easing}`);
  });
});

describe("the way back", () => {
  /* Opening is the moment worth performing; closing should get out of the
     way. The reverse runs on the UA default at the pace the morph had before
     any of this. */
  it.each(["creative-os", "case-chat", "msig"])(
    "closes %s on a plain curve, not the spring",
    (slug) => {
      const body = ruleBody(
        `html[data-vt="back"]::view-transition-group(case-visual-${slug})`,
      );
      expect(body).toContain(`animation-duration: ${BACK_DURATION}`);
      expect(body).not.toContain("animation-timing-function");
    },
  );

  /* The one that actually bites. React pairs the opening by name AND by the
     "morph" class; CaseBack pairs it by name alone. So a named rule left
     unscoped matches the opening too and silently strips its spring — the
     bug is invisible until someone looks at the forward trip and wonders
     where the bounce went. */
  it("scopes every named rule, or the opening loses its spring too", () => {
    expect(css).not.toMatch(/(^|\r?\n)::view-transition-group\(case-visual-/);
  });

  /* CSS and JS have to agree about the flag: the rules above do nothing at
     all unless CaseBack raises it, and it must come back off or every later
     transition on the page inherits the reverse's pacing. */
  it("is driven by a flag CaseBack raises and then clears", () => {
    expect(caseBack).toContain('root.dataset.vt = "back"');
    expect(caseBack).toContain("delete root.dataset.vt");
  });
});

describe("reduced motion", () => {
  it("still collapses both directions for readers who asked for less", () => {
    const at = css.indexOf("prefers-reduced-motion: reduce");
    const block = css.slice(at, css.indexOf("}", css.indexOf("animation-delay", at)));
    expect(block).toContain("::view-transition-group(*)");
    expect(block).toContain("animation-duration: 0s !important");
  });
});
