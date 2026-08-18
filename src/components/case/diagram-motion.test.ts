import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";

const css = readFileSync(join(process.cwd(), "src/components/case/diagram-motion.css"), "utf8");

/** Every animated block, as { name, selectors-of-each-step }. */
function keyframeBlocks() {
  const blocks: { name: string; stops: number[] }[] = [];
  const re = /@keyframes\s+([\w-]+)\s*\{/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css))) {
    /* walk braces from the block's opening brace to its match */
    let depth = 0;
    let i = re.lastIndex - 1;
    const start = i;
    do {
      if (css[i] === "{") depth++;
      else if (css[i] === "}") depth--;
      i++;
    } while (depth > 0 && i < css.length);
    const body = css.slice(start + 1, i - 1);
    const stops = [...body.matchAll(/(-?[\d.]+)%/g)].map((s) => Number(s[1]));
    if (/\bto\s*\{/.test(body)) stops.push(100);
    if (/\bfrom\s*\{/.test(body)) stops.push(0);
    blocks.push({ name: m[1], stops });
  }
  return blocks;
}

describe("diagram motion", () => {
  it("finds the keyframe blocks", () => {
    expect(keyframeBlocks().length).toBeGreaterThan(30);
  });

  /* A block whose last stop is short of 100% does not hold there: CSS
     synthesises the missing 100% keyframe from the element's base style, so
     the tail of every cycle interpolates backwards to the undrawn state and
     the diagram appears to play in reverse. Holds must be written out. */
  it("every keyframe block terminates at 100%", () => {
    const short = keyframeBlocks()
      .filter((b) => Math.max(...b.stops) < 100)
      .map((b) => `${b.name} (ends at ${Math.max(...b.stops)}%)`);
    expect(short).toEqual([]);
  });
});
