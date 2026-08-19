import styles from "./CaseBrief.module.css";

/** The opening, reduced to what only it can say: what the work was, what
    it produced, who did it.

    CaseSummary carries Pain / Solution / Impact in three columns, which
    earns its place when those are the only statement of them on the
    page. Here the problems get a row of their own and the solution a
    drawing of its own, so repeating both up top is the reader doing the
    same work twice. */
export default function CaseBrief({
  eyebrow,
  heading,
  lede,
  impact,
  meta,
}: {
  eyebrow: string;
  heading: string;
  lede: string;
  impact: { label: string; value: string; body: string };
  meta: { label: string; body: string }[];
}) {
  return (
    <section className={`section-shell ${styles.block}`}>
      <div className={styles.head}>
        <p className={`mono-label ${styles.eyebrow}`}>{eyebrow}</p>
        <div>
          <h2 className={`serif-display ${styles.heading}`}>{heading}</h2>
          <p className={styles.lede}>{lede}</p>
        </div>
      </div>

      <div className={styles.facts}>
        <div className={styles.impact}>
          <p className={`mono-label ${styles.label}`}>{impact.label}</p>
          <p className={styles.value}>{impact.value}</p>
          <p className={styles.body}>{impact.body}</p>
        </div>

        {/* labelled facts about the engagement, not argument */}
        <dl className={styles.meta}>
          {meta.map((m) => (
            <div key={m.label} className={styles.metaItem}>
              <dt className={`mono-label ${styles.label}`}>{m.label}</dt>
              <dd className={styles.metaBody}>{m.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
