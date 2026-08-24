import { Fragment } from "react";
import { RevealSection } from "./Reveal";
import styles from "./CaseSummary.module.css";

type Item = { label: string; value?: React.ReactNode; body: React.ReactNode };
type Meta = {
  label: string;
  body?: string;
  /** What the reader is here for: the work itself, one item per line.
      Phrases rather than sentences — this column is scanned, not read. */
  lines?: string[];
  /** Short names in the site's tag voice: mono, muted, dot-separated.
      Not chips — bordering every one turns a caption into a control
      strip, which is why they came back out of the case cards
      (CaseStudies.module.css, 2026-08-21). */
  tags?: string[];
};

/** The whole case in one row, before the argument starts: what hurts, what
    replaced it, what that bought. The three comparison bands below then
    argue this summary one pain point at a time, so the reader who stops
    here still leaves with the shape of it. */
export default function CaseSummary({
  eyebrow,
  heading,
  lede,
  items,
  meta,
}: {
  eyebrow: string;
  heading: string;
  /* a node, not a string: the lede is the one place on a case page where
     a clause carries the argument, and `.mark` needs an element to sit on */
  lede?: React.ReactNode;
  items: [Item, Item, Item];
  meta?: Meta[];
}) {
  return (
    <RevealSection className={`section-shell ${styles.block}`}>
      <div className={styles.head}>
        <p className={`mono-label ${styles.eyebrow}`}>{eyebrow}</p>
        <div>
          <h2 className={`serif-display ${styles.heading}`}>{heading}</h2>
          {lede && <p className={styles.lede}>{lede}</p>}
        </div>
      </div>

      {/* role drives the accent, and the order is the argument:
          pain → solution → impact */}
      <div className={styles.cols}>
        {items.map((it, i) => (
          <div
            key={it.label}
            className={styles.col}
            data-role={["pain", "solution", "impact"][i]}
          >
            <p className={`mono-label ${styles.label}`}>{it.label}</p>
            {it.value && <p className={styles.value}>{it.value}</p>}
            <p className={styles.body}>{it.body}</p>
          </div>
        ))}
      </div>

      {/* who did it, said plainly. A definition list because that is what
          this is — labelled facts about the engagement, not argument. It
          shares the three-column tracks above so Role lands under Pain. */}
      {meta && meta.length > 0 && (
        <dl className={styles.meta}>
          {meta.map((m) => (
            <div key={m.label} className={styles.metaItem}>
              <dt className={`mono-label ${styles.label}`}>{m.label}</dt>
              <dd className={styles.metaBody}>
                {m.body}
                {m.lines && (
                  <ul className={styles.metaLines}>
                    {m.lines.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                )}
                {m.tags && (
                  <p className={`mono-label ${styles.metaTags}`}>
                    {m.tags.map((t, i) => (
                      <Fragment key={t}>
                        {i > 0 && " · "}
                        {t}
                      </Fragment>
                    ))}
                  </p>
                )}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </RevealSection>
  );
}
