/** The long version of the About section: the route a reader takes when
    the home page's five-rung timeline is not enough.

    Facts come from Cyril's own account of the same story, recast in the
    house voice — nothing is inferred to fill a row, and where the source
    gives no year, none is invented. Yuvabe is the chapter the source
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
  image: {
    /** The file this slot is waiting for. Drop it in at this exact path
        and flip `ready` — the frame is already reserved at `ratio`, so
        nothing on the page moves when the picture lands. */
    src: string;
    ready: boolean;
    /** rewrite when the picture exists: alt says what is in it, and
        nobody can write that from a filename */
    alt: string;
    /** aspect-ratio in CSS syntax — the box is held before the load */
    ratio: string;
  };
};

export const chapters: Chapter[] = [
  {
    num: "01",
    label: "Early childhood",
    body: [
      "Films and cartoons shaped what I paid attention to early on, and drawing came with them. Most of my time went on learning to draw and making up stories worth drawing.",
    ],
    image: {
      src: "/assets/about/01-childhood.webp",
      ready: false,
      alt: "The films and cartoons that came first.",
      ratio: "4 / 3",
    },
  },
  {
    num: "02",
    label: "Learning the ropes",
    body: [
      "My first jobs were in large organisations and on the founding teams of early-stage startups, building interfaces for mobile and web. Design became the part I wanted to understand properly — its principles, and what they did to the software I was already writing.",
    ],
    image: {
      src: "/assets/about/02-ropes.webp",
      ready: false,
      alt: "The stack of those years.",
      ratio: "3 / 2",
    },
  },
  {
    num: "03",
    label: "The sabbatical",
    body: [
      "A year off work to study storytelling, animation and figure drawing, with philosophy alongside it.",
      "Learning to draw properly changed how I look at everything since — and I learned it from some remarkable people.",
    ],
    image: {
      src: "/assets/about/03-sabbatical.webp",
      ready: false,
      alt: "Pages from the sketchbooks of that year.",
      ratio: "3 / 2",
    },
  },
  {
    num: "04",
    label: "Discovering VR and AR",
    body: [
      "The first headset I tried made the case on its own, so I learned to build VR and AR applications. Directing a story someone stands inside meant working out what a camera angle does to what a viewer feels — which turned out to be most of the craft.",
    ],
    image: {
      src: "/assets/about/04-vr.webp",
      ready: false,
      alt: "An AR experience running on a tablet.",
      ratio: "3 / 2",
    },
  },
  {
    num: "05",
    label: "Transition to product design",
    body: [
      "Designing in VR led me to product design, which is the one place the analytical half and the storytelling half are both the job. Five years in, that has not worn off.",
    ],
    image: {
      src: "/assets/about/05-product.webp",
      ready: false,
      alt: "Product work across desktop, tablet and phone.",
      ratio: "4 / 3",
    },
  },
  {
    num: "06",
    label: "Going solo",
    body: [
      "After leading UX teams on client projects, I went independent as a consultant designer — Verizon, Azentio, Razorpay, MSIG and 1Finance.",
      "The lasting lesson was about consensus: how an outside partner gets a room to a decision it will still hold to next week.",
    ],
    image: {
      src: "/assets/about/06-solo.webp",
      ready: false,
      alt: "The clients of those years.",
      ratio: "3 / 2",
    },
  },
  {
    num: "07",
    label: "CaseChat",
    body: [
      "CaseChat began with a childhood friend who became a doctor. It is an AI case-based learning platform where medical students practise clinical reasoning against simulated patients, and get told where the reasoning went wrong.",
    ],
    link: { href: "https://mycasechat.com", label: "mycasechat.com" },
    image: {
      src: "/assets/about/07-casechat.webp",
      ready: false,
      alt: "The CaseChat clinic.",
      ratio: "16 / 10",
    },
  },
  {
    num: "08",
    label: "Yuvabe",
    body: [
      "Now I lead UX, product and front-end engineering on CreativeOS, Yuvabe's AI content generation platform: the whole production run for a reel — script, references, images, video — on one canvas instead of across five tools.",
    ],
    link: { href: "/work/creative-os", label: "Read the case study" },
    image: {
      src: "/assets/about/08-yuvabe.webp",
      ready: false,
      alt: "The CreativeOS canvas.",
      ratio: "16 / 10",
    },
  },
];

/** The closing chapter. Same shape as the rest so the spine runs through
    it, but it is the one that stops being a career. */
export const sparetime = {
  label: "In my spare time",
  body: [
    "You can find me reading, drawing, playing my guitar, or watching Seinfeld for the 35th time.",
    "I also like meeting people, travelling, and seeing how other places live.",
  ],
  image: {
    src: "/assets/about/09-sparetime.webp",
    ready: false,
    alt: "Drawing, and somewhere else.",
    ratio: "4 / 3",
  },
};
