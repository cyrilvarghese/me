import styles from "./Header.module.css";
import SiteNav from "./SiteNav";

/** Home-page chrome. Case pages are takeovers and render no header, so
    the nav is plain hash anchors and SmoothAnchors owns the glide.
    The header itself stays a server component; only the nav, which has
    to know where the reader is, runs on the client. */
export default function Header() {
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
        <a href="#top" className={`mono-label ${styles.brand}`}>
          CV
        </a>
        <SiteNav />
      </div>
    </header>
  );
}
