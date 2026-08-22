import type { Metadata } from "next";
import Link from "next/link";
import { chapters, sparetime } from "@/lib/data/about-story";
import { CV_URL, LINKEDIN_URL } from "@/lib/data/contact";
import { RevealDiv } from "@/components/case/Reveal";
import CopyEmail from "@/components/CopyEmail";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About — Cyril Philip Varghese",
  description:
    "The long version: drawing, a sabbatical, VR, product design, and the products that came out of it.",
};

/** The picture beside a chapter. Until the file exists the frame is
    still drawn — at the exact ratio the picture will have — so dropping
    one in later moves nothing on the page and the layout is verified
    before the photographs arrive. */
function Figure({ image }: { image: (typeof chapters)[number]["image"] }) {
  const file = image.src.slice(image.src.lastIndexOf("/") + 1);
  return (
    <figure className={styles.figure} style={{ aspectRatio: image.ratio }}>
      {image.ready ? (
        <img src={image.src} alt={image.alt} className={styles.shot} />
      ) : (
        <span className={styles.slot} aria-hidden="true">
          <span className={`mono-label ${styles.slotName}`}>{file}</span>
          <span className={`mono-label ${styles.slotRatio}`}>{image.ratio}</span>
        </span>
      )}
    </figure>
  );
}

/**
 * The long About. One spine down the middle: pictures on the left, the
 * chapter on the right, the way Cyril's own account of it reads.
 *
 * Motion is the site's one reveal contract and nothing else — each
 * chapter's copy fades up as it arrives, its picture a beat behind it,
 * once. The hidden state lives in `.fx-hidden` behind a
 * prefers-reduced-motion query, so a reduced-motion reader gets the
 * whole page visible with no tween to undo.
 */
export default function AboutPage() {
  return (
    <main className={styles.page}>
      {/* the way back, held at the top of the column rather than the
          window edge — same trick as CaseBack's dock */}
      <div className={styles.dock}>
        <div className={`section-shell ${styles.dockInner}`}>
          <Link href="/" className={`mono-label btn btn-ghost ${styles.back}`}>
            ← Home
          </Link>
        </div>
      </div>

      <header className={`section-shell ${styles.head}`}>
        <p className={`mono-label ${styles.eyebrow}`}>About</p>
        <h1 className={`serif-display ${styles.name}`}>Cyril Philip Varghese</h1>
        <figure className={styles.quote}>
          <blockquote className={styles.quoteLine}>
            To invent your own life&apos;s meaning is not easy, but it&apos;s still allowed,
            and I think you&apos;ll be happier for the trouble.
          </blockquote>
          <figcaption className={`mono-label ${styles.quoteWho}`}>Bill Watterson</figcaption>
        </figure>
      </header>

      <ol className={`section-shell ${styles.chapters}`}>
        {chapters.map((c) => (
          <li key={c.num} className={styles.chapter}>
            {/* the picture leads on the left, and follows the copy in by
                a beat: the reader reads the chapter, then looks at it */}
            <RevealDiv className={styles.figureCol} delay={0.12}>
              <Figure image={c.image} />
            </RevealDiv>
            <RevealDiv className={styles.copy}>
              <p className={`mono-label ${styles.num}`}>{c.num}</p>
              <h2 className={`serif-display ${styles.label}`}>{c.label}</h2>
              {c.body.map((p) => (
                <p key={p} className={styles.para}>
                  {p}
                </p>
              ))}
              {c.link &&
                (c.link.href.startsWith("/") ? (
                  <Link href={c.link.href} className={`mono-label ${styles.link}`}>
                    {c.link.label} →
                  </Link>
                ) : (
                  <a
                    href={c.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mono-label ${styles.link}`}
                  >
                    {c.link.label} →
                  </a>
                ))}
            </RevealDiv>
          </li>
        ))}

        {/* the last stop on the same spine, and the one that stops being
            a career */}
        <li className={`${styles.chapter} ${styles.last}`}>
          <RevealDiv className={styles.figureCol} delay={0.12}>
            <Figure image={sparetime.image} />
          </RevealDiv>
          <RevealDiv className={styles.copy}>
            <h2 className={`serif-display ${styles.label}`}>{sparetime.label}</h2>
            {sparetime.body.map((p) => (
              <p key={p} className={styles.para}>
                {p}
              </p>
            ))}
          </RevealDiv>
        </li>
      </ol>

      <RevealDiv className={`section-shell ${styles.end}`}>
        <p className={`serif-display ${styles.thanks}`}>Thanks for reading this far.</p>
        <div className={styles.ctas}>
          <CopyEmail />
          <a
            className="mono-label btn btn-ghost"
            href={CV_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            View CV
          </a>
          <a
            className="mono-label btn btn-ghost"
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <Link className="mono-label btn btn-ghost" href="/">
            ← Home
          </Link>
        </div>
      </RevealDiv>
    </main>
  );
}
