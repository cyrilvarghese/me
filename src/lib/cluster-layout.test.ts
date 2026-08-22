import { describe, it, expect } from "vitest";
import { layout, MAX_ROTATE, type LayoutKind } from "./cluster-layout";

/** the real clusters from about-story.ts, one per kind */
const SAMPLES: { kind: LayoutKind; ratios: number[]; box: number; seed: number }[] = [
  { kind: "wall", ratios: [2 / 3, 2 / 3, 2 / 3, 2 / 3, 2 / 3, 2 / 3], box: 4 / 3, seed: 1701 },
  { kind: "wall", ratios: [3 / 2, 3 / 2, 3 / 2, 3 / 2, 3 / 2], box: 3 / 2, seed: 6091 },
  { kind: "single", ratios: [16 / 10], box: 16 / 10, seed: 4177 },
  { kind: "pile", ratios: [3 / 2, 4 / 3, 3 / 2, 4 / 3], box: 4 / 3, seed: 3313 },
  { kind: "cascade", ratios: [16 / 10, 3 / 4, 4 / 3], box: 4 / 3, seed: 5051 },
  { kind: "cascade", ratios: [16 / 10, 16 / 10], box: 4 / 3, seed: 7013 },
  { kind: "stickers", ratios: [3 / 2, 1, 1, 1, 1, 1], box: 3 / 2, seed: 2029 },
];

const heightOf = (width: number, shot: number, box: number) => (width * box) / shot;

describe("cluster layout", () => {
  it("is deterministic for a given seed", () => {
    for (const s of SAMPLES) {
      expect(layout(s.kind, s.ratios, s.box, s.seed)).toEqual(
        layout(s.kind, s.ratios, s.box, s.seed)
      );
    }
  });

  it("keeps every card inside the box", () => {
    for (const s of SAMPLES) {
      for (const [i, card] of layout(s.kind, s.ratios, s.box, s.seed).entries()) {
        const h = heightOf(card.width, s.ratios[i], s.box);
        expect(card.left, `${s.kind} left`).toBeGreaterThanOrEqual(-0.01);
        expect(card.top, `${s.kind} top`).toBeGreaterThanOrEqual(-0.01);
        expect(card.left + card.width, `${s.kind} right`).toBeLessThanOrEqual(100.01);
        expect(card.top + h, `${s.kind} bottom`).toBeLessThanOrEqual(100.01);
      }
    }
  });

  it("only paper tilts: pile and stickers rotate, nothing else", () => {
    for (const s of SAMPLES) {
      for (const card of layout(s.kind, s.ratios, s.box, s.seed)) {
        if (s.kind === "pile" || s.kind === "stickers") {
          expect(Math.abs(card.rotate)).toBeLessThanOrEqual(MAX_ROTATE);
        } else {
          expect(card.rotate).toBe(0);
        }
      }
    }
  });

  it("a single fills the box", () => {
    const [card] = layout("single", [3 / 2], 3 / 2, 1);
    expect(card).toMatchObject({ left: 0, top: 0, width: 100, rotate: 0 });
  });

  it("a wall is flush: no two cards overlap", () => {
    for (const s of SAMPLES.filter((s) => s.kind === "wall")) {
      const cards = layout(s.kind, s.ratios, s.box, s.seed);
      for (let a = 0; a < cards.length; a++) {
        for (let b = a + 1; b < cards.length; b++) {
          const ha = heightOf(cards[a].width, s.ratios[a], s.box);
          const hb = heightOf(cards[b].width, s.ratios[b], s.box);
          const apart =
            cards[a].left + cards[a].width <= cards[b].left + 0.01 ||
            cards[b].left + cards[b].width <= cards[a].left + 0.01 ||
            cards[a].top + ha <= cards[b].top + 0.01 ||
            cards[b].top + hb <= cards[a].top + 0.01;
          expect(apart, `wall cards ${a} and ${b} overlap`).toBe(true);
        }
      }
    }
  });

  it("stickers: the surface holds still and the rest pop", () => {
    const cards = layout("stickers", [3 / 2, 1, 1, 1, 1, 1], 3 / 2, 2029);
    expect(cards[0].pop).toBeUndefined();
    expect(cards[0].rotate).toBe(0);
    for (const sticker of cards.slice(1)) {
      expect(sticker.pop).toBe(true);
      expect(sticker.width).toBeLessThanOrEqual(20);
    }
  });

  it("empty in, empty out", () => {
    expect(layout("pile", [], 4 / 3, 1)).toEqual([]);
  });
});
