/**
 * Art source switch. Placeholder = inline SVG components drawn in code.
 * When final AI-generated raster layers land in /public/assets/knife/,
 * flip ART_MODE to "raster" — no other code change needed.
 */
export const ART_MODE: "placeholder" | "raster" = "placeholder";

export const rasterSrc = (id: string) => `/assets/knife/${id}.webp`;

/** The closed knife is drawn left of centre inside its square canvas: the
    body slab spans x 140–570 of the 1000 viewBox, so the silhouette's
    centre sits at 0.355 rather than 0.5. Anything that centres the canvas
    BOX therefore leaves the art looking 14.5% of a box-width short, which
    is exactly what it looks like next to centred type. Push the box right
    by this fraction of its own width to centre what the eye actually sees.

    Hero keeps its own slightly smaller 0.135: its peek is rotated and
    scaled, so the silhouette it centres is not this one. */
export const ART_CENTRE_SHIFT = 0.145;
