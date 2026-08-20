import Link from "next/link";
import { ViewTransition } from "react";
import type { CaseStudy } from "@/lib/data/cases";
import CopyEmail from "@/components/CopyEmail";
import CaseBack from "./CaseBack";
import CaseVisual from "./CaseVisual";
import { RevealDiv, RevealSection } from "./Reveal";
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
          {/* Safe to fade even though this hero is a morph target: the
              ViewTransition above wraps the cover image only, so the title
              is not part of the morph. It reads as the text settling once
              the picture has landed. */}
          <RevealDiv className={`section-shell ${styles.heroInner}`}>
            <p className={`mono-label ${styles.kicker}`}>
              {caseStudy.num} / {caseStudy.category}
            </p>
            <h1 className={`serif-display ${styles.headline}`}>{caseStudy.headline}</h1>
          </RevealDiv>
        </div>
      </div>

      {children}

      <RevealSection className={`section-shell ${styles.cta}`}>
        <p className={`serif-display ${styles.ctaLine}`}>
          Have a problem that needs more than one perspective?
        </p>
        <CopyEmail />
        <Link href="/#work" className={`mono-label btn btn-ghost ${styles.backLink}`}>
          ← All work
        </Link>
      </RevealSection>
    </>
  );
}
