import CaseVisual from "./CaseVisual";
import styles from "./CaseGallery.module.css";

/** Framed screenshot grid. Files are distinct images (the MSIG export
    mixes webp and avif) — CaseVisual renders each as a plain covered
    <img>; captions carry the meaning. */
export default function CaseGallery({
  images,
  columns = 2,
}: {
  images: { src: string; alt: string; caption?: string }[];
  columns?: 1 | 2;
}) {
  return (
    <div className={`${styles.gallery} ${columns === 2 ? styles.cols2 : ""}`}>
      {images.map((img) => (
        <figure key={img.src} className={styles.item}>
          <CaseVisual cover={img.src} className={styles.frame} />
          {img.caption && (
            <figcaption className={`mono-label ${styles.caption}`}>{img.caption}</figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
