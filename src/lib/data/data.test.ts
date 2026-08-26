import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";
import { capabilities } from "./capabilities";
import {
  COPY_OUT_END,
  TRAVEL_START,
  TRAVEL_END,
  OPEN_AT,
  REARM_AT,
  LABELS_OUT,
  STAGGER,
  BLADE_DUR,
  LABEL_DELAY,
  PEEK_SCALE,
  PEEK_SCALE_COMPACT,
  bladeDelay,
} from "./scroll";
import { cases, nextCase } from "./cases";
import { experience } from "./experience";

describe("capabilities", () => {
  it("has six ordered tools with unique ids and nonzero angles", () => {
    expect(capabilities.map((c) => c.id)).toEqual([
      "research",
      "product",
      "design",
      "code",
      "ai",
      "gtm",
    ]);
    for (const c of capabilities) expect(c.openAngle).not.toBe(0);
  });

  it("back tools open positive, front tools negative", () => {
    for (const c of capabilities)
      expect(c.layer === "back" ? c.openAngle > 0 : c.openAngle < 0).toBe(true);
  });

  it("every tool has statement, tags, and hover copy", () => {
    for (const c of capabilities) {
      expect(c.statement.length).toBeGreaterThan(10);
      expect(c.tags.length).toBeGreaterThanOrEqual(3);
      expect(c.hover.length).toBeGreaterThan(20);
    }
  });

  it("every tool carries lineup years, duration, and a one-line history", () => {
    for (const c of capabilities) {
      expect(c.years).toMatch(/\d{4}/);
      expect(c.duration).toMatch(/\d+\s*yrs/);
      expect(c.line.length).toBeGreaterThan(10);
    }
  });
});

describe("cases", () => {
  it("has three cases", () => {
    expect(cases).toHaveLength(3);
  });

  // the shape is the case's own call — one figure or a before-and-after —
  // so this checks every result is filled in rather than counting them
  it("every result carries both a value and a label", () => {
    expect(cases.some((c) => c.results?.length)).toBe(true);
    for (const c of cases) {
      for (const r of c.results ?? []) {
        expect(r.value.trim().length).toBeGreaterThan(0);
        expect(r.label.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("every case has a unique url-safe slug", () => {
    const slugs = cases.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(cases.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("cover paths resolve to files under public/", () => {
    for (const c of cases) {
      if (!c.cover) continue;
      expect(c.cover).toMatch(/^\/assets\//);
      expect(existsSync(join("public", c.cover))).toBe(true);
    }
  });

  // the closing row on a case page offers the next one, so the walk has
  // to be a ring: the last case hands back to the first rather than to
  // nothing. Every case gets a next, and none of them is itself.
  it("nextCase walks the array and wraps", () => {
    expect(nextCase("creative-os")).toBe(cases[1]);
    expect(nextCase(cases[cases.length - 1].slug)).toBe(cases[0]);
    for (const c of cases) {
      const n = nextCase(c.slug);
      expect(n).toBeDefined();
      expect(n!.slug).not.toBe(c.slug);
    }
  });

  it("nextCase returns undefined for a slug that is not a case", () => {
    expect(nextCase("not-a-case")).toBeUndefined();
  });
});

describe("opening beats", () => {
  it("clears the copy, travels, lands, then frees the knife, in order", () => {
    expect(TRAVEL_START).toBeGreaterThan(0);
    expect(TRAVEL_START).toBeLessThan(COPY_OUT_END);
    expect(TRAVEL_END).toBeGreaterThan(COPY_OUT_END);
    expect(OPEN_AT).toBeGreaterThanOrEqual(TRAVEL_END);
    expect(LABELS_OUT).toBeGreaterThan(OPEN_AT);
    expect(LABELS_OUT).toBeLessThan(1);
  });

  it("peeks at a sane size, smaller on a phone than on a desktop", () => {
    for (const s of [PEEK_SCALE, PEEK_SCALE_COMPACT]) {
      expect(s).toBeGreaterThan(0);
      expect(s).toBeLessThanOrEqual(2);
    }
    // a phone's knife box already fills far more of the screen, so it peeks
    // smaller — the two must not drift back into one shared number
    expect(PEEK_SCALE_COMPACT).toBeLessThan(PEEK_SCALE);
  });

  it("re-arms the fan below the trigger, with hysteresis", () => {
    expect(REARM_AT).toBeLessThan(OPEN_AT);
    expect(REARM_AT).toBeGreaterThan(TRAVEL_START);
  });

  it("staggers one blade per capability, in order, with growing delay", () => {
    const delays = capabilities.map((_, i) => bladeDelay(i));
    expect(delays).toHaveLength(6);
    expect(delays[0]).toBe(0);
    for (let i = 1; i < delays.length; i++) {
      expect(delays[i]).toBeGreaterThan(delays[i - 1]);
    }
    expect(delays[delays.length - 1]).toBeCloseTo(5 * STAGGER);
  });

  it("overlaps the blades so the fan reads as one gesture", () => {
    expect(STAGGER).toBeLessThan(BLADE_DUR);
    expect(LABEL_DELAY).toBeGreaterThan(0);
    expect(LABEL_DELAY).toBeLessThan(BLADE_DUR);
  });
});

describe("experience", () => {
  it("runs newest first", () => {
    // The timeline draws in array order and a mis-ordered array still
    // renders — it just tells the wrong story. Nothing else catches it.
    const years = experience.map((r) => r.from);
    for (let i = 1; i < years.length; i++) {
      expect(years[i]).toBeLessThan(years[i - 1]);
    }
  });

  it("gives every role a year label, tools, and a one-line body if any", () => {
    expect(experience.length).toBeGreaterThan(0);
    for (const role of experience) {
      expect(role.years).toMatch(String(role.from));
      expect(role.title.length).toBeGreaterThan(0);
      expect(role.org.length).toBeGreaterThan(0);
      expect(role.tools.length).toBeGreaterThan(0);
      // one line, not a paragraph — the timeline is a scan
      if (role.body) expect(role.body).not.toMatch(/\.\s+\S/);
    }
  });
});
