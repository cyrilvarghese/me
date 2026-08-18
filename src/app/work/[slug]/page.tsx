import type { Metadata } from "next";
import Footer from "@/components/sections/Footer";
import CaseShell from "@/components/case/CaseShell";
import { caseContent } from "@/components/case/content";
import { cases } from "@/lib/data/cases";

/* Static export: every slug is pre-rendered; anything else 404s. */
export const dynamicParams = false;

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const c = cases.find((x) => x.slug === slug)!;
  return {
    title: `${c.headline} — Cyril Varghese`,
    description: c.built,
    openGraph: c.cover ? { images: [c.cover] } : undefined,
  };
}

export default async function CaseStudyPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const c = cases.find((x) => x.slug === slug)!;
  const Content = caseContent[slug];
  /* No site header here: the case study is a takeover — the hero owns the
     whole viewport rather than sliding under a bar. The close control,
     the hero's "← Work" link and the closing CTA carry navigation. */
  return (
    <>
      <main>
        <CaseShell caseStudy={c}>{Content ? <Content /> : null}</CaseShell>
      </main>
      <Footer />
    </>
  );
}
