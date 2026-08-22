export type CapabilityId = "research" | "product" | "design" | "code" | "ai" | "gtm";

export type Capability = {
  id: CapabilityId;
  label: string;
  statement: string;
  tags: string[];
  /** Contextual line shown on desktop blade hover (spec §39). */
  hover: string;
  /** Date range shown in the lineup beat (user sketch, 2026-08-15). */
  years: string;
  /** Featured duration, e.g. "17 yrs". */
  duration: string;
  /** History shown under the standing tool in the lineup. Facts are
      \n-separated; when there are several, the LAST is the current role
      and renders brighter (OutcomeTransition .factNow). */
  line: string;
  /** Signed degrees from closed (0). Positive = back-of-body tools sweeping up. */
  openAngle: number;
  /** Whether the tool emerges from behind the knife body or in front of it. */
  layer: "back" | "front";
};

/** Shared hinge position as a percentage of the square knife canvas (spec §10). */
export const HINGE = { x: 50.5, y: 63 };

/** The eyebrow over the six standing tools — the lineup's title, in the
    mono voice every section opens with (Proof, About). The hero reads
    "I work across product, design, engineering and AI"; this names what
    the parts on the next screen are, so they arrive introduced rather
    than cold (Cyril, 2026-08-22). One string for both tellings: the
    pinned desktop stage (OutcomeTransition) and the phone's rows
    (ToolList) cannot drift apart. */
export const lineupTitle = "My skills, broken down by domain";

export const capabilities: Capability[] = [
  {
    id: "research",
    label: "Research",
    statement: "Find out what is actually happening.",
    tags: ["User research", "Workflow observation", "Market research"],
    hover:
      "Every problem starts with finding out what people actually do — interviews, observation and market context before any solution.",
    years: "2019 — Present",
    duration: "7 yrs",
    line: "Product research as a designer.",
    openAngle: 72,
    layer: "back",
  },
  {
    id: "product",
    label: "Product",
    statement: "Decide what should exist and what shouldn't.",
    tags: ["0→1", "MVP", "Systems", "Prioritisation"],
    hover:
      "Deciding what to build matters more than building it well — scope, sequence, and the discipline to say no.",
    years: "2023 — Present",
    duration: "3 yrs",
    line: "Founded CaseChat\u00A0— built the platform ground up.\nCurrently Leading Product at Yuvabe\u00A0Studios.",
    openAngle: 42,
    layer: "back",
  },
  {
    id: "design",
    label: "Design",
    statement: "Turn complexity into something understandable.",
    tags: ["Interaction", "Prototyping", "System design"],
    hover:
      "From complex workflow to an interface people understand without a manual — interaction, prototyping, system design.",
    years: "2019 — Present",
    duration: "7 yrs",
    line: "Led design at DMart.\nEnterprise UX for Razorpay, 1Finance and MSIG.",
    openAngle: 28,
    layer: "back",
  },
  {
    id: "code",
    label: "Code",
    statement: "Don't stop at the prototype.",
    tags: ["TypeScript", "Svelte", "React", "APIs"],
    hover:
      "Built software professionally before moving into product design, and continue to build working products rather than stopping at prototypes.",
    years: "2009 — Present",
    duration: "13 yrs",
    line: "Software engineer — products for mobile, web, XR and AI.",
    openAngle: -22,
    layer: "front",
  },
  {
    id: "ai",
    label: "AI",
    statement: "Build new product behaviour, not another chatbot.",
    tags: ["Agents", "LLMs", "Evals", "Generation"],
    hover:
      "Agentic systems, structured outputs, evals — AI as product behaviour, not a bolt-on chatbot.",
    years: "2023 — Present",
    duration: "3 yrs",
    line: "Built CaseChat's AI platform for simulated medical learning.\nNow building a D2C AI product for social-media\u00A0assets.",
    openAngle: -48,
    layer: "front",
  },
  {
    id: "gtm",
    label: "GTM",
    statement: "Get the product into people's hands.",
    tags: ["Positioning", "Pilots", "Adoption", "Customer discovery"],
    hover:
      "Positioning, pilots and adoption work — a product isn't shipped until people rely on it.",
    years: "2024 — Present",
    duration: "2 yrs",
    line: "GTM for CaseChat.\nCurrently leading GTM at Yuvabe\u00A0Studios.",
    openAngle: -76,
    layer: "front",
  },
];
