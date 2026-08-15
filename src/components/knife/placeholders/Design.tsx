import { svgProps, TOOL_BACK, TOOL_BACK_DETAIL, RED, SCREW } from "./common";

/** Design: pen nib blade (back layer). */
export default function Design() {
  return (
    <svg {...svgProps}>
      <rect x="265" y="624" width="235" height="28" rx="8" fill={TOOL_BACK} />
      <polygon points="268,616 190,629 160,638 190,647 268,660" fill={TOOL_BACK_DETAIL} />
      <path d="M262 638 L190 638" stroke="#171111" strokeWidth="3" />
      <circle cx="232" cy="638" r="5" fill="#171111" />
      <polygon data-tip="" points="178,634.5 160,638 178,641.5" fill={RED} />
      <circle cx="500" cy="638" r="11" fill="#150f0f" stroke={SCREW} strokeWidth="3" />
      <circle cx="500" cy="638" r="3.5" fill={SCREW} />
    </svg>
  );
}
