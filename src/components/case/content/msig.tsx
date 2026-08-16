import CaseSection from "@/components/case/CaseSection";
import CaseGallery from "@/components/case/CaseGallery";
import CaseStats from "@/components/case/CaseStats";
import { cases } from "@/lib/data/cases";

const ops = cases.find((c) => c.slug === "msig")!;

const SCREENS = [
  "3zVXGHubwsDkSoRejI1kNsYWI.webp",
  "6YxTcGaZtqhVPfIRfuA2QpbjW8.avif",
  "6aFnlZQqdKNvKKZwx1GtpCi4m1w.webp",
  "FZH5qRxSvJSwBEKVMgkv5TzbYU.webp",
  "Rqpyj1Ih5zkdEhilndGmKU7f8I.avif",
  "a5rRn65DtRvHwOYL9MfA5fQT7I.webp",
  "e5nkT3tdjowEU0ttZEsvoSrxCLM.webp",
  "kn8Lr14RDdSdVfrbqqPrvPtW8M.avif",
  "nHwgrwHqa2DjUR57calWQgQG8.webp",
  "vyjEy11RDmS1QDnXv4S9TlqDs.webp",
].map((f) => ({
  src: `/assets/MSIG/${f}`,
  alt: "Interface screen from the internal product suite",
  caption: "Mock",
}));

export default function MsigContent() {
  return (
    <>
      <CaseSection eyebrow="Started with" mock>
        <p>
          Quoting, dispatch and scheduling lived in spreadsheets, phone
          calls and institutional memory — every handoff a place for the
          operation to slow down or drop something.
        </p>
      </CaseSection>
      <CaseSection eyebrow="Built" heading="The unglamorous software that moves a business." mock>
        <p>
          A suite of internal products covering quoting, dispatch,
          scheduling and reporting — one system per bottleneck, shipped in
          the order the operation felt them.
        </p>
      </CaseSection>
      <CaseSection eyebrow="Outcomes">
        <CaseStats stats={ops.results ?? []} />
      </CaseSection>
      <CaseSection eyebrow="Selected screens" mock>
        <CaseGallery images={SCREENS} columns={2} />
      </CaseSection>
    </>
  );
}
