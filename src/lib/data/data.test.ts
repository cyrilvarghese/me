import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";
import { capabilities } from "./capabilities";
import {
  windowFor,
  INTRO_END,
  COMPLETE_START,
  TRAVEL_START,
  TRAVEL_END,
  OPEN_AT,
  REARM_AT,
  STAGGER,
  BLADE_DUR,
  LABEL_DELAY,
  HANDOFF_START,
  HANDOFF_DUR,
  bladeDelay,
} from "./scroll";
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

describe("opening beats", () => {
  it("travels, lands, then hands off, all inside one scroll pass", () => {
    expect(TRAVEL_START).toBeGreaterThan(0);
    expect(TRAVEL_END).toBeGreaterThan(TRAVEL_START);
    expect(OPEN_AT).toBeGreaterThanOrEqual(TRAVEL_END);
    expect(HANDOFF_START).toBeGreaterThan(OPEN_AT);
    expect(HANDOFF_START + HANDOFF_DUR).toBeCloseTo(1);
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
