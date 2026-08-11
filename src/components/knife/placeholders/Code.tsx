import { svgProps, TOOL_FRONT, EDGE_WHITE, RED_EDGE, ETCH } from "./common";

/** Code: main blade with etched markup (front layer, spine visible when closed). */
export default function Code() {
  return (
    <svg {...svgProps}>
      <path d="M500 600 L240 600 C205 602 176 612 166 622 L500 654 Z" fill={TOOL_FRONT} />
      <path d="M166 623 L500 655" stroke={RED_EDGE} strokeWidth="2.5" />
      <path d="M240 601 H500" stroke={EDGE_WHITE} strokeWidth="1.5" />
      <text
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
    </svg>
  );
}
