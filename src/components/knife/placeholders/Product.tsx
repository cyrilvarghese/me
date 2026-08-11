import { svgProps, TOOL_BACK, TOOL_BACK_DETAIL, RED_DEEP } from "./common";

/** Product: compass / reamer spike (back layer). */
export default function Product() {
  return (
    <svg {...svgProps}>
      <polygon points="500,614 250,621 172,630 250,639 500,646" fill={TOOL_BACK} />
      <rect x="246" y="598" width="16" height="64" rx="6" fill={TOOL_BACK_DETAIL} />
      <polygon points="204,626 172,630 204,634" fill={RED_DEEP} />
    </svg>
  );
}
