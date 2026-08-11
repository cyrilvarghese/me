export type CapabilityId = "research" | "product" | "design" | "code" | "ai" | "gtm";

export type Capability = {
  id: CapabilityId;
  label: string;
  statement: string;
  tags: string[];
  /** Contextual line shown on desktop blade hover (spec §39). */
  hover: string;
  /** Signed degrees from closed (0). Positive = back-of-body tools sweeping up. */
  openAngle: number;
  /** Whether the tool emerges from behind the knife body or in front of it. */
  layer: "back" | "front";
};

/** Shared hinge position as a percentage of the square knife canvas (spec §10). */
export const HINGE = { x: 50.5, y: 63 };

export const capabilities: Capability[] = [
  {
    id: "research",
    label: "Research",
    statement: "Find out what is actually happening.",
    tags: ["User research", "Workflow observation", "Market research"],
    hover:
      "Every problem starts with finding out what people actually do — interviews, observation and market context before any solution.",
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
    openAngle: 18,
    layer: "back",
  },
  {
    id: "code",
    label: "Code",
    statement: "Don't stop at the prototype.",
    tags: ["TypeScript", "Svelte", "React", "APIs"],
    hover:
      "Built software professionally before moving into product design, and continue to build working products rather than stopping at prototypes.",
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
    openAngle: -76,
    layer: "front",
  },
];
