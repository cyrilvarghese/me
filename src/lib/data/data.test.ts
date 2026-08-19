import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";
import { capabilities } from "./capabilities";
import { windowFor, INTRO_END, COMPLETE_START } from "./scroll";
import { cases } from "./cases";

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

describe("scroll windows", () => {
  it("are contiguous 0.13 slices from intro end to complete start", () => {
    expect(windowFor(0).start).toBeCloseTo(INTRO_END);
    for (let i = 0; i < 6; i++) {
      expect(windowFor(i).end - windowFor(i).start).toBeCloseTo(0.13);
      if (i > 0) expect(windowFor(i).start).toBeCloseTo(windowFor(i - 1).end);
    }
    expect(windowFor(5).end).toBeCloseTo(COMPLETE_START);
  });
});

describe("cases", () => {
  it("has three cases", () => {
    expect(cases).toHaveLength(3);
  });

  it("msig carries the before/after quote-time results", () => {
    const msig = cases.find((c) => c.slug === "msig")!;
    expect(msig.results?.length).toBe(2);
    for (const r of msig.results ?? []) {
      expect(r.value.trim().length).toBeGreaterThan(0);
      expect(r.label.trim().length).toBeGreaterThan(0);
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
});
