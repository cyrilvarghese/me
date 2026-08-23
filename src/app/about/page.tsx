import type { Metadata } from "next";
import Link from "next/link";
import { chapters, sparetime } from "@/lib/data/about-story";
import { RevealDiv } from "@/components/case/Reveal";
import Cluster from "@/components/about/Cluster";
import ContactActions from "@/components/ContactActions";
import RoomLight, { FIRST_CHAPTER } from "@/components/about/RoomLight";
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
          window edge — same trick as CaseBack's dock. Not behind the
          door: the way out is there whether or not the reader has come
          in (Cyril, 2026-08-23). */}
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

      {/* everything from here down is behind the door: hidden while
          the room is shut, revealed as one run of viewport panels */}
      <ol className={`section-shell ${styles.chapters}`} data-after-threshold>
        {chapters.map((c, i) => (
          <li key={c.num} id={i === 0 ? FIRST_CHAPTER : undefined} className={styles.chapter}>
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

      <RevealDiv className={`section-shell ${styles.end}`} data-after-threshold>
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
          <ContactActions />
        </div>
      </RevealDiv>
    </main>
  );
}
