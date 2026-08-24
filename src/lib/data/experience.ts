export type Role = {
  /** rendered as-is; the running role reads "2024 —" with no end */
  years: string;
  /** first year of the entry, for the ordering invariant */
  from: number;
  title: string;
  /** where the work happened — one employer, or the run of them */
  org: string;
  /** one line. The timeline is a scan, not a CV. Optional only because
      a role can land here before its line is written — the rung renders
      without it rather than carrying a placeholder. */
  body?: string;
  tools: string[];
};

/** Reverse chronological, newest first — the order the timeline draws.

    Two roles in one title are joined with "and", three with a comma and
    an "and" — never slashes. cases.ts already names these same roles that
    way ("Design Engineer and Product Manager"), and a slash reads as a
    toggle between two jobs rather than one person holding both.
    Locked by data.test.ts: a timeline that silently falls out of order
    still renders, which is exactly why it needs a test rather than a
    comment. */
export const experience: Role[] = [
  {
    years: "2026 — Present",
    from: 2026,
    title: "Design Engineer and Product Manager",
    org: "Yuvabe",
    body: "Leading UX, product and front-end engineering on CreativeOS, Yuvabe's flagship AI content generation platform.",
    /* CreativeOS's stack, not CaseChat's — the two used to share one list,
       which read as a single career-long stack rather than two products.
       Design engineering and front end, in that order: the work as it is
       actually done, not a catalogue of everything the stack touches. */
    tools: [
      "Figma",
      "Design systems",
      "User interviews",
      "Usability testing",
      "GTM strategy",
      "Next.js",
      "Tailwind",
      "shadcn/ui",
      "RAG",
      "LLM APIs",
    ],
  },
  {
    years: "2024 — 2025",
    from: 2024,
    title: "Founder, Design Engineer and CPTO",
    org: "CaseChat",
    body: "Built and shipped an AI simulator where medical students practise diagnosis, from first research through launch.",
    /* CaseChat's own stack (Cyril, 2026-08-22): Svelte-TS, FastAPI and
       LangChain are this product's, and were wrongly attributed to the
       CreativeOS work while the two entries shared a list. */
    tools: [
      "Figma",
      "User interviews",
      "Usability testing",
      "GTM strategy",
      "Svelte-TS",
      "FastAPI",
      "RAG",
      "LangChain",
      "LLM APIs",
    ],
  },
  {
    years: "2022 — 2024",
    from: 2022,
    title: "Consulting Product Designer",
    org: "MSIG, Razorpay, 1Finance",
    body: "Rebuilt data-heavy fintech and insurance tools, replacing legacy enterprise workflows.",
    tools: [
      "Figma",
      "FigJam",
      "Stakeholder workshops",
      "User research",
      "Usability testing",
      "Design systems",
    ],
  },
  {
    years: "2019 — 2022",
    from: 2019,
    title: "Lead Product Designer",
    org: "DMart",
    body: "Turned manual warehouse work into 20+ connected apps; dispatch times fell by up to 30%.",
    tools: [
      "Figma",
      "FigJam",
      "Sketch",
      "Building Figma plugins",
      "Design systems",
      "Field research",
      "Cross-functional collaboration",
      "Usability testing",
    ],
  },
  {
    years: "2010 — 2019",
    from: 2010,
    title: "Product Engineer",
    org: "Capgemini, Aspire, SentioVR, Zolostays",
    body: "Web, mobile and VR products across real estate, architecture, healthcare and public safety.",
    tools: [".NET", "C#", "JS/TS", "React", "Angular", "Unity", "Sketch"],
  },
];
