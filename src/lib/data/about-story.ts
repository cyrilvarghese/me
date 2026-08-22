import type { Shot } from "@/components/about/Cluster";
import type { Card, LayoutKind } from "@/lib/cluster-layout";

/** The long version of the About section: the route a reader takes when
    the home page's five-rung timeline is not enough.

    Facts come from Cyril's own account of the same story, recast in the
    house voice — nothing is inferred to fill a row, and where the source
    gives no year, none is invented. Yuvabe is the chapter that account
    predates; its facts come from experience.ts and cases.ts.

    Data rather than markup, for the reason capabilities.ts is: the page
    is one map over this array, so a chapter is added, cut or reordered
    here and nowhere else.

    The pictures live in `public/assets/about/<chapter>/` under the
    names they arrived with — the arrays below point at the real files,
    and each ratio is the file's own pixel dimensions, so the frame is
    exactly the picture's shape. Chapter 05 borrows from the MSIG case
    study's own assets rather than duplicating them. */
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
    /** hand-placed cards, one per shot in order, when the composition
        is art-directed rather than derived (the seed goes unused) */
    cards?: Card[];
    shots: Shot[];
  };
};

/** placeholder frames for the one chapter whose pictures are still to
    come — drawn at the shape they will have, named for the file they
    are waiting for (see Cluster's slot) */
