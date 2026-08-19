import styles from "./CaseVisual.module.css";

/** Framed case visual: cover image when the asset exists, the
    in-production caption otherwise. Decorative — meaning lives in the
    surrounding link/heading. */
export default function CaseVisual({
  cover,
  className,
}: {
  cover?: string;
  className?: string;
}) {
  return (
    <div className={`${styles.frame} ${className ?? ""}`} aria-hidden="true">
      {cover ? (
        <img src={cover} alt="" className={styles.img} />
      ) : (
        <p className={`mono-label ${styles.caption}`}>Interface visual — in production</p>
      )}
    </div>
  );
}
