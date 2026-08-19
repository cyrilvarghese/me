import styles from "./CaseSection.module.css";

/** Labeled prose row: mono eyebrow column, free content column.
    `mock` marks scaffold copy awaiting Cyril's real words. */
export default function CaseSection({
  eyebrow,
  heading,
  mock,
  children,
}: {
  eyebrow: string;
  heading?: string;
  mock?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={`section-shell ${styles.section}`}>
      <div className={styles.grid}>
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
