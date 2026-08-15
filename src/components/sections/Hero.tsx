import KnifeCanvas from "@/components/knife/KnifeCanvas";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} id="top">
      <div className={`section-shell ${styles.inner}`}>
        <p className={`mono-label ${styles.eyebrow}`}>Product Builder · Designer · Engineer</p>
        <h1 className={`serif-display ${styles.headline}`}>
          Give me the outcome.
          <br />
          I&apos;ll figure out the rest.
        </h1>
        <p className={styles.desc}>
          I work across product, design, engineering and AI to turn ambiguous problems into shipped
          systems.
        </p>
        <a href="#work" className={`mono-label ${styles.cue}`}>
          See how{" "}
          <span className={styles.arrow} aria-hidden="true">
            ↓
          </span>
        </a>
      </div>
      <div className={styles.knifePeek} data-hero-knife="" aria-hidden="true">
        <KnifeCanvas reducedPose="closed" />
      </div>
    </section>
  );
}
