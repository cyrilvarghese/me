import type { Shot } from "@/components/about/Cluster";
import type { LayoutKind } from "@/lib/cluster-layout";

/** The long version of the About section: the route a reader takes when
    the home page's five-rung timeline is not enough.

    Facts come from Cyril's own account of the same story, recast in the
    house voice — nothing is inferred to fill a row, and where the source
    gives no year, none is invented. Yuvabe is the chapter that account
    predates; its facts come from experience.ts and cases.ts.

    Data rather than markup, for the reason capabilities.ts is: the page
    is one map over this array, so a chapter is added, cut or reordered
    here and nowhere else. */
export type Chapter = {
  /** two digits, drawn on the spine beside the chapter */
  num: string;
  /** names the chapter plainly — the fact of it, not a tease */
  label: string;
  /** one or two short paragraphs; the second is separate so it can breathe */
  body: string[];
  /** where the chapter points, when it points somewhere real */
  link?: { href: string; label: string };
  gallery: {
    /** the box the cards are scattered inside */
    ratio: string;
    /** which composition the shots take — what the pictures are */
    kind: LayoutKind;
    /** fixes this cluster's arrangement — change it to reshuffle one
        chapter without touching any of the others */
    seed: number;
    shots: Shot[];
  };
};

/** One numbered file per card, so uploading is "drop these in and flip
    `ready`" rather than a naming decision per picture. The ratios are
    the shapes the cards will be drawn at before the files exist — get
    them roughly right and nothing moves when the pictures land. */
const shots = (base: string, ratios: string[], alt: string): Shot[] =>
  ratios.map((ratio, i) => ({
    src: `/assets/about/${base}-${i + 1}.webp`,
    ready: false,
    /* placeholder: alt says what is IN a picture, which nobody can write
       from a filename — rewrite each of these when the file lands */
    alt: `${alt} (${i + 1})`,
    ratio,
  }));

export const chapters: Chapter[] = [
  {
    num: "01",
    label: "Early childhood",
    body: [
      "Films and cartoons shaped what I paid attention to early on, and drawing came with them. Most of my time went on learning to draw and making up stories worth drawing.",
    ],
    gallery: {
      ratio: "4 / 3",
      kind: "wall",
      seed: 1701,
      shots: shots(
        "01-childhood",
        ["2 / 3", "2 / 3", "2 / 3", "2 / 3", "2 / 3", "2 / 3"],
        "A film or series that shaped the drawing"
      ),
    },
  },
  {
    num: "02",
    label: "Learning the ropes",
    body: [
      "My first jobs were in large organisations and on the founding teams of early-stage startups, building interfaces for mobile and web. Design became the part I wanted to understand properly — its principles, and what they did to the software I was already writing.",
    ],
    gallery: {
      ratio: "3 / 2",
      kind: "stickers",
      seed: 2029,
      shots: shots(
        "02-ropes",
        ["3 / 2", "1 / 1", "1 / 1", "1 / 1", "1 / 1", "1 / 1"],
        "A sticker from the stack of those years"
      ).map((s, i) =>
        i === 0
          ? { ...s, alt: "The laptop those interfaces were built on" }
          : { ...s, bare: true }
      ),
    },
  },
  {
    num: "03",
    label: "The sabbatical",
    body: [
      "A year off work to study storytelling, animation and figure drawing, with philosophy alongside it.",
      "Learning to draw properly changed how I look at everything since — and I learned it from some remarkable people.",
    ],
    gallery: {
      ratio: "4 / 3",
      kind: "pile",
      seed: 3313,
      shots: shots(
        "03-sabbatical",
        ["3 / 2", "4 / 3", "3 / 2", "4 / 3"],
        "A page from the sketchbooks of that year"
      ),
    },
  },
  {
    num: "04",
    label: "Discovering VR and AR",
    body: [
      "The first headset I tried made the case on its own, so I learned to build VR and AR applications. Directing a story someone stands inside meant working out what a camera angle does to what a viewer feels — which turned out to be most of the craft.",
    ],
    gallery: {
      ratio: "16 / 10",
      kind: "single",
      seed: 4177,
      shots: shots("04-vr", ["16 / 10"], "An AR experience running on a tablet"),
    },
  },
  {
    num: "05",
    label: "Transition to product design",
    body: [
      "Designing in VR led me to product design, which is the one place the analytical half and the storytelling half are both the job. Five years in, that has not worn off.",
    ],
    gallery: {
      ratio: "4 / 3",
      kind: "cascade",
      seed: 5051,
      shots: shots(
        "05-product",
        ["16 / 10", "3 / 4", "4 / 3"],
        "Product work from those years"
      ),
    },
  },
  {
    num: "06",
    label: "Going solo",
    body: [
      "After leading UX teams on client projects, I went independent as a consultant designer — Verizon, Azentio, Razorpay, MSIG and 1Finance.",
      "The lasting lesson was about consensus: how an outside partner gets a room to a decision it will still hold to next week.",
    ],
    gallery: {
      ratio: "3 / 2",
      kind: "wall",
      seed: 6091,
      shots: shots(
        "06-solo",
        ["3 / 2", "3 / 2", "3 / 2", "3 / 2", "3 / 2"],
        "A client of those years"
      ).map((s) => ({ ...s, bare: true })),
    },
  },
  {
    num: "07",
    label: "CaseChat",
    body: [
      "CaseChat began with a childhood friend who became a doctor. It is an AI case-based learning platform where medical students practise clinical reasoning against simulated patients, and get told where the reasoning went wrong.",
    ],
    link: { href: "https://mycasechat.com", label: "mycasechat.com" },
    gallery: {
      ratio: "4 / 3",
      kind: "cascade",
      seed: 7013,
      shots: shots("07-casechat", ["16 / 10", "16 / 10"], "The CaseChat clinic"),
    },
  },
  {
    num: "08",
    label: "Yuvabe",
    body: [
      "Now I lead UX, product and front-end engineering on CreativeOS, Yuvabe's AI content generation platform: the whole production run for a reel — script, references, images, video — on one canvas instead of across five tools.",
    ],
    link: { href: "/work/creative-os", label: "Read the case study" },
    gallery: {
      ratio: "4 / 3",
      kind: "cascade",
      seed: 8093,
      shots: shots("08-yuvabe", ["16 / 10", "16 / 10"], "The CreativeOS canvas"),
    },
  },
];

/** The closing chapter. Same shape as the rest so the spine runs through
    it, but it is the one that stops being a career. */
export const sparetime: Omit<Chapter, "num"> = {
  label: "In my spare time",
  body: [
    "You can find me reading, drawing, playing my guitar, or watching Seinfeld for the 35th time.",
    "I also like meeting people, travelling, and seeing how other places live.",
  ],
  gallery: {
    ratio: "4 / 3",
    kind: "pile",
    seed: 9067,
    shots: shots(
      "09-sparetime",
      ["3 / 2", "4 / 3", "3 / 2", "4 / 3"],
      "Drawing, and somewhere else"
    ),
  },
};
