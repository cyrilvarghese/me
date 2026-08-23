import CopyEmail from "@/components/CopyEmail";
import { CV_URL, LINKEDIN_URL } from "@/lib/data/contact";
import styles from "./ContactActions.module.css";

/**
 * The site's closing ask, identical on every page — the About page's
 * arrangement, lifted out so the home page and the case studies wear it
 * too (Cyril, 2026-08-23).
 *
 * Three weights, not three boxes: the email keeps the accent border
 * because it is the one thing the section is for, and the two outbound
 * references sit beside it in the link voice. Both leave the site, so
 * both open in their own tab.
 */
export default function ContactActions() {
  return (
    <div className={styles.main}>
      <CopyEmail />
      <div className={styles.refs}>
        <a
          className={`mono-label link-mark ${styles.ref}`}
          href={CV_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FileTextMark />
          <span className="link-label">View CV</span>
        </a>
        <a
          className={`mono-label link-mark ${styles.ref}`}
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedInMark />
          <span className="link-label">LinkedIn</span>
        </a>
      </div>
    </div>
  );
}

/* Lucide's file-text and linkedin, geometry inlined rather than pulled in
   as a dependency for two glyphs on a static export. Both keep Lucide's
   own grid and stroke (24 units, 2 wide, round) so they stay a set, and
   the stroke lands near the 1px hairline they sit beside. */
function FileTextMark() {
  return (
    <svg className={styles.mark} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}

function LinkedInMark() {
  return (
    <svg className={styles.mark} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
