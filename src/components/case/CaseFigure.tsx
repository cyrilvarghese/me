import CaseDiagram from "./CaseDiagram";
import { RevealDiv } from "./Reveal";
import styles from "./CaseFigure.module.css";

/** One diagram, full width, for a beat that has no counterpart to sit
    beside. CaseCompare is the right shape when the argument is "this,
    versus this"; when the drawing is the whole finding, pairing it with
    an empty panel would only imply a comparison that is not being made. */
export default function CaseFigure({
  eyebrow,
  heading,
  lede,
  diagram,
  diagramMobile,
  caption,
}: {
  eyebrow: string;
  heading?: string;
  lede?: string;
  diagram: string;
  /** The phone telling of the same drawing. Without one, a wide figure
      holds a floor width and scrolls sideways inside its own box; with
      one, the narrow layout simply replaces it. */
  diagramMobile?: string;
  caption?: string;
}) {
  return (
    <section className={`section-shell ${styles.block}`}>
      {/* head only — the drawing below runs its own staged fade (.cc-in) */}
      <RevealDiv className={styles.head}>
        <p className={`mono-label ${styles.eyebrow}`}>{eyebrow}</p>
        <div>
          {heading && <h2 className={`serif-display ${styles.heading}`}>{heading}</h2>}
          {lede && <p className={styles.lede}>{lede}</p>}
        </div>
      </RevealDiv>

      <figure className={styles.figure}>
        <div className={`${styles.drawing} ${diagramMobile ? styles.wideOnly : ""}`}>
          <CaseDiagram src={diagram} />
        </div>
        {diagramMobile && (
          <div className={styles.narrowOnly}>
            <CaseDiagram src={diagramMobile} />
          </div>
        )}
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
    </section>
  );
}
