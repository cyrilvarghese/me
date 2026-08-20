import { capabilities, type CapabilityId } from "@/lib/data/capabilities";
import styles from "./knife.module.css";

/**
 * Positions sit just past each tool's open tip, derived from
 * hinge (50.5%, 63%) + open angle at ~0.36 canvas radius.
 */
const LABEL_POS: Record<CapabilityId, { left: string; top: string }> = {
  research: { left: "39%", top: "24%" },
  product: { left: "21%", top: "36%" },
  design: { left: "12%", top: "46%" },
  code: { left: "15%", top: "79%" },
  ai: { left: "25%", top: "90%" },
  gtm: { left: "44%", top: "95%" },
};

export default function ToolLabels({ visible = false }: { visible?: boolean }) {
  return (
    <div className={styles.labels} aria-hidden="true">
      {capabilities.map((c) => (
        <span
          key={c.id}
          data-label={c.id}
          className={`mono-label ${styles.label} ${visible ? styles.labelVisible : ""}`}
          style={{
            left: LABEL_POS[c.id].left,
            top: LABEL_POS[c.id].top,
            transform: `translate(-50%, -50%) rotate(${-c.openAngle * 0.4}deg)`,
          }}
        >
          {c.label}
        </span>
      ))}
    </div>
  );
}
