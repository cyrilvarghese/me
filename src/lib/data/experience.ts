import type { CapabilityId } from "./capabilities";

export type ExperienceEntry = {
  /** Big mono anchor, e.g. "3 YRS" */
  duration: string;
  period: string;
  role: string;
  /** Single most-impactful line — no paragraphs (user rule: one-liners only). */
  impact: string;
  /** Which blades stay open while this entry is active. */
  caps: Record<CapabilityId, boolean>;
};

/** Newest first — mirrors the timeline on the old framer site. */
export const experience: ExperienceEntry[] = [
  {
    duration: "2+ yrs",
    period: "2024 — Present",
    role: "Founding Product Designer — CaseChat",
    impact: "Built and launched an AI clinical simulator — research to go-to-market, solo.",
    caps: { research: true, product: true, design: true, code: true, ai: true, gtm: true },
  },
  {
    duration: "2 yrs",
    period: "2022 — 2024",
    role: "Consulting Product Designer",
    impact: "Redesigned data-heavy fintech and insurance tools for MSIG, Razorpay and 1Finance.",
    caps: { research: true, product: false, design: true, code: false, ai: false, gtm: false },
  },
  {
    duration: "3 yrs",
    period: "2019 — 2022",
    role: "Lead Product Designer — DMart",
    impact: "20+ internal apps. Dispatch 30% faster.",
    caps: { research: true, product: true, design: true, code: false, ai: false, gtm: false },
  },
  {
    duration: "9 yrs",
    period: "2010 — 2019",
    role: "Product Engineer",
    impact: "Capgemini to SentioVR — web, mobile and VR products across four industries.",
    caps: { research: false, product: false, design: true, code: true, ai: false, gtm: false },
  },
];