const awaiting = (base: string, ratios: string[], alt: string): Shot[] =>
  ratios.map((ratio, i) => ({
    src: `/assets/about/${base}-${i + 1}.webp`,
    ready: false,
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
      /* six portrait posters over three columns want a square wall */
      ratio: "1 / 1",
      kind: "wall",
      seed: 1701,
      shots: [
        {
          src: "/assets/about/01/01-1.webp",
          ready: true,
          alt: "Mike Mignola's Hellboy, pistol drawn",
          ratio: "288 / 359",
          poster: true,
        },
        {
          /* the two AVIFs are Samurai Jack and Dexter's Laboratory —
             swap these two alts if the order is reversed */
          src: "/assets/about/01/01-2.avif",
          ready: true,
          alt: "Samurai Jack poster",
          ratio: "533 / 800",
          poster: true,
        },
        {
          src: "/assets/about/01/01-3.webp",
          ready: true,
          alt: "Batman: The Animated Series — Batman on a rooftop under lightning",
          ratio: "345 / 460",
          poster: true,
        },
        {
          src: "/assets/about/01/01-4.avif",
          ready: true,
          alt: "Dexter's Laboratory poster",
          ratio: "696 / 1024",
          poster: true,
        },
        {
          src: "/assets/about/01/01-5.webp",
          ready: true,
          alt: "The Prince of Egypt — a chariot in a desert canyon",
          ratio: "258 / 384",
          poster: true,
        },
        {
          src: "/assets/about/01/01-6.webp",
          ready: true,
          alt: "Miyazaki's Spirited Away — Chihiro among the lanterns",
          ratio: "184 / 273",
          poster: true,
        },
      ],
    },
  },
  {
    num: "02",
    label: "Learning the ropes",
    body: [
      "My first jobs were in large organisations and on the founding teams of early-stage startups, building interfaces for mobile and web. Design became the part I wanted to understand properly — its principles, and what they did to the software I was already writing.",
    ],
    gallery: {
      /* the surface's own shape, so the lid fills the box exactly */
      ratio: "1024 / 702",
      kind: "stickers",
      seed: 2029,
      shots: [
        {
          src: "/assets/about/02/laptop-bg.webp",
          ready: true,
          alt: "The laptop those interfaces were built on",
          ratio: "1024 / 702",
        },
        {
          src: "/assets/about/02/07yvn4bEF23BVkjs81ulVOWxU.avif",
          ready: true,
          alt: "C# logo sticker",
          ratio: "910 / 1024",
          bare: true,
        },
        {
          src: "/assets/about/02/A4Evyl1cAcRHnE64a94y8o0sxg.avif",
          ready: true,
          alt: "Android logo sticker",
          ratio: "994 / 1024",
          bare: true,
        },
        {
          src: "/assets/about/02/GjC5lyaVHH4xrfgXPvgcnwGpm4k.avif",
          ready: true,
          alt: "JavaScript logo sticker",
          ratio: "512 / 512",
          bare: true,
        },
        {
          src: "/assets/about/02/ftJpmglXSbEPQzXpqvgFxvUF2ZA.avif",
          ready: true,
          alt: "Apple logo sticker",
          ratio: "905 / 1024",
          bare: true,
        },
        {
          src: "/assets/about/02/wuq7cK6slPEDhD1CIAa02F65kTY.avif",
          ready: true,
          alt: "Unity logo sticker",
          ratio: "512 / 186",
          bare: true,
        },
      ],
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
      ratio: "3 / 2",
      kind: "pile",
      seed: 3313,
      /* Hand-placed to match the sabbatical spread on Cyril's earlier
         site: the light page up top, the open spread beside it, the
         held-open book tilted on the left, the wide spread along the
         foot — and the animation clip lands last, on top of the pile. */
      cards: [
        { left: 17, top: 0, width: 24, rotate: 0, z: 1, from: { x: 0, y: -29 } },
        { left: 44, top: 2, width: 40, rotate: -2, z: 3, from: { x: 45, y: -20 } },
        { left: 1, top: 22, width: 26, rotate: -8, z: 2, from: { x: -64, y: 0 } },
        { left: 30, top: 55, width: 40, rotate: -2, z: 4, from: { x: 0, y: 29 } },
        { left: 58, top: 42, width: 30, rotate: 6, z: 9, from: { x: 0, y: 0 }, pop: true, delay: 0.75 },
      ],
      shots: [
        {
          src: "/assets/about/03/P6Fnb2gkFGIVjC4K31KxzzDHSw.webp",
          ready: true,
          alt: "A sketchbook page of hand studies in sepia pencil",
          ratio: "512 / 683",
        },
        {
          src: "/assets/about/03/Q1J6CMLsHssZzdqcSwJpxOh9p5w.webp",
          ready: true,
          alt: "An open sketchbook spread of figures in motion, in blue pencil",
          ratio: "512 / 381",
        },
        {
          src: "/assets/about/03/xWMamNX67rcWR7goXpnXqj2Us.webp",
          ready: true,
          alt: "A sketchbook held open on a page of ink gesture figures",
          ratio: "512 / 683",
        },
        {
          src: "/assets/about/03/WaeerTBIVFUP6QC8yzfWZyfXJZY.webp",
          ready: true,
          alt: "A sketchbook spread of gesture drawings",
          ratio: "512 / 384",
        },
        {
          src: "/assets/about/03/carperntar-video.mp4",
          ready: true,
          alt: "A short clip from that year's animation study",
          ratio: "720 / 720",
        },
      ],
    },
  },
  {
    num: "04",
    label: "Discovering VR and AR",
    body: [
      "The first headset I tried made the case on its own, so I learned to build VR and AR applications. Directing a story someone stands inside meant working out what a camera angle does to what a viewer feels — which turned out to be most of the craft.",
    ],
    gallery: {
      ratio: "4 / 3",
      kind: "single",
      seed: 4177,
      shots: [
        {
          src: "/assets/about/04/RgZ2K4fmI2UoSDGbQO2Zfj9jY.gif",
          ready: true,
          alt: "The Mythokatha AR experience running on a tablet, characters standing on printed cards",
          ratio: "640 / 480",
        },
      ],
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
      /* sketch → shipped, down the diagonal, from the MSIG case study's
         own assets */
      shots: [
        {
          src: "/assets/msig/cover-desk.webp",
          ready: true,
          alt: "The MSIG agent dashboard open on a laptop between two people",
          ratio: "2100 / 1401",
        },
        {
          src: "/assets/msig/e5nkT3tdjowEU0ttZEsvoSrxCLM.webp",
          ready: true,
          alt: "Four hand-drawn wireframes of the MSIG policy flow",
          ratio: "1900 / 1300",
        },
        {
          src: "/assets/msig/Dashboard.png",
          ready: true,
          alt: "The shipped MSIG dashboard — stats, renewals, payments, claims",
          ratio: "2880 / 3430",
        },
      ],
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
      ratio: "4 / 3",
      kind: "arc",
      seed: 6091,
      shots: [
        {
          src: "/assets/about/06/dDb5U8I21mxn4b3ewPCbwTOVNc.webp",
          ready: true,
          alt: "Verizon logo",
          ratio: "292 / 132",
          bare: true,
        },
        {
          src: "/assets/about/06/bUCkG9Q2056lmGFsvCDD6FJ7Nk.webp",
          ready: true,
          alt: "Azentio logo",
          ratio: "428 / 96",
          bare: true,
        },
        {
          src: "/assets/about/06/NJZ9QyQ4OLsdEU0rfdF87rBXBU.webp",
          ready: true,
          alt: "Razorpay logo",
          ratio: "416 / 88",
          bare: true,
        },
        {
          src: "/assets/about/06/5PCRX2I4SDsPme0XfVq60xJqM.webp",
          ready: true,
          alt: "MSIG logo",
          ratio: "368 / 144",
          bare: true,
        },
        {
          src: "/assets/about/06/tJAn8PVGHVwMNV1rj7SubC504Y.webp",
          ready: true,
          alt: "1Finance logo",
          ratio: "152 / 192",
          bare: true,
        },
      ],
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
      /* the wordmark's own shape — a wide mark, not a screen */
      ratio: "833 / 207",
      kind: "single",
      seed: 7013,
      shots: [
        {
          src: "/assets/about/07/O9k7SqksZ6IHj0Dx9m7sgog3YE.webp",
          ready: true,
          alt: "The CaseChat wordmark, two speech bubbles making a diagnosis",
          ratio: "833 / 207",
          bare: true,
        },
      ],
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
      shots: awaiting("08-yuvabe", ["16 / 10", "16 / 10"], "The CreativeOS canvas"),
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
    shots: [
      {
        src: "/assets/about/final/03tbGiggMDclL6ZqSDbeF5deA0.webp",
        ready: true,
        alt: "Looking up into a misty eucalyptus forest",
        ratio: "512 / 384",
      },
      {
        src: "/assets/about/final/GjlRCWKXbI5tbG03ZaJFsHrwg.webp",
        ready: true,
        alt: "A pencil sketch of a dog, ears out",
        ratio: "517 / 548",
      },
      {
        src: "/assets/about/final/ckRdcs10rMnXJXzlKeJbbYbnDM.webp",
        ready: true,
        alt: "Cyril drawing figure studies in a sketchbook",
        ratio: "512 / 384",
      },
    ],
  },
};
