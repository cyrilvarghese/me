import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
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
        <nav className={styles.nav} aria-label="Site">
          <a href="#work" className="mono-label">
            Work
          </a>
          <a href="#about" className="mono-label">
            About
          </a>
          <a href="#contact" className="mono-label">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
