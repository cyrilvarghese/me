/**
 * Art source switch. Placeholder = inline SVG components drawn in code.
 * When final AI-generated raster layers land in /public/assets/knife/,
 * flip ART_MODE to "raster" — no other code change needed.
 */
export const ART_MODE: "placeholder" | "raster" = "placeholder";

export const rasterSrc = (id: string) => `/assets/knife/${id}.webp`;
