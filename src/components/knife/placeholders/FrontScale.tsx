import { svgProps, EDGE_WHITE, EDGE_WHITE_SOFT, RED } from "./common";

/**
 * Front scale (spec §11 "front-highlight", z 90): the outer face of the knife.
 * Closed tools hide between this and the body; open tools swing out past it.
 * Carries the pins and CV mark since it is the outermost surface.
 */
export default function FrontScale() {
  return (
    <svg {...svgProps}>
      <rect x="150" y="577" width="410" height="106" rx="53" fill="#211919" stroke={EDGE_WHITE} strokeWidth="1.5" />
      <path d="M210 589 H500" stroke={EDGE_WHITE_SOFT} strokeWidth="2" strokeLinecap="round" />
      <path d="M210 672 H500" stroke="rgba(234,0,0,0.35)" strokeWidth="2" strokeLinecap="round" />
      {/* rear decorative pin */}
      <circle cx="205" cy="630" r="10" fill="#130f0f" stroke={EDGE_WHITE} strokeWidth="2" />
      {/* hinge pin — the shared pivot at (505, 630) */}
      <circle cx="505" cy="630" r="14" fill="#130f0f" stroke={RED} strokeWidth="3" />
      <circle cx="505" cy="630" r="4" fill={RED} />
      <text
        x="352"
        y="639"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="var(--font-mono)"
        fontSize="26"
        letterSpacing="8"
        fill={RED}
      >
        CV
      </text>
    </svg>
  );
}
