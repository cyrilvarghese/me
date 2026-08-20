import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";

const sheet = (name: string) =>
  readFileSync(join(process.cwd(), "src/components/case", name), "utf8");

const creativeOs = sheet("diagram-motion.css");
const caseChat = sheet("casechat-motion.css");

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
  const shared = new Set(
    [...caseChat.matchAll(/^\.([\w-]+)\s*\{/gm)].map((m) => m[1])
  );

  const read = (file: string) => readFileSync(join(dir, file), "utf8");

  /* A looping diagram declares its own animations in its own <style>, so
     that its runner, trail, stops and waves start together — see the head
     of casechat-motion.css. So a class is legitimate if either sheet
     declares it. */
  const localCss = (svg: string) =>
    [...svg.matchAll(/<style>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join("\n");

  it("has the diagrams the sheet was written for", () => {
    expect(files.length).toBeGreaterThan(0);
    expect(shared.size).toBeGreaterThan(0);
  });

  it.each(files.map((f) => [f] as const))(
    "%s only uses classes some sheet declares",
    (file) => {
      const svg = read(file);
      const declared = new Set([
        ...shared,
        ...[...localCss(svg).matchAll(/\.([\w-]+)\s*(?=[,{])/g)].map((m) => m[1]),
      ]);
      const used = [...svg.matchAll(/class="([^"]+)"/g)].flatMap((m) =>
        m[1].split(/\s+/)
      );
      expect([...new Set(used)].filter((c) => !declared.has(c))).toEqual([]);
    }
  );

  /* The same silent failure one level down: an animation naming a keyframe
     that does not exist runs for its full duration and changes nothing. */
  it.each(files.map((f) => [f] as const))(
    "%s only animates keyframes some sheet defines",
    (file) => {
      const svg = read(file);
      const local = localCss(svg);
      const defined = new Set(
        [...caseChat.matchAll(/@keyframes\s+([\w-]+)/g), ...local.matchAll(/@keyframes\s+([\w-]+)/g)].map(
          (m) => m[1]
        )
      );
      /* the name is the first non-timing token of each animation shorthand */
      const named = [...local.matchAll(/animation:\s*([^;}]+)/g)]
        .flatMap((m) => m[1].split(","))
        .map((part) => part.trim().split(/\s+/)[0])
        .filter((n) => n && n !== "none");
      expect([...new Set(named)].filter((n) => !defined.has(n))).toEqual([]);
    }
  );

  /* A block whose last stop is short of 100% does not hold there, exactly
     as in the sheets above — and a diagram's own keyframes are no less
     prone to it. */
  it.each(files.map((f) => [f] as const))(
    "%s keyframes terminate at 100%%",
    (file) => {
      const short = keyframeBlocks(localCss(read(file)))
        .filter((b) => Math.max(...b.stops) < 100)
        .map((b) => `${b.name} (ends at ${Math.max(...b.stops)}%)`);
      expect(short).toEqual([]);
    }
  );

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

