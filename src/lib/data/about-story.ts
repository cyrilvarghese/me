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
  /** the label set in --accent-lift: the chapter the story turns on.
      Sentence-case red, so the lifted rung (type-on-dark) */
  lift?: boolean;
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
    /** where the pictures themselves lead — the whole cluster becomes
        the link, with the label set beneath it */
    link?: { href: string; label: string };
    /** the cluster box drawn as a light surface with the card shadow —
        a wall for marks that bring their own white */
    surface?: boolean;
  };
};

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
      /* Hand-placed to match the lid on Cyril's earlier site: Android
         at the top left, the Apple up top, C# big out right, JS tilted
         at the foot, Unity along the bottom edge — spread to the
         corners the way a lid actually gets stickered, and not one
         size. The lid lands first; the stickers pop on in no particular
         order. */
      cards: [
        { left: 0, top: 0, width: 100, rotate: 0, z: 0, from: { x: 0, y: 29 } },
        { left: 9, top: 16, width: 15, rotate: 0, z: 1, from: { x: 0, y: 0 }, pop: true, delay: 0.55 },
        { left: 37, top: 10, width: 11, rotate: 3, z: 2, from: { x: 0, y: 0 }, pop: true, delay: 0.35 },
        { left: 12, top: 58, width: 16, rotate: -7, z: 3, from: { x: 0, y: 0 }, pop: true, delay: 0.8 },
        { left: 64, top: 16, width: 19, rotate: 0, z: 4, from: { x: 0, y: 0 }, pop: true, delay: 0.45 },
        { left: 52, top: 61, width: 27, rotate: -2, z: 5, from: { x: 0, y: 0 }, pop: true, delay: 0.65 },
      ],
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
          alt: "Android logo sticker",
          ratio: "910 / 1024",
          bare: true,
        },
        {
          src: "/assets/about/02/A4Evyl1cAcRHnE64a94y8o0sxg.avif",
          ready: true,
          alt: "Apple logo sticker",
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
          alt: "C# logo sticker",
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
    lift: true,
    body: [
      "A year off work to study storytelling, animation and figure drawing, with philosophy alongside it.",
      "Learning to draw properly changed how I look at everything since — and I learned it from some remarkable people.",
    ],
    gallery: {
      /* square, so a pile this size has the height to stack in */
      ratio: "1 / 1",
      kind: "pile",
      seed: 3313,
      /* Hand-placed to match the sabbatical spread on Cyril's earlier
         site: the animation clip up at the top left, the blue spread
         beside it, the held-open book tilted at the bottom left, the
         hands page laid over the book at the foot, the gesture spread
         tilted out right. Order in `shots`: hands, blue spread, book,
         gestures, clip. The clip lands last, on top. */
      cards: [
        { left: 30, top: 55, width: 32, rotate: -3, z: 8, from: { x: 0, y: 29 } },
        { left: 44, top: 0, width: 56, rotate: -3, z: 3, from: { x: 45, y: -20 } },
        { left: 0, top: 44, width: 36, rotate: -8, z: 4, from: { x: -64, y: 0 } },
        { left: 43, top: 57, width: 57, rotate: 8, z: 7, from: { x: 64, y: 10 } },
        { left: 8, top: 6, width: 44, rotate: -8, z: 9, from: { x: 0, y: 0 }, pop: true, delay: 0.75 },
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
      link: {
        href: "https://photos.app.goo.gl/ypwLkp3iMQ2niitU6",
        label: "View my sketchbook",
      },
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
      /* most of the box, centred — a tablet held up, not a wall. 87.5
         is 70 up by a quarter (Cyril, 2026-08-23) */
      cards: [{ left: 6.25, top: 6.25, width: 87.5, rotate: 0, z: 0, from: { x: 0, y: 29 } }],
      shots: [
        {
          src: "/assets/about/04/RgZ2K4fmI2UoSDGbQO2Zfj9jY.gif",
          ready: true,
          alt: "The Mythokatha AR experience running on a tablet, characters standing on printed cards",
          /* the device's shape, not the recording's — the recording is
             4:3 and the screen inside the frame is 4:3, so it fits */
          ratio: "1008 / 778",
          frame: "tablet",
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
      /* sketch → shipped, and the cards GROW along the way rather than
         shrinking: the generated cascade walks down by 0.82 a step,
         which reads as depth on a pile of paper but backwards here —
         the shipped screen is the one that earned the room.

         All three are tight crops, not whole applications (Cyril,
         2026-08-25). Chapter 5 is the only gallery on the page holding
         dense UI, and the box is 34rem: a 1440px app squeezed into a
         337px card is an 8× reduction, which turns 13px labels into one
         physical pixel. Cropped to one region each and re-encoded at
         ~2× the card's rendered width, the same cards carry text you
         can actually read. Crops live in `public/assets/about/05/`;
         the sources are the MSIG case study's own assets. */
      cards: [
        /* One diagonal, top-left to bottom-right, growing the whole way —
           the reading order IS the layout, so nothing looks strewn: even
           steps (~18 across, ~25 down), each card overlapping the last
           one's corner, each entering along the diagonal it sits on. */
        /* the pencil, first and smallest, tilted — the only card a hand
           put down, so the only one off-square */
        { left: 0, top: 0, width: 34, rotate: -3, z: 1, from: { x: -26, y: -14 }, delay: 0 },
        /* the queue steps down-right, its top-left corner over the
           sketch's foot */
        { left: 17, top: 30, width: 58, rotate: 0, z: 2, from: { x: -24, y: 18 }, delay: 0.12 },
        /* the shipped dashboard, largest and in front, closing the
           diagonal flush with the box's bottom-right corner */
        { left: 34, top: 48, width: 66, rotate: 0, z: 3, from: { x: 26, y: 18 }, delay: 0.24 },
      ],
      shots: [
        {
          src: "/assets/about/05/wireframe.webp",
          ready: true,
          alt: "A hand-drawn wireframe of the MSIG policy flow, its steps numbered down a rail",
          ratio: "648 / 538",
        },
        {
          src: "/assets/about/05/work-queue.webp",
          ready: true,
          alt: "The MSIG agent work queue — policies, cover notes and their statuses",
          ratio: "2600 / 1320",
        },
        {
          src: "/assets/about/05/dashboard-top.webp",
          ready: true,
          alt: "The shipped MSIG dashboard — revenue against target, renewals, payments and claims",
          ratio: "2200 / 1270",
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
      kind: "wall",
      seed: 6091,
      /* No wall on this ground. The chips are #fff and the page is
         #f8f4f2 — three percent apart, so the marks sit straight on the
         page and the board that hid them on the dark ground is gone. */
      /* A grid, three over two, each mark sized for the same visual
         mass — equal widths would make the wordmarks slivers and the
         1Finance square a monolith. Order in `shots`: Verizon, Azentio,
         Razorpay, MSIG, 1Finance. They pop on out of order. */
      cards: [
        { left: 23, top: 60, width: 24, rotate: 0, z: 1, from: { x: 0, y: 0 }, pop: true, delay: 0.35 },
        { left: 37, top: 29, width: 26, rotate: 0, z: 2, from: { x: 0, y: 0 }, pop: true, delay: 0.1 },
        { left: 6, top: 29, width: 28, rotate: 0, z: 3, from: { x: 0, y: 0 }, pop: true, delay: 0.5 },
        { left: 68, top: 27, width: 24, rotate: 0, z: 4, from: { x: 0, y: 0 }, pop: true, delay: 0.25 },
        { left: 59, top: 57, width: 12, rotate: 0, z: 5, from: { x: 0, y: 0 }, pop: true, delay: 0.6 },
      ],
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
      "CaseChat began with a childhood friend who became a doctor. We both come from education, and we wanted medical learning to be something students do rather than something they read.",
      "It is an AI case-based learning platform: students practise clinical reasoning against simulated patients, and get told where the reasoning went wrong.",
    ],
    gallery: {
      /* the wordmark's own shape — a wide mark, not a screen */
      ratio: "833 / 207",
      kind: "single",
      seed: 7013,
      /* three quarters of the column: a mark this wide at full width
         outweighed every picture beside it */
      cards: [{ left: 12.5, top: 12.5, width: 75, rotate: 0, z: 0, from: { x: 0, y: 29 } }],
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
      /* square, not 4:3: the cascade steps down, and three screens this
         size need the height to step into */
      ratio: "1 / 1",
      kind: "cascade",
      seed: 8093,
      /* Hand-placed: the canvas leads at two thirds of the box, and the
         two screens it opens step down behind it, each nearly as large —
         the product itself rather than a photograph of someone using
         it. Order: canvas, image generation, video generation. */
      cards: [
        { left: 0, top: 0, width: 66, rotate: 0, z: 0, from: { x: -45, y: -20 } },
        { left: 20, top: 30, width: 62, rotate: 0, z: 1, from: { x: 0, y: 20 } },
        { left: 40, top: 60, width: 60, rotate: 0, z: 2, from: { x: 45, y: 20 } },
      ],
      shots: [
        {
          src: "/assets/CreativeOS/canvas.webp",
          ready: true,
          alt: "The CreativeOS canvas — shots, prompts, references and generations wired into one run",
          ratio: "2554 / 1396",
        },
        {
          src: "/assets/CreativeOS/img-gen.png",
          ready: true,
          alt: "CreativeOS image generation — model, aspect ratio and resolution beside the generated frame",
          ratio: "2557 / 1393",
        },
        {
          src: "/assets/CreativeOS/video-gen.webp",
          ready: true,
          alt: "CreativeOS video generation — model, frames, and the finished clip",
          ratio: "2553 / 1402",
        },
      ],
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
    /* Three pictures that should each be seen: scaled down and spread
       so only a corner of the drawing photo laps the dog — the forest
       up left, the dog up right, Cyril drawing along the foot. */
    cards: [
      { left: 0, top: 0, width: 46, rotate: -4, z: 1, from: { x: -64, y: -10 } },
      { left: 56, top: 2, width: 40, rotate: 3, z: 2, from: { x: 64, y: -10 } },
      { left: 22, top: 48, width: 50, rotate: -2, z: 3, from: { x: 0, y: 29 } },
    ],
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
