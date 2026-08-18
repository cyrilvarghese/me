import Link from "next/link";
import styles from "./Header.module.css";

/** sub: rendered on a sub-page — brand and nav become real route links
    back to the home sections (there is no #work element off the home
    page). Home keeps plain hash anchors so SmoothAnchors owns the glide. */
export default function Header({ sub }: { sub?: boolean }) {
  return (
    <header className={styles.header} style={{ viewTransitionName: "site-header" }}>
      {/* inline veil: Cyril's browser only honors backdrop-filter set
          inline on a plain element inside the fixed header — stylesheet
          rules on the header itself (and its ::before) silently no-op */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: -1,
          background: "color-mix(in srgb, var(--bg) 78%, transparent)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      />
      <div className={`section-shell ${styles.inner}`}>
        {sub ? (
          <Link href="/" className={styles.brand} aria-label="Home">
            <img src="/logo.png" alt="" className={styles.brandImg} />
          </Link>
        ) : (
          <a href="#top" className={styles.brand} aria-label="Home">
            <img src="/logo.png" alt="" className={styles.brandImg} />
          </a>
        )}
        <nav className={styles.nav} aria-label="Site">
          {(
            [
              ["Work", "#work"],
              ["About", "#about"],
              ["Contact", "#contact"],
            ] as const
          ).map(([label, hash]) =>
            sub ? (
              <Link key={hash} href={`/${hash}`} className="mono-label">
                {label}
              </Link>
            ) : (
              <a key={hash} href={hash} className="mono-label">
                {label}
              </a>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
