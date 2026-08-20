import { capabilities } from "@/lib/data/capabilities";
import KnifeLayer from "@/components/knife/KnifeLayer";
import knife from "@/components/knife/knife.module.css";
import styles from "./ToolList.module.css";

/**
 * The mobile view of the six tools. The desktop lineup is a scrubbed beat
 * inside OutcomeTransition and has never existed on phones — its years and
 * one-line histories simply went unseen.
 *
 * This was a swipe carousel first. It cost too much to operate for what it
 * showed: a gesture per tool, and five of the six hidden at any moment. Six
 * rows show everything at once and need no script at all.
 *
 * It used to close on a compass and "Tools matter. / Outcomes matter more."
 * On desktop that pair is the payoff of a scrubbed sequence — the needle
 * hunts and finds north as the line lands. None of that runs on a phone, so
 * what arrived here was a still compass under a claim it had not earned
 * (Cyril's call, 2026-08-21). The rows end the section instead.
 */
export default function ToolList() {
  return (
    <section className={styles.section} aria-label="The six tools">
      <p className={`serif-display ${styles.heading}`}>
        One problem, many parts — a tool for each.
      </p>

      <ul className={styles.list}>
        {capabilities.map((c) => (
          <li key={c.id} className={styles.row}>
            <div className={styles.art} aria-hidden="true">
              {/* Rotating about the shared hinge leaves the standing tool in a
                  narrow strip up the middle of the canvas — roughly 40% of its
                  height. .artScale blows that strip up to fill the cell. */}
              <div className={styles.artScale}>
                <div className={knife.canvas}>
                  {/* closed tools point left, so +90° stands one upright — the
                      same pose the desktop lineup puts them in */}
                  <div className={knife.tool} style={{ transform: "rotate(90deg)" }}>
                    <KnifeLayer id={c.id} />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.body}>
              <p className={styles.head}>
                <span className={`mono-label ${styles.label}`}>{c.label}</span>
                <span className={`mono-label ${styles.years}`}>{c.duration}</span>
              </p>
              <p className={`mono-label ${styles.period}`}>{c.years}</p>
              <p className={styles.line}>
                {c.line.split("\n").map((fact, fi, facts) => (
                  <span
                    key={fact}
                    className={`${styles.fact} ${
                      facts.length > 1 && fi === facts.length - 1 ? styles.factNow : ""
                    }`}
                  >
                    {fact}
                  </span>
                ))}
              </p>
            </div>
          </li>
        ))}
      </ul>

    </section>
  );
}
