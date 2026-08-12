import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`section-shell ${styles.inner}`}>
        <p className={`mono-label ${styles.brand}`}>
          <em>CV</em> · Cyril Varghese · 2026
        </p>
        <a href="mailto:cyril@yuvabe.com" className={`mono-label ${styles.mail}`}>
          cyril@yuvabe.com
        </a>
      </div>
    </footer>
  );
}
