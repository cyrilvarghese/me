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
    cover: "/assets/CreativeOS/cover-desk.webp",
    num: "01",
    category: "Product + Design Engineering",
    headline: "Turning a fragmented AI production process into one creative canvas.",
    startedWith:
      "Creative teams moved between scripts, prompts, references and multiple generation tools to produce individual shots.",
    built:
      "A canvas-based production system where agents help compose shots, create prompts, manage references and generate image and video assets.",
  },
  {
    slug: "case-chat",
    cover: "/assets/CaseChat/cover-desk.webp",
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
    category: "Product Designer",
    headline: "Making complex operations move faster through software.",
    startedWith:
      "A growing operation where quoting, dispatch and scheduling lived in spreadsheets, phone calls and institutional memory.",
    built:
      "A suite of internal products covering quoting, dispatch, scheduling and reporting — the unglamorous software that makes a business move.",
    results: [
      { value: "20+", label: "Internal products" },
      { value: "1 hr", label: "Faster dispatch" },
      { value: "8 min", label: "Faster quote issuance" },
      { value: "25%", label: "Fewer no-shows" },
    ],
  },
];
