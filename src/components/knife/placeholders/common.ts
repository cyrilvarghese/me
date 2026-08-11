/** Shared drawing constants for placeholder knife art (black/white/red theme). */
export const VIEWBOX = "0 0 1000 1000";

export const BODY_FILL = "#1a1a1a";
export const TOOL_BACK = "#1e1e1e";
export const TOOL_BACK_DETAIL = "#2c2c2c";
export const TOOL_FRONT = "#262626";
export const TOOL_FRONT_DETAIL = "#2f2f2f";

export const EDGE_WHITE = "rgba(248, 248, 248, 0.16)";
export const EDGE_WHITE_SOFT = "rgba(248, 248, 248, 0.08)";
export const RED = "#ea0000";
export const RED_DEEP = "#c90000";
export const RED_EDGE = "rgba(234, 0, 0, 0.65)";
export const ETCH = "rgba(248, 248, 248, 0.3)";

export const svgProps = {
  viewBox: VIEWBOX,
  width: "100%",
  height: "100%",
  fill: "none",
} as const;
