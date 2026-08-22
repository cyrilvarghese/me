/** Placement for a cluster of pictures, by what the pictures are.
 *
 * The About page's chapters are illustrated by very different objects —
 * a wall of film posters, one laptop, a spill of sketchbooks, a run of
 * product screens, stickers slapped on a lid — and one scatter cannot
 * play all of them. Each `LayoutKind` is a composition: how that kind
 * of object actually sits when you put a handful of them down.
 *
 * Rotation belongs to paper. Posters in a grid and screenshots in a
 * cascade sit straight; only the pile (and the stickers, slightly)
 * tilt, because those are the ones a hand put down.
 *
 * Seeded, never `Math.random()`. Two reasons, both load-bearing: the
 * page is a static export prerendered on the server and hydrated in the
 * browser, so a layout that rolled dice would mismatch and be thrown
 * away on hydration; and a scatter that changed on every build would
 * make every deploy a visual diff nobody asked for. Same seed, same
 * arrangement, forever — pass a different seed to reshuffle a chapter.
 */

export type LayoutKind =
  /** a set of like things — even grid, even gaps, straight */
  | "wall"
  /** one picture that is the whole figure */
  | "single"
  /** physical paper strewn about — overlap and tilt */
  | "pile"
  /** screens stepping down the diagonal, big to small */
  | "cascade"
  /** card 0 is the surface; the rest pop onto it */
  | "stickers";

export type Card = {
  /** all in % of the cluster box, so the box can be any size */
  left: number;
  top: number;
  width: number;
  /** degrees; zero everywhere but the pile and the stickers */
  rotate: number;
  /** paint order */
  z: number;
  /** Where the card comes in from, as a `translate()` argument in px.
      Taken from where the card sits — one on the left of the cluster
      arrives from the left — so a cluster assembles from the outside
      in rather than every piece sliding the same way. */
  from: { x: number; y: number };
  /** arrives by scaling up in place (a sticker slapped on) rather
      than by sliding — the translate above is zeroed */
  pop?: true;
};

/** how far a card travels on the way in — far enough to have a
    direction, short enough to still be a reveal rather than a journey */
export const TRAVEL_PX = 64;

export const MAX_ROTATE = 9;

/** mulberry32 — small, fast, and identical across every JS engine,
    which is what "the server and the browser must agree" requires */
function prng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(Math.max(v, lo), Math.max(lo, hi));
const round = (v: number) => Number(v.toFixed(2));

/** a card's height in box-% — width is % of box width, height % of box
    height, and the two scales differ by the box's own ratio */
const heightOf = (width: number, shotRatio: number, boxRatio: number) =>
  (width * boxRatio) / shotRatio;

/** outside-in: the direction a card arrives from is the side of the
    cluster it already sits on; a card at dead centre rises instead */
function arrival(left: number, top: number, width: number, height: number) {
  const offX = clamp((left + width / 2 - 50) / 30, -1, 1);
  const offY = clamp((top + height / 2 - 50) / 30, -1, 1);
  if (Math.abs(offX) < 0.15 && Math.abs(offY) < 0.15)
    return { x: 0, y: round(TRAVEL_PX * 0.45) };
  return {
    x: round(offX * TRAVEL_PX),
    /* the vertical share is smaller: a card that comes mostly from the
       side reads as sliding in, one that comes mostly from below reads
       as the page's own scroll */
    y: round(offY * TRAVEL_PX * 0.45),
  };
}

/** one picture, as large as the box lets it be, centred */
function single(shotRatio: number, boxRatio: number): Card[] {
  let width = 100;
  let height = heightOf(width, shotRatio, boxRatio);
  if (height > 100) {
    width = (100 * shotRatio) / boxRatio;
    height = 100;
  }
  return [
    {
      left: round((100 - width) / 2),
      top: round((100 - height) / 2),
      width: round(width),
      rotate: 0,
      z: 0,
      from: { x: 0, y: round(TRAVEL_PX * 0.45) },
    },
  ];
}

/** an even grid that fills the box — the character is in the artwork,
    so the placement stays out of the way. A full grid gets a slight
    per-column shift (the middle column rides high, the way a poster
    wall is actually pinned); a short last row centres instead. */
function wall(count: number, ratios: number[], boxRatio: number, seed: number): Card[] {
  const rnd = prng(seed);
  const cols = count <= 2 ? count : Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);
  /* a wall is a set of like things — the first shape speaks for all */
  const shotRatio = ratios[0];

  /* only a full grid can shift whole columns; a short last row is
     centred, and staggering columns above it reads as misregistration */
  const canStagger = rows > 1 && count % cols === 0;
  /* room reserved above and below so the shifted columns stay inside */
  const staggerRoom = canStagger ? 7 : 0;

  let gapX = 4;
  let gapY = gapX * boxRatio;
  let cardW = (100 - gapX * (cols - 1)) / cols;
  let cardH = heightOf(cardW, shotRatio, boxRatio);
  const totalH = rows * cardH + gapY * (rows - 1);
  if (totalH > 100 - staggerRoom) {
    const s = (100 - staggerRoom) / totalH;
    gapX *= s;
    gapY *= s;
    cardW *= s;
    cardH *= s;
  }

  const gridW = cols * cardW + gapX * (cols - 1);
  const gridH = rows * cardH + gapY * (rows - 1);
  const offsetX = (100 - gridW) / 2;
  const offsetY = (100 - gridH) / 2;
  const amp = canStagger ? Math.min(offsetY, 3.5) : 0;

  return Array.from({ length: count }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const inRow = Math.min(cols, count - row * cols);
    const rowShift = ((cols - inRow) * (cardW + gapX)) / 2;
    const colShift = amp === 0 ? 0 : (col % 2 === 1 ? -amp : amp * 0.4) + (rnd() - 0.5);

    const left = offsetX + rowShift + col * (cardW + gapX);
    const top = clamp(offsetY + row * (cardH + gapY) + colShift, 0, 100 - cardH);
    return {
      left: round(left),
      top: round(top),
      width: round(cardW),
      rotate: 0,
      z: i,
      from: arrival(left, top, cardW, cardH),
    };
  });
}

