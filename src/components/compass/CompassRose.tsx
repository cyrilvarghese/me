import { svgProps, EDGE_WHITE, RED, TOOL_FRONT_DETAIL } from "@/components/knife/placeholders/common";

/**
 * Compass rose in the knife's element language: graphite + hairline white +
 * signal red, with the same center pin as the knife's hinge.
 *
 * The needle is an HTML layer (not an SVG <g>) rotated around its own
 * center via CSS transform-origin — SVG-group rotation with svgOrigin left
 * translation residue behind after ScrollTrigger refreshes. Layer order:
 * dial → needle → cap pin, like a real compass.
 */
export default function CompassRose() {
  const ticks = Array.from({ length: 24 }, (_, i) => i * 15);
  const layer: React.CSSProperties = { position: "absolute", inset: 0 };
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "1" }}>
      {/* cast shadow: the solid dial blocks the stage bloom and throws a
          soft penumbra just past its rim */}
      <div
        aria-hidden
        style={{
          ...layer,
          background:
            "radial-gradient(circle closest-side, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.28) 70%, transparent 80%)",
        }}
      />
      <svg {...svgProps} style={layer}>
        {/* opaque face — the dial is a solid object in front of the light */}
        <circle cx="500" cy="500" r="310" fill="#1a1414" />
        <circle cx="500" cy="500" r="310" stroke="rgba(248,244,242,0.25)" strokeWidth="2" />
        <circle cx="500" cy="500" r="270" stroke="rgba(234,0,0,0.28)" strokeWidth="1.5" />

        {ticks.map((a) => {
          const major = a % 90 === 0;
          const r0 = major ? 282 : 296;
          const rad = ((a - 90) * Math.PI) / 180;
          const cos = Math.cos(rad);
          const sin = Math.sin(rad);
          // rounded so SSR and client serialize identically (hydration)
          const px = (v: number) => Math.round(v * 100) / 100;
          return (
            <line
              key={a}
              x1={px(500 + r0 * cos)}
              y1={px(500 + r0 * sin)}
              x2={px(500 + 310 * cos)}
              y2={px(500 + 310 * sin)}
              stroke={major ? "rgba(248,244,242,0.55)" : "rgba(248,244,242,0.18)"}
              strokeWidth={major ? 3 : 2}
            />
          );
        })}

        {/* outcome marker at north */}
        <polygon points="500,150 513,174 500,198 487,174" fill={RED} />
      </svg>

      <div data-needle="" style={{ ...layer, transformOrigin: "50% 50%", willChange: "transform" }}>
        <svg {...svgProps}>
          <polygon points="500,240 478,520 522,520" fill={RED} />
          <polygon points="500,760 482,520 518,520" fill={TOOL_FRONT_DETAIL} stroke={EDGE_WHITE} strokeWidth="1" />
        </svg>
      </div>

      {/* center pin above the needle — same element as the knife hinge */}
      <svg {...svgProps} style={layer}>
        <circle cx="500" cy="500" r="16" fill="#130f0f" stroke={RED} strokeWidth="3" />
        <circle cx="500" cy="500" r="5" fill={RED} />
      </svg>
    </div>
  );
}
