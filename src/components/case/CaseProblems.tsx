import CaseDiagram from "./CaseDiagram";
import styles from "./CaseProblems.module.css";

type Problem = { stat: string; label: string; diagram: string };

/** Every problem at once, in one glance: three small drawings side by
    side, each with the number it costs and the sentence it is.

    The comparison bands this replaces argued one pain at a time, told
    twice each — six drawings to reach the same three facts. A reader
    who only scans this row still leaves knowing what was wrong. */
export default function CaseProblems({
  eyebrow,
  heading,
  items,
}: {
  eyebrow: string;
  heading: string;
  items: [Problem, Problem, Problem];
}) {
  return (
    <section className={`section-shell ${styles.block}`}>
      <div className={styles.head}>
        <p className={`mono-label ${styles.eyebrow}`}>{eyebrow}</p>
        <h2 className={`serif-display ${styles.heading}`}>{heading}</h2>
      </div>

      <ul className={styles.row}>
        {items.map((p) => (
          <li key={p.label} className={styles.item}>
            <div className={styles.drawing}>
              <CaseDiagram src={p.diagram} />
            </div>
            <p className={styles.stat}>{p.stat}</p>
            <p className={styles.label}>{p.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
