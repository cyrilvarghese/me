import CaseDiagram from "./CaseDiagram";
import styles from "./CaseCompare.module.css";

type Panel = {
  title: string;
  diagram: string;
  stat?: { value: string; label: string };
  caption: string;
};

/** One pain point, full width: the claim, then the same story told twice —
    how it goes today, and how it goes on the system. The diagrams are
    standalone animated SVGs (public/assets/.../diagrams), so the page
    markup stays small and the motion runs without any JS. */
export default function CaseCompare({
  index,
  eyebrow,
  heading,
  lede,
  today,
  after,
}: {
  index: string;
  eyebrow: string;
  heading: string;
  lede: string;
  today: Panel;
  after: Panel;
}) {
  return (
    <section className={`section-shell ${styles.block}`}>
      <div className={styles.head}>
        <p className={`mono-label ${styles.index}`}>{index}</p>
        <div>
          <p className={`mono-label ${styles.eyebrow}`}>{eyebrow}</p>
          <h2 className={`serif-display ${styles.heading}`}>{heading}</h2>
          <p className={styles.lede}>{lede}</p>
        </div>
      </div>

      <div className={styles.pair}>
        {[today, after].map((p, i) => (
          <figure key={p.title} className={styles.panel} data-side={i === 0 ? "today" : "after"}>
            <figcaption className={`mono-label ${styles.panelTitle}`}>
              <span className={styles.dot} aria-hidden="true" />
              {p.title}
            </figcaption>
            <div className={styles.drawing}>
              <CaseDiagram src={p.diagram} />
            </div>
            {/* the stat slot always renders: the two panels share subgrid
                rows, so a missing element here would pull the caption up
                into the stat band and break the alignment */}
            <p className={styles.stat}>
              {p.stat && (
                <>
                  <span className={styles.statValue}>{p.stat.value}</span>
                  <span className={`mono-label ${styles.statLabel}`}>{p.stat.label}</span>
                </>
              )}
            </p>
            <p className={styles.caption}>{p.caption}</p>
          </figure>
        ))}
      </div>
    </section>
  );
}
