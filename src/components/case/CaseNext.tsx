import Link from "next/link";
import { nextCase } from "@/lib/data/cases";
import { RevealSection } from "./Reveal";
import styles from "./CaseNext.module.css";

/**
 * How a case study ends: the way back on the left, the next one on the
 * right, and nothing else.
 *
 * What stood here was a "have a problem that needs more than one
 * perspective?" line over the contact controls — the same closing ask
 * the home page and /about already make, in the shape every portfolio
 * makes it (Cyril, 2026-08-26). A reader who has just finished one case
 * is not deciding whether to hire anyone; they are deciding whether to
 * read another. This offers them that, and the site footer is dropped
 * from the route so the offer is the last thing on the page.
 *
 * The next case is named by its headline rather than a project name,
 * because a headline is the one sentence the case already has that says
 * what it is about. It wraps to two lines and is meant to.
 */
export default function CaseNext({ slug }: { slug: string }) {
  const next = nextCase(slug);
  if (!next) return null;

  return (
    <RevealSection className={`section-shell ${styles.close}`}>
      <nav className={styles.row} aria-label="More case studies">
        <Link href="/#work" className={`mono-label ${styles.all}`}>
          <span aria-hidden="true">←&nbsp;</span>All case studies
        </Link>
        <Link href={`/work/${next.slug}`} className={styles.next}>
          <span className={`mono-label ${styles.eyebrow}`}>Next case study</span>
          <span className={`serif-display ${styles.headline}`}>
            {next.headline}
            <span className={styles.arrow} aria-hidden="true">&nbsp;→</span>
          </span>
        </Link>
      </nav>
    </RevealSection>
  );
}
