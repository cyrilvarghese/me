import { svgProps, EDGE_WHITE, EDGE_WHITE_SOFT, RED } from "./common";

/* The monogram sits just left of the pivot pin, stamped into the scale
   rather than centred on it — markings on a real scale crowd the
   hardware, they do not float in the middle of the slab. End-anchored,
   so the gap to the pin holds however the letters are spaced.

   Embossed by drawing the same letters three times: a lit copy up-left,
   a shadowed copy down-right, the mark itself on top. Light from above
   left, the same direction the scale's own top edge highlight assumes.
   Three <text> nodes rather than a filter or a <use> pair — the canvas
   is mounted twice on the page (OutcomeTransition and FinalCTA), so any
   id in here would be a duplicate, and a filter would be re-rasterised
   through every frame of the GSAP rotation. Neither black nor white:
   both offsets carry the accent tinge every neutral on this site does. */
const MARK = {
  x: 478,
  y: 639,
  textAnchor: "end",
  dominantBaseline: "middle",
  fontFamily: "var(--font-mono)",
  fontSize: 26,
  letterSpacing: 8,
} as const;

const MARK_SHADOW = "rgba(13, 10, 10, 0.9)";
const MARK_LIGHT = "rgba(248, 244, 242, 0.26)";

function Mark({ dx = 0, dy = 0, fill }: { dx?: number; dy?: number; fill: string }) {
  return (
    <text {...MARK} x={MARK.x + dx} y={MARK.y + dy} fill={fill}>
      CV
    </text>
  );
}

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
      <Mark dx={1.2} dy={1.4} fill={MARK_SHADOW} />
      <Mark dx={-1} dy={-1} fill={MARK_LIGHT} />
      <Mark fill={RED} />
    </svg>
  );
}