/** paper strewn about: a loose grid pushed hard enough off itself that
    the cards overlap and tilt, without ever burying one */
function pile(count: number, ratios: number[], boxRatio: number, seed: number): Card[] {
  const rnd = prng(seed);
  const cols = count <= 2 ? count : Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);
  const cellW = 100 / cols;
  const cellH = 100 / rows;
  /* cards wider than their cell — the difference is the overlap */
  const cardW = cellW * (count === 1 ? 1 : 1.18);

  return Array.from({ length: count }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    /* the last row is centred when it is short, or a three-of-four
       pile hangs off to one side and reads as a mistake */
    const inRow = Math.min(cols, count - row * cols);
    const rowShift = ((cols - inRow) * cellW) / 2;

    const jitterX = (rnd() - 0.5) * cellW * 0.22;
    const jitterY = (rnd() - 0.5) * cellH * 0.22;
    const rotate = round((rnd() - 0.5) * 2 * MAX_ROTATE);

    const height = heightOf(cardW, ratios[i], boxRatio);
    const left = clamp(
      rowShift + col * cellW + (cellW - cardW) / 2 + jitterX,
      0,
      100 - cardW
    );
    const top = clamp(row * cellH + jitterY, 0, Math.max(0, 100 - height));
    return {
      left: round(left),
      top: round(top),
      width: round(cardW),
      rotate,
      /* alternating, so a card is as likely to sit under its neighbour
         as over it — a monotonic stack always leans the same way */
      z: i % 2 === 0 ? i : count - i,
      from: arrival(left, top, cardW, height),
    };
  });
}

/** screens stepping down the diagonal, largest first, each overlapping
    the one before — the order of the shots is the order of the walk */
function cascade(count: number, ratios: number[], boxRatio: number, seed: number): Card[] {
  const rnd = prng(seed);
  const base = count === 2 ? 72 : 62;

  return Array.from({ length: count }, (_, i) => {
    /* shrink down the walk, but never let a tall shape blow the box —
       a portrait screen at half width is most of the height */
    const width = Math.min(base * 0.82 ** i, (68 * ratios[i]) / boxRatio);
    const height = heightOf(width, ratios[i], boxRatio);
    const t = i / (count - 1);
    const left = clamp(t * (100 - width) + (rnd() - 0.5) * 4, 0, 100 - width);
    const top = clamp(t * (100 - height) + (rnd() - 0.5) * 4, 0, 100 - height);
    return {
      left: round(left),
      top: round(top),
      width: round(width),
      rotate: 0,
      /* later steps sit on top — the walk moves toward the reader */
      z: i,
      from: arrival(left, top, width, height),
    };
  });
}

/** card 0 is the surface (a laptop lid, a case); the rest are stickers
    scattered over its middle, arriving by popping on rather than
    sliding — nobody slides a sticker into place */
function stickers(count: number, ratios: number[], boxRatio: number, seed: number): Card[] {
  const surface = single(ratios[0], boxRatio)[0];
  if (count === 1) return [surface];
  const rnd = prng(seed);
  const n = count - 1;
  const cols = n <= 2 ? n : Math.ceil(Math.sqrt(n));
  const rows = Math.ceil(n / cols);

  /* the region stickers land in: the middle of the surface, clear of
     its edges, so none reads as peeling off */
  const insetX = 14;
  const insetY = 16;
  const regionW = surface.width - insetX * 2;
  const regionH = heightOf(surface.width, ratios[0], boxRatio) - insetY * 2;
  const cellW = regionW / cols;
  const cellH = regionH / rows;

  const cards: Card[] = [surface];
  for (let i = 0; i < n; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const inRow = Math.min(cols, n - row * cols);
    const rowShift = ((cols - inRow) * cellW) / 2;

    const width = Math.min(cellW * 0.72, 20);
    const height = heightOf(width, ratios[i + 1], boxRatio);
    const left =
      surface.left + insetX + rowShift + col * cellW + (cellW - width) / 2 +
      (rnd() - 0.5) * cellW * 0.3;
    const top =
      surface.top + insetY + row * cellH + (cellH - height) / 2 +
      (rnd() - 0.5) * cellH * 0.3;
    cards.push({
      left: round(clamp(left, 0, 100 - width)),
      top: round(clamp(top, 0, 100 - height)),
      width: round(width),
      /* a slapped-on sticker is a few degrees off true, never more */
      rotate: round((rnd() - 0.5) * 12),
      z: i + 1,
      from: { x: 0, y: 0 },
      pop: true,
    });
  }
  return cards;
}

/** Lay a cluster out. `ratios` are the shots' own width/height numbers
    in source order; `boxRatio` is the cluster box the percentages are
    relative to. */
export function layout(
  kind: LayoutKind,
  ratios: number[],
  boxRatio: number,
  seed: number
): Card[] {
  const count = ratios.length;
  if (count < 1) return [];
  if (count === 1 && kind !== "stickers") return single(ratios[0], boxRatio);
  switch (kind) {
    case "wall":
      return wall(count, ratios, boxRatio, seed);
    case "single":
      return single(ratios[0], boxRatio);
    case "pile":
      return pile(count, ratios, boxRatio, seed);
    case "cascade":
      return cascade(count, ratios, boxRatio, seed);
    case "stickers":
      return stickers(count, ratios, boxRatio, seed);
  }
}
