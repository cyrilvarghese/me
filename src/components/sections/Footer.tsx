import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`section-shell ${styles.inner}`}>
        <p className={`mono-label ${styles.brand}`}>
          <em>CV</em> · Cyril Varghese · 2026
        </p>
        <a href="mailto:cyrilpdev@gmail.com" className={`mono-label ${styles.mail}`}>
          cyrilpdev@gmail.com
        </a>
      </div>
    </footer>
  );
}
