export type CaseStudy = {
  slug: string;
  num: string;
  category: string;
  headline: string;
  startedWith: string;
  built: string;
  cover?: string;
  results?: { value: string; label: string }[];
};

export const cases: CaseStudy[] = [
  {
    slug: "creative-os",
    cover: "/assets/CreativeOS/web-cover.png",
    num: "01",
    category: "Product + Design Engineering",
    headline: "Turning a fragmented AI production process into one creative workspace.",
    startedWith:
      "Creative teams moved between scripts, prompts, references and multiple generation tools to produce individual shots.",
    built:
      "A canvas-based production system where agents help compose shots, create prompts, manage references and generate image and video assets.",
  },
  {
    slug: "case-chat",
    cover: "/assets/CaseChat/thumbnail.png",
    num: "02",
    category: "Founder + Design Engineering",
    headline: "Turning clinical reasoning into an interactive AI simulation.",
    startedWith:
      "Medical students need repeated opportunities to make clinical decisions and receive useful feedback.",
    built:
      "An interactive system where students work through AI-generated clinical cases, make diagnostic decisions and receive structured feedback.",
  },
  {
    slug: "msig",
    cover: "/assets/MSIG/cover.png",
    num: "03",
    category: "Product Design + Design Systems",
    headline: "Keeping twenty years of insurance complexity out of the agent's way.",
    startedWith:
      "Agents ran their day inside a legacy portal — cluttered forms, statuses that explained nothing, renewals tracked from memory, and nothing that worked on a phone.",
    built:
      "A responsive design system for multi-step data entry — grouped forms, autosaving wizards, and tracking that surfaces renewals, payments and targets on its own.",
    results: [
      { value: "20+ min", label: "To fill one quote, before" },
      { value: "~8 min", label: "Cut from quote issuance" },
    ],
  },
];
