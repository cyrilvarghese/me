import { RevealSection } from "./Reveal";
import styles from "./CaseImpact.module.css";

/** The payoff band — it lands after the pain points, not beside them, so
    the number arrives once the problem is real to the reader. */
export default function CaseImpact({
  eyebrow,
  value,
  detail,
  note,
}: {
  eyebrow: string;
  value: string;
  detail: string;
  note?: string;
}) {
  return (
    <RevealSection className={styles.band}>
      <div className={`section-shell ${styles.inner}`}>
        <p className={`mono-label ${styles.eyebrow}`}>{eyebrow}</p>
        <p className={`serif-display ${styles.value}`}>{value}</p>
        <p className={`mono-label ${styles.detail}`}>{detail}</p>
        {note && <p className={styles.note}>{note}</p>}
      </div>
    </RevealSection>
  );
}
