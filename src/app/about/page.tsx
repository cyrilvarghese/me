import type { Metadata } from "next";
import Link from "next/link";
import { chapters, sparetime } from "@/lib/data/about-story";
import { CV_URL, LINKEDIN_URL } from "@/lib/data/contact";
import { RevealDiv } from "@/components/case/Reveal";
import Cluster from "@/components/about/Cluster";
import CopyEmail from "@/components/CopyEmail";
import RoomLight from "@/components/about/RoomLight";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About — Cyril Philip Varghese",
  description:
    "The long version: drawing, a sabbatical, VR, product design, and the products that came out of it.",
};

/**
 * The long About. One spine down the middle: pictures on the left, the
 * chapter on the right, the way Cyril's own account of it reads.
 *
 * The head and the close are centred on that spine; the chapters are
 * not, because running text set centre is text nobody's eye can find
 * the start of. Symmetry belongs to the page, not to the paragraph.
 *
 * Motion is the site's reveal contract and nothing else. The chapter
 * fades up as it arrives; its pictures slide in behind it from the side
 * of the cluster they sit on (Cluster.tsx). Hidden states stay in
 * `.fx-hidden`, behind a prefers-reduced-motion query, so a reduced
 * reader gets the whole page with no tween to undo.
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
          {/* the drawing is also the way into the light room */}
          <RoomLight />
        </figure>
      </header>

      <ol className={`section-shell ${styles.chapters}`}>
        {chapters.map((c) => (
          <li key={c.num} className={styles.chapter}>
            <div className={styles.figureCol}>
              {c.gallery.link ? (
                /* the pictures lead somewhere: the whole cluster is the
                   link, and the label beneath says where */
                <a
                  href={c.gallery.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.figureLink}
                >
                  <Cluster
                    shots={c.gallery.shots}
                    ratio={c.gallery.ratio}
                    seed={c.gallery.seed}
                    kind={c.gallery.kind}
                    placed={c.gallery.cards}
                    surface={c.gallery.surface}
                  />
                  <span className={`mono-label ${styles.figureCaption}`}>
                    {c.gallery.link.label} →
                  </span>
                </a>
              ) : (
                <Cluster
                  shots={c.gallery.shots}
                  ratio={c.gallery.ratio}
                  seed={c.gallery.seed}
                  kind={c.gallery.kind}
                  placed={c.gallery.cards}
                  surface={c.gallery.surface}
                />
              )}
            </div>
            <RevealDiv className={styles.copy}>
              <p className={`mono-label ${styles.num}`}>{c.num}</p>
              <h2 className={`serif-display ${styles.label}${c.lift ? ` ${styles.labelLift}` : ""}`}>
                {c.label}
              </h2>
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
          <div className={styles.figureCol}>
            <Cluster
              shots={sparetime.gallery.shots}
              ratio={sparetime.gallery.ratio}
              seed={sparetime.gallery.seed}
              kind={sparetime.gallery.kind}
              placed={sparetime.gallery.cards}
              surface={sparetime.gallery.surface}
            />
          </div>
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
        {/* Three weights, not four boxes: the way back holds the left
            edge, the email keeps the accent border because it is the one
            thing this section is for, and the two outbound references
            drop to the chapter link voice so they stop competing with
            the ask. */}
        <div className={styles.ctas}>
          <Link className={`mono-label btn btn-ghost ${styles.ctaHome}`} href="/">
            ← Home
          </Link>
          <div className={styles.ctaMain}>
            <CopyEmail />
            <div className={styles.ctaRefs}>
              <a
                className={`mono-label ${styles.link} ${styles.endLink}`}
                href={CV_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileTextMark />
                <span className={styles.endLabel}>View CV</span>
              </a>
              <a
                className={`mono-label ${styles.link} ${styles.endLink}`}
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedInMark />
                <span className={styles.endLabel}>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </RevealDiv>
    </main>
  );
}

/* Lucide's file-text and linkedin, geometry inlined rather than pulled in
   as a dependency for two glyphs on a static export. Both keep Lucide's
   own grid and stroke (24 units, 2 wide, round) so they stay a set, and
   the stroke lands near the 1px hairline they sit beside. */
function FileTextMark() {
  return (
    <svg className={styles.linkMark} viewBox="0 0 24 24" aria-hidden="true">
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
    <svg className={styles.linkMark} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
