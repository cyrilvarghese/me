import styles from "./CaseQuote.module.css";

/** A voice from inside the work, given its own band. Used where the
    sentence is evidence rather than narration — a founder saying what
    the product is for, a research finding that reframed the brief — and
    deliberately rare, so it still lands the second time. */
export default function CaseQuote({
  quote,
  name,
  role,
  marks = true,
}: {
  quote: string;
  name?: string;
  role?: string;
  /** The outsized quotation marks behind the words. On a long attributed
      quote they frame it; on a short unattributed one they crowd it, so
      an instance can turn them off. */
  marks?: boolean;
}) {
  return (
    <section className={`section-shell ${styles.block}`}>
      <figure className={styles.figure} data-marks={marks ? "true" : "false"}>
        {/* the rule stands in for the quote mark: red, decorative, and
            large-type only — the same job the accent does everywhere */}
        <blockquote className={`serif-display ${styles.quote}`}>{quote}</blockquote>
        {name && (
          <figcaption className={`mono-label ${styles.by}`}>
            {name}
            {role && <span className={styles.role}>{role}</span>}
          </figcaption>
        )}
      </figure>
    </section>
  );
}
