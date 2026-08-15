import { svgProps, TOOL_FRONT, RED_DEEP, SCREW } from "./common";

/** AI: awl spike with a four-point spark (front layer). */
export default function Ai() {
  return (
    <svg {...svgProps}>
      <polygon points="500,622 340,626 300,634 340,642 500,646" fill={TOOL_FRONT} />
      <path
        d="M262 610 L268 628 L286 634 L268 640 L262 658 L256 640 L238 634 L256 628 Z"
        fill={RED_DEEP}
        data-tip=""
      />
      <circle cx="500" cy="634" r="11" fill="#150f0f" stroke={SCREW} strokeWidth="3" />
      <circle cx="500" cy="634" r="3.5" fill={SCREW} />
    </svg>
  );
}
