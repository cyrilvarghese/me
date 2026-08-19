import styles from "./CaseSection.module.css";

/** Labeled prose row: mono eyebrow column, free content column.
    `mock` marks scaffold copy awaiting Cyril's real words.
    `wide` drops the eyebrow above the content so imagery gets the full
    shell width — prose stays in the narrow column where the measure
    matters, diagrams don't. */
export default function CaseSection({
  eyebrow,
  heading,
  mock,
  wide,
  children,
}: {
  eyebrow: string;
  heading?: string;
  mock?: boolean;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={`section-shell ${styles.section}`}>
      <div className={`${styles.grid} ${wide ? styles.wide : ""}`}>
        <p className={`mono-label ${styles.eyebrow}`}>
          {eyebrow}
          {mock && <span className={styles.mockTag}>Mock</span>}
        </p>
        <div>
          {heading && <h2 className={`serif-display ${styles.heading}`}>{heading}</h2>}
          <div className={styles.body}>{children}</div>
        </div>
      </div>
    </section>
  );
}
