import { svgProps, TOOL_FRONT, TOOL_FRONT_DETAIL, RED_DEEP, SCREW } from "./common";

/** GTM: corkscrew — things that open bottles ship things (front layer). */
export default function Gtm() {
  return (
    <svg {...svgProps}>
      <rect x="305" y="639" width="195" height="18" rx="8" fill={TOOL_FRONT} />
      <path
        d="M305 648 C293 618 272 618 268 648 C264 678 244 678 240 648 C236 618 216 618 212 648"
        stroke={TOOL_FRONT_DETAIL}
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path
        d="M212 648 C210 662 202 670 192 675"
        stroke={RED_DEEP}
        strokeWidth="9"
        strokeLinecap="round"
        data-tip=""
      />
      <circle cx="500" cy="648" r="11" fill="#130f0f" stroke={SCREW} strokeWidth="3" />
      <circle cx="500" cy="648" r="3.5" fill={SCREW} />
    </svg>
  );
}
