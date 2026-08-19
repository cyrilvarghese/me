import CaseVisual from "./CaseVisual";
import styles from "./CaseGallery.module.css";

export type CaseImage = {
  src: string;
  alt: string;
  caption?: string;
  /** Span the full grid width. For annotated diagrams whose labels are
      unreadable at half width — a two-up grid is the default, not a rule. */
  wide?: boolean;
};

/** Framed screenshot grid. Files are distinct images (the MSIG export
    mixes webp and avif) — CaseVisual renders each contained inside a
    fixed frame, so a 1.4-ratio journey diagram and a near-square form
    capture can sit in the same grid without either losing its edges;
    captions carry the meaning. */
export default function CaseGallery({
  images,
  columns = 2,
}: {
  images: CaseImage[];
  columns?: 1 | 2;
}) {
  return (
    <div className={`${styles.gallery} ${columns === 2 ? styles.cols2 : ""}`}>
      {images.map((img) => (
        <figure key={img.src} className={`${styles.item} ${img.wide ? styles.wideItem : ""}`}>
          <CaseVisual
            cover={img.src}
            className={`${styles.frame} ${img.wide ? styles.wideFrame : ""}`}
            fit="contain"
          />
          {img.caption && (
            <figcaption className={`mono-label ${styles.caption}`}>{img.caption}</figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
