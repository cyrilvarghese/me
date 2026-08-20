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

/** Shared rather than repeated: the Yuvabe and CaseChat work runs on the
    same stack, and two copies of a list drift the moment one is edited. */
const AI_PRODUCT_TOOLS = [
  "Figma",
  "User interviews",
  "Usability testing",
  "GTM strategy",
  "Svelte-TS",
  "FastAPI",
  "RAG",
  "LangChain",
  "LLM APIs",
];

/** Reverse chronological, newest first — the order the timeline draws.
    Locked by data.test.ts: a timeline that silently falls out of order
    still renders, which is exactly why it needs a test rather than a
    comment. */
export const experience: Role[] = [
  {
    years: "2026 — Present",
    from: 2026,
    title: "Design Engineer / Product Manager",
    org: "Yuvabe",
    body: "Leading UX, product and front-end engineering on CreativeOS, Yuvabe's flagship AI content generation platform.",
    tools: AI_PRODUCT_TOOLS,
  },
  {
    years: "2024 — 2026",
    from: 2024,
    title: "Founder / Design Engineer / CTPO",
    org: "CaseChat",
    body: "Built and shipped an AI simulator where medical students practise diagnosis, from first research through launch.",
    tools: AI_PRODUCT_TOOLS,
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
