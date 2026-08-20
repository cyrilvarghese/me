import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";
import { EASE_OUT_CUBIC, REVEAL_RISE_PX, REVEAL_DURATION, reveal } from "./motion";

const props = reveal();

describe("the block reveal", () => {
  it("rises gently — a small offset, never the home page's 28px", () => {
    expect(REVEAL_RISE_PX).toBeGreaterThan(0);
    expect(REVEAL_RISE_PX).toBeLessThanOrEqual(12);
    expect(props.style["--fx-from"]).toBe(`translateY(${REVEAL_RISE_PX}px)`);
  });

  it("eases out — the curve a thing entering the screen takes", () => {
    expect(EASE_OUT_CUBIC).toEqual([0.215, 0.61, 0.355, 1]);
    expect(props.transition.ease).toBe(EASE_OUT_CUBIC);
  });

  it("lands slowly enough to read as gentle, but is over inside a second", () => {
    expect(REVEAL_DURATION).toBeGreaterThanOrEqual(0.3);
    expect(REVEAL_DURATION).toBeLessThanOrEqual(0.8);
  });

  it("fires once — a block that re-fades on every scroll-by is a bug", () => {
    expect(props.viewport.once).toBe(true);
  });

  /* The whole reduced-motion contract: the hidden state lives in CSS behind
     a media query, so `initial` must stay false. Set it to an object and
     Framer hides the block for reduced-motion users, who then never get the
     tween that would bring it back — the text is simply gone. */
  it("leaves the starting state to CSS, so reduced motion still sees text", () => {
    expect(props.initial).toBe(false);
    expect(props.className).toContain("fx-hidden");
  });

  it("hides only where motion is allowed", () => {
    const css = readFileSync(join(__dirname, "..", "app", "globals.css"), "utf8");
    const gate = css.slice(0, css.indexOf(".fx-hidden"));
    expect(gate.lastIndexOf("prefers-reduced-motion: no-preference")).toBeGreaterThan(
      gate.lastIndexOf("}")
    );
  });

  /* Framer only hardware-accelerates a transform passed as a string; the
     shorthand `y: 0` goes through the slow path. */
  it("animates transform as a string, on the compositor", () => {
    expect(props.whileInView.transform).toBe("translateY(0px)");
    expect(props.whileInView).not.toHaveProperty("y");
  });

  it("keeps its class alongside whatever the block already carries", () => {
    expect(reveal("section-shell foo").className).toBe("section-shell foo fx-hidden");
  });
});
