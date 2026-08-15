/** Shared drawing constants for placeholder knife art (black/white/red theme). */
export const VIEWBOX = "0 0 1000 1000";

export const BODY_FILL = "#211717";
export const TOOL_BACK = "#251a1a";
export const TOOL_BACK_DETAIL = "#332626";
export const TOOL_FRONT = "#2d2020";
export const TOOL_FRONT_DETAIL = "#362828";

export const EDGE_WHITE = "rgba(248, 242, 240, 0.16)";
export const EDGE_WHITE_SOFT = "rgba(248, 242, 240, 0.08)";
export const RED = "#ea0000";
export const RED_DEEP = "#c90000";
export const RED_EDGE = "rgba(234, 0, 0, 0.65)";
export const ETCH = "rgba(248, 242, 240, 0.3)";
/** Pivot screw at each tool's hinge end — dark muted red so it never
    competes with the bright tips. */
export const SCREW = "#8a1111";

export const svgProps = {
  viewBox: VIEWBOX,
  width: "100%",
  height: "100%",
  fill: "none",
} as const;
