import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";

const sheet = (name: string) =>
  readFileSync(join(process.cwd(), "src/components/case", name), "utf8");

const creativeOs = sheet("diagram-motion.css");
const caseChat = sheet("casechat-motion.css");
const msig = sheet("msig-motion.css");

/** Every animated block, as { name, selectors-of-each-step }. */
function keyframeBlocks(css: string) {
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
    expect(keyframeBlocks(creativeOs).length).toBeGreaterThan(30);
  });

  /* A block whose last stop is short of 100% does not hold there: CSS
     synthesises the missing 100% keyframe from the element's base style, so
     the tail of every cycle interpolates backwards to the undrawn state and
     the diagram appears to play in reverse. Holds must be written out. */
  it.each([
    ["diagram-motion.css", creativeOs],
    ["casechat-motion.css", caseChat],
    ["msig-motion.css", msig],
  ])("every keyframe block in %s terminates at 100%%", (_name, css) => {
    const short = keyframeBlocks(css)
      .filter((b) => Math.max(...b.stops) < 100)
      .map((b) => `${b.name} (ends at ${Math.max(...b.stops)}%)`);
    expect(short).toEqual([]);
  });
});

/* The CaseChat drawings carry class names instead of inline animation
   shorthands, which buys shared motion but moves the failure: a typo in
   an SVG is silent — the element simply never animates, and no build
   step is looking. These two checks are that build step. */
describe("casechat diagrams", () => {
  const dir = join(process.cwd(), "public/assets/CaseChat/diagrams");
  const files = readdirSync(dir).filter((f) => f.endsWith(".svg"));
  const declared = new Set(
    [...caseChat.matchAll(/^\.([\w-]+)\s*\{/gm)].map((m) => m[1])
  );

  it("has the diagrams the sheet was written for", () => {
    expect(files.length).toBeGreaterThan(0);
    expect(declared.size).toBeGreaterThan(0);
  });

  it.each(
    readdirSync(dir)
      .filter((f) => f.endsWith(".svg"))
      .map((f) => [f] as const)
  )("%s only uses classes the sheet declares", (file) => {
    const svg = readFileSync(join(dir, file), "utf8");
    const used = [...svg.matchAll(/class="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/));
    expect([...new Set(used)].filter((c) => !declared.has(c))).toEqual([]);
  });

  /* Markers resolve by document-wide id, and CaseDiagram inlines every
     drawing into the same page — so two diagrams sharing an id would
     silently hand the second one the first one's arrowhead. */
  it("gives every marker a document-unique id", () => {
    const seen = new Map<string, string>();
    const clashes: string[] = [];
    for (const file of files) {
      const svg = readFileSync(join(dir, file), "utf8");
      for (const m of svg.matchAll(/<marker[^>]*\sid="([^"]+)"/g)) {
        const prev = seen.get(m[1]);
        if (prev) clashes.push(`${m[1]} in ${prev} and ${file}`);
        else seen.set(m[1], file);
      }
    }
    expect(clashes).toEqual([]);
  });
});

/* The MSIG drawings follow the same class-driven pattern, so they get the
   same build step: a mistyped class is otherwise silent — the element
   simply never animates and nothing is looking. */
describe("msig diagrams", () => {
  const dir = join(process.cwd(), "public/assets/MSIG/diagrams");
  const files = readdirSync(dir).filter((f) => f.endsWith(".svg"));
  const declared = new Set([...msig.matchAll(/^\.([\w-]+)\s*\{/gm)].map((m) => m[1]));

  it("has the diagrams the sheet was written for", () => {
    expect(files.length).toBe(6);
    expect(declared.size).toBeGreaterThan(0);
  });

  it.each(files.map((f) => [f] as const))(
    "%s only uses classes the sheet declares",
    (file) => {
      const svg = readFileSync(join(dir, file), "utf8");
      const used = [...svg.matchAll(/class="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/));
      expect([...new Set(used)].filter((c) => !declared.has(c))).toEqual([]);
    }
  );

  /* Speed is fixed at 246 units/second, so a run's share of the 8s cycle is
     arithmetic: length / 1968. The class name carries the length, and the
     keyframe carries the fraction — this checks they still agree. */
  it("derives every run's travel fraction from its path length", () => {
    for (const m of msig.matchAll(/@keyframes msigRun(\d+)\s*\{([^}]*\}[^}]*\}[^}]*)\}/g)) {
      const len = Number(m[1]);
      const stop = Number(/([\d.]+)%\s*\{\s*stroke-dashoffset:\s*-/.exec(m[2])?.[1]);
      expect(stop).toBeCloseTo((len / 1968) * 100, 1);
    }
  });
});
