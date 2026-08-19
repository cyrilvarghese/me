import type { CSSProperties } from "react";
import CaseVisual from "./CaseVisual";
import styles from "./CaseShowcase.module.css";

type Shot = { src: string; caption: string };

/** Closing evidence: the screens, then the demo.

    Shots come in rows rather than one flat list, and each row sizes its
    grid to its own count. A single grid with a fixed column count strands
    the remainder — five shots in three columns leaves a dead cell — and
    the rows are meaningful anyway: the image pipeline, then the video one.

    The video slot renders a real <video> when `video` is given and a
    waiting frame otherwise. */
export default function CaseShowcase({
  eyebrow,
  rows,
  video,
  poster,
  videoCaption,
}: {
  eyebrow: string;
  rows: Shot[][];
  video?: string;
  poster?: string;
  videoCaption: string;
}) {
  return (
    <section className={`section-shell ${styles.section}`}>
      <p className={`mono-label ${styles.eyebrow}`}>{eyebrow}</p>

      {rows.map((row, i) => (
        <div
          key={row.map((s) => s.src).join()}
          className={styles.grid}
          style={{ "--cols": row.length } as CSSProperties}
          data-row={i}
        >
          {row.map((s) => (
            <figure key={s.src} className={styles.shot}>
              <CaseVisual cover={s.src} className={styles.frame} />
              <figcaption className={`mono-label ${styles.caption}`}>{s.caption}</figcaption>
            </figure>
          ))}
        </div>
      ))}

      <figure className={styles.demo}>
        {video ? (
          <video
            className={styles.player}
            src={video}
            poster={poster}
            controls
            playsInline
            preload="metadata"
          />
        ) : (
          <div className={styles.waiting} aria-label="Demo video — in production">
            <span className={styles.play} aria-hidden="true" />
            <span className={`mono-label ${styles.waitingLabel}`}>Demo — in production</span>
          </div>
        )}
        <figcaption className={`mono-label ${styles.caption}`}>{videoCaption}</figcaption>
      </figure>
    </section>
  );
}
