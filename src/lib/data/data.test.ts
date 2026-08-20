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
  it("clears the copy, travels, lands, then frees the knife, in order", () => {
    expect(TRAVEL_START).toBeGreaterThan(0);
    expect(TRAVEL_START).toBeLessThan(COPY_OUT_END);
    expect(TRAVEL_END).toBeGreaterThan(COPY_OUT_END);
    expect(OPEN_AT).toBeGreaterThanOrEqual(TRAVEL_END);
    expect(LABELS_OUT).toBeGreaterThan(OPEN_AT);
    expect(LABELS_OUT).toBeLessThan(1);
  });

  it("peeks smaller than it lands, so the travel is a zoom in", () => {
    expect(PEEK_SCALE).toBeGreaterThan(0);
    expect(PEEK_SCALE).toBeLessThan(1);
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
