import { svgProps, TOOL_FRONT, EDGE_WHITE, RED_EDGE, ETCH, SCREW } from "./common";

/** Code: main blade with etched markup (front layer, spine visible when closed). */
export default function Code() {
  return (
    <svg {...svgProps}>
      <path d="M500 600 L240 600 C205 602 176 612 166 622 L500 654 Z" fill={TOOL_FRONT} />
      <path data-tip="" d="M166 623 L500 655" stroke={RED_EDGE} strokeWidth="2.5" />
      <path d="M240 601 H500" stroke={EDGE_WHITE} strokeWidth="1.5" />
      <text
        pointerEvents="none"
        x="282"
        y="634"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="24"
        letterSpacing="2"
        fill={ETCH}
      >
        &lt;/&gt;
      </text>
      <circle cx="498" cy="628" r="11" fill="#130f0f" stroke={SCREW} strokeWidth="3" />
      <circle cx="498" cy="628" r="3.5" fill={SCREW} />
    </svg>
  );
}
