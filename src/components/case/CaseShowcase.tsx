import CaseVisual from "./CaseVisual";
import styles from "./CaseShowcase.module.css";

type Shot = { src: string; caption: string };

/** Closing evidence: the screens, then the demo. The video slot renders
    a real <video> when `video` is given and a waiting frame otherwise —
    the layout is identical either way, so dropping the file in later
    changes nothing else. */
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

      <div className={styles.grid}>
        {shots.map((s) => (
          <figure key={s.src} className={styles.shot}>
            <CaseVisual cover={s.src} className={styles.frame} />
            <figcaption className={`mono-label ${styles.caption}`}>{s.caption}</figcaption>
          </figure>
        ))}
      </div>

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
