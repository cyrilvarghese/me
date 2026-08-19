import type { Metadata } from "next";
import Footer from "@/components/sections/Footer";
import CaseShell from "@/components/case/CaseShell";
import CreativeOsV2Content from "@/components/case/content/creative-os-v2";
import { cases } from "@/lib/data/cases";

/* A comparison route, not a second case study: the same shell and the
   same content, on the alternative spine, so the two layouts can be
   judged against each other in the browser. Not linked from anywhere —
   /work/creative-os stays the live page. */
export const metadata: Metadata = {
  title: "CreativeOS — layout study",
  robots: { index: false, follow: false },
};

export default function CreativeOsLabPage() {
  const c = cases.find((x) => x.slug === "creative-os")!;
  return (
    <>
      <main>
        <CaseShell caseStudy={c}>
          <CreativeOsV2Content />
        </CaseShell>
      </main>
      <Footer />
    </>
  );
}
