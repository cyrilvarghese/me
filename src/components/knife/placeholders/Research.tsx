import { svgProps, TOOL_BACK, TOOL_BACK_DETAIL, EDGE_WHITE_SOFT, RED_EDGE, SCREW } from "./common";

/** Research: magnifier lens blade (back layer, hidden when closed). */
export default function Research() {
  return (
    <svg {...svgProps}>
      <rect x="240" y="610" width="260" height="24" rx="10" fill={TOOL_BACK} />
      <path d="M244 611 H496" stroke={EDGE_WHITE_SOFT} strokeWidth="1.5" />
      <circle cx="215" cy="622" r="42" stroke={TOOL_BACK_DETAIL} strokeWidth="16" />
      <circle data-tip="" cx="215" cy="622" r="26" stroke={RED_EDGE} strokeWidth="2" />
      <circle cx="500" cy="622" r="11" fill="#130f0f" stroke={SCREW} strokeWidth="3" />
      <circle cx="500" cy="622" r="3.5" fill={SCREW} />
    </svg>
  );
}
