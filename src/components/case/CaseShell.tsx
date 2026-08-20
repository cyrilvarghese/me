import Link from "next/link";
import { ViewTransition } from "react";
import type { CaseStudy } from "@/lib/data/cases";
import CaseBack from "./CaseBack";
import CaseVisual from "./CaseVisual";
import styles from "./CaseShell.module.css";

/** Shared detail template: the morph-target hero (the card's visual,
    now the whole viewport), free per-case sections, closing CTA.
    default="none" MUST keep its explicit share="morph" — dropping share
    silently kills the pair (Next view-transitions guide). */
export default function CaseShell({
  caseStudy,
  children,
}: {
  caseStudy: CaseStudy;
  children: React.ReactNode;
}) {
  return (
    <>
      <CaseBack slug={caseStudy.slug} />
      <div className={styles.hero}>
        <ViewTransition name={`case-visual-${caseStudy.slug}`} share="morph" default="none">
          <div className={styles.heroVisual} data-case-visual={caseStudy.slug}>
            <CaseVisual cover={caseStudy.cover} className={styles.fill} />
          </div>
        </ViewTransition>
        <div className={styles.scrimTop} aria-hidden="true" />
        <div className={styles.scrim} aria-hidden="true" />
        <div className={styles.heroText}>
          <div className={`section-shell ${styles.heroInner}`}>
            <p className={`mono-label ${styles.kicker}`}>
              {caseStudy.num} / {caseStudy.category}
            </p>
            <h1 className={`serif-display ${styles.headline}`}>{caseStudy.headline}</h1>
          </div>
        </div>
      </div>

      {children}

      <section className={`section-shell ${styles.cta}`}>
        <p className={`serif-display ${styles.ctaLine}`}>
          Have a problem that doesn't fit a job title?
        </p>
        <a href="mailto:cyrilpdev@gmail.com" className="mono-label btn">
          Start a conversation
        </a>
        <Link href="/#work" className={`mono-label btn btn-ghost ${styles.backLink}`}>
          ← All work
        </Link>
      </section>
    </>
  );
}
