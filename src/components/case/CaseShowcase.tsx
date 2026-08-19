import CaseVisual from "./CaseVisual";
import styles from "./CaseShowcase.module.css";

type Shot = { src: string; caption: string };

/** Closing evidence: the screens and the demo, laid out as one bento.

    Shots are a flat list because position lives in the stylesheet, not in
    the data — the grid names five areas (a…e) and hands them out in source
    order, so reading order, DOM order and visual order are the same thing.
    Five is the shape the areas describe; anything past that auto-places
    into implicit rows rather than breaking the layout.

    Only the demo carries an aspect ratio. It spans the two 1fr rows, so
    grid splits its height between them and the left-hand tiles take their
    size from the demo instead of from hand-tuned ratios.

    The video slot renders a real <video> when `video` is given and a
    waiting frame otherwise. */
export default function CaseShowcase({
  eyebrow,
  shots,
  video,
  poster,
  videoCaption,
}: {
  eyebrow: string;
  shots: Shot[];
  video?: string;
  poster?: string;
  videoCaption: string;
}) {
  return (
    <section className={`section-shell ${styles.section}`}>
      <p className={`mono-label ${styles.eyebrow}`}>{eyebrow}</p>

      <div className={styles.bento}>
        {shots.map((s) => (
          <figure key={s.src} className={styles.cell}>
            <CaseVisual cover={s.src} className={styles.frame} />
            <figcaption className={`mono-label ${styles.caption}`}>{s.caption}</figcaption>
          </figure>
        ))}

        <figure className={`${styles.cell} ${styles.demo}`}>
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
      </div>
    </section>
  );
}
