import { capabilities, type CapabilityId } from "@/lib/data/capabilities";
import KnifeLayer from "./KnifeLayer";
import styles from "./knife.module.css";

/** z-order per spec §11: back tools behind body, front tools above it. */
const LAYER_Z: Record<CapabilityId | "body" | "front-scale", number> = {
  research: 20,
  product: 30,
  design: 40,
  body: 50,
  code: 60,
  ai: 70,
  gtm: 80,
  "front-scale": 90,
};

type Props = {
  /** Static rotation per tool in degrees; omit for closed (0). GSAP overrides these at runtime via [data-tool] targets. */
  angles?: Partial<Record<CapabilityId, number>>;
  className?: string;
  /** Pose under prefers-reduced-motion: "open" forces every blade to its open angle via CSS. */
  reducedPose?: "open" | "closed";
};

/**
 * The stacked knife. All layers share one square canvas and one hinge
 * (transform-origin 50.5% 63%), so rotating a [data-tool] layer swings
 * that tool open around the pin.
 */
export default function KnifeCanvas({ angles, className, reducedPose = "open" }: Props) {
  return (
    <div
      className={`${styles.canvas} ${reducedPose === "open" ? styles.rmOpen : styles.rmClosed} ${className ?? ""}`}
      aria-hidden="true"
    >
      <div className={styles.shadow} style={{ zIndex: 10 }} />
      {capabilities.map((c) => (
        <div
          key={c.id}
          data-tool={c.id}
          className={styles.tool}
          style={{
            zIndex: LAYER_Z[c.id],
            transform: `rotate(${angles?.[c.id] ?? 0}deg)`,
            ["--open" as string]: `${c.openAngle}deg`,
          }}
        >
          <KnifeLayer id={c.id} />
        </div>
      ))}
      <div className={styles.layer} style={{ zIndex: LAYER_Z.body }}>
        <KnifeLayer id="body" />
      </div>
      <div className={styles.layer} style={{ zIndex: LAYER_Z["front-scale"] }}>
        <KnifeLayer id="front-scale" />
      </div>
    </div>
  );
}
