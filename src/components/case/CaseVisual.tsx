import styles from "./CaseVisual.module.css";

/** Framed case visual: cover image when the asset exists, the
    in-production caption otherwise. Decorative — meaning lives in the
    surrounding link/heading.

    `fit` is "cover" for the morph endpoints (card and hero), where a
    crop of a photograph is still the photograph. Gallery diagrams pass
    "contain": their labels sit hard against the top and bottom edges,
    so cropping deletes the thing they exist to show. */
export default function CaseVisual({
  cover,
  className,
  fit = "cover",
}: {
  cover?: string;
  className?: string;
  fit?: "cover" | "contain";
}) {
  return (
    <div className={`${styles.frame} ${className ?? ""}`} aria-hidden="true">
      {cover ? (
        <img
          src={cover}
          alt=""
          className={`${styles.img} ${fit === "contain" ? styles.contain : ""}`}
        />
      ) : (
        <p className={`mono-label ${styles.caption}`}>Interface visual — in production</p>
      )}
    </div>
  );
}
