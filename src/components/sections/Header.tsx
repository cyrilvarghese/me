import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
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
