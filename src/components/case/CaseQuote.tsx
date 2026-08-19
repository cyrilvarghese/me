import styles from "./CaseQuote.module.css";

/** Third-party pull quote. Shares CaseSection's eyebrow/content grid so
    it reads as one more labeled row rather than a testimonial badge —
    the words are someone else's, so they are never paraphrased. */
export default function CaseQuote({
  quote,
  name,
  title,
}: {
  quote: string;
  name: string;
  title: string;
}) {
  return (
    <section className={`section-shell ${styles.section}`}>
      <figure className={styles.grid}>
        <p className={`mono-label ${styles.eyebrow}`}>In their words</p>
        <div>
          <blockquote className={`serif-display ${styles.quote}`}>{quote}</blockquote>
          <figcaption className={`mono-label ${styles.attribution}`}>
            {name} <span className={styles.role}>{title}</span>
          </figcaption>
        </div>
      </figure>
    </section>
  );
}
