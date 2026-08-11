import { svgProps, BODY_FILL, EDGE_WHITE } from "./common";

/** Back scale: the rear slab of the knife. Kept plain — pins and the CV mark
    live on FrontScale, the outermost visible face. */
export default function Body() {
  return (
    <svg {...svgProps}>
      <rect x="140" y="565" width="430" height="130" rx="65" fill={BODY_FILL} stroke={EDGE_WHITE} strokeWidth="2" />
    </svg>
  );
}
