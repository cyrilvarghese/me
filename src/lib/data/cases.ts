export type CaseStudy = {
  slug: string;
  num: string;
  category: string;
  headline: string;
  startedWith: string;
  built: string;
  cover?: string;
  /** Market and subject, under the cover — what kind of product this was,
      before the reader commits to the headline. Written in natural case;
      .mono-label uppercases them.

      `accent` marks the one that carries the case, which is the subject
      rather than the market: B2B/B2C are how a scanner sorts, but the
      domain is what they are deciding about. Flagged per tag rather than
      taken from the order, so the accent can sit wherever the phrase falls
      and red stays on the thing that matters. One per case. */
  tags?: { label: string; accent?: boolean }[];
  results?: { value: string; label: string }[];
};

export const cases: CaseStudy[] = [
  {
    slug: "creative-os",
    cover: "/assets/CreativeOS/cover-desk.webp",
    tags: [
      { label: "B2C" },
      { label: "B2B" },
      { label: "GenAI asset generation", accent: true },
    ],
    num: "01",
    category: "Design Engineer and Product Manager",
    headline: "Bringing a fragmented AI production process into one creative workspace.",
    startedWith:
      "Creative teams moved between scripts, prompts, references and multiple generation tools to produce individual shots.",
    built:
      "A canvas-based production system where agents help compose shots, create prompts, manage references and generate image and video assets.",
    results: [{ value: "1.7×", label: "Faster to create one reel or post" }],
  },
  {
    slug: "case-chat",
    cover: "/assets/CaseChat/cover-desk.webp",
    tags: [
      { label: "B2C" },
      { label: "Medical education", accent: true },
      { label: "AI-powered simulation" },
    ],
    num: "02",
    category: "Design Engineer and Founder",
    headline: "A safe space for medical students to learn from their mistakes.",
    startedWith:
      "Medical students need repeated opportunities to make clinical decisions and receive useful feedback.",
    built:
      "An interactive system where students work through AI-generated clinical cases, make diagnostic decisions and receive structured feedback.",
    results: [{ value: "Unlimited patient access", label: "Through a virtual AI-powered clinical simulation" }],
  },
  {
    slug: "msig",
    cover: "/assets/MSIG/cover-desk.webp",
    tags: [{ label: "B2B" }, { label: "Agent insurance portal", accent: true }],
    num: "03",
    category: "Lead Product Designer",
    headline: "Turning a legacy insurance portal into a consumer-grade one.",
    startedWith:
      "A legacy agent portal with inefficient workflows, poor usability and no mobile support — tedious data entry, unclear interactions, and deals that were hard to close in the field.",
    built:
      "A scalable, responsive design system for multi-step data entry — logically grouped form fields, wizards with autosave, and renewals, payments and GWP tracked automatically.",
    results: [{ value: "~8 min", label: "40% reduction in quote issuance" }],
  },
];

/** The case that follows this one, as a ring: the last hands back to the
    first. The closing row on a case page is the only caller — a reader
    who reaches the bottom of the last study should still be offered
    somewhere to go, and the alternative (offering nothing) makes the
    third case a dead end for no reason the reader can see.

    Returns undefined for a slug that is not a case, which the route
    cannot produce (dynamicParams = false) but a hand-written link can. */
export function nextCase(slug: string): CaseStudy | undefined {
  const i = cases.findIndex((c) => c.slug === slug);
  return i === -1 ? undefined : cases[(i + 1) % cases.length];
}
