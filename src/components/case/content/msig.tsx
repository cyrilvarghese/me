import CaseSection from "@/components/case/CaseSection";
import CaseQuote from "@/components/case/CaseQuote";
import CaseGallery from "@/components/case/CaseGallery";
import CaseStats from "@/components/case/CaseStats";
import { cases } from "@/lib/data/cases";

const msig = cases.find((c) => c.slug === "msig")!;

/* Every caption below compresses the caption the source published for
   that asset. The dashboard is the one exception — it shipped without a
   caption, so its line only describes what is visible on screen.
   Ordered as the work ran: diagnose both journeys, explore layouts,
   settle the block system, then the product it produced. */
const SCREENS = [
  {
    file: "6YxTcGaZtqhVPfIRfuA2QpbjW8.avif",
    alt: "Effort curve for selling a new policy, annotated with agent quotes",
    caption: "Effort curve and pain points when selling a new policy",
    wide: true,
  },
  {
    file: "vyjEy11RDmS1QDnXv4S9TlqDs.webp",
    alt: "Effort curve for renewing a policy, annotated with agent quotes",
    caption: "Effort curve and pain points when renewing a policy",
    wide: true,
  },
  {
    file: "kn8Lr14RDdSdVfrbqqPrvPtW8M.avif",
    alt: "Hand-drawn sketches of three mobile screens",
    caption: "Early mobile sketches exploring flow and grouping",
  },
  {
    file: "e5nkT3tdjowEU0ttZEsvoSrxCLM.webp",
    alt: "Hand-drawn sketches of four desktop layout options",
    caption: "Design exploration of possible desktop layouts",
  },
  {
    file: "3zVXGHubwsDkSoRejI1kNsYWI.webp",
    alt: "Diagram of the stepper, form data entry block and details sidebar",
    caption: "Core UI blocks defining stepper, form, and sidebar",
  },
  {
    file: "FZH5qRxSvJSwBEKVMgkv5TzbYU.webp",
    alt: "The same three blocks rearranged into a narrow mobile column",
    caption: "Responsive layout adapting the blocks for mobile",
  },
  {
    file: "Rqpyj1Ih5zkdEhilndGmKU7f8I.avif",
    alt: "Agent dashboard showing gross written premium, renewals, payments and claims",
    caption: "Agent dashboard — gross written premium against target, renewals, payments, claims",
  },
  {
    file: "nHwgrwHqa2DjUR57calWQgQG8.webp",
    alt: "Work queue table with status chips and inline row actions",
    caption: "Clear statuses and inline actions improved visibility across policies",
  },
  {
    file: "6aFnlZQqdKNvKKZwx1GtpCi4m1w.webp",
    alt: "Indicative quote panel drilling down over the work queue",
    caption: "Drill-down panel: grouped layouts and familiar terms made dense data easy to scan",
  },
  {
    file: "a5rRn65DtRvHwOYL9MfA5fQT7I.webp",
    alt: "Quotation details form with fields grouped under vehicle details",
    caption: "Forms reorganized into logical, context-based groups — fewer errors, faster entry",
  },
].map(({ file, ...rest }) => ({ src: `/assets/MSIG/${file}`, ...rest }));

export default function MsigContent() {
  return (
    <>
      <CaseSection eyebrow="Problem" heading="Deeply ingrained, and badly dated.">
        <p>
          MSIG&apos;s legacy agent portal carried inefficient workflows, poor
          usability and no mobile support. Agents faced tedious data entry,
          unclear interactions, and difficulty closing deals in the field.
        </p>
        <p>
          The portal was deeply ingrained in their daily workflow, so the
          stakes were high. Success depended on understanding the mental model
          agents already had — then holding the complexity at the backend so
          the front could stay simple.
        </p>
      </CaseSection>

      <CaseQuote
        quote="This was more than a redesign, it was rebuilding a 20-year-old system that shaped how agents worked every day. We had to honor that legacy while creating an experience ready for the next generation"
        name="Prem Furtado"
        title="Senior Product Manager, Azentio (for MSIG)"
      />

      {/* Each bullet is an agent quote or pain label from the two effort-curve
          diagrams, compressed — not a characterisation of them. */}
      <CaseSection eyebrow="Pain points">
        <ul>
          <li>Filling a quote took twenty minutes or more.</li>
          <li>Statuses were unclear, so agents called underwriting to check a submission went through.</li>
          <li>Renewals ran on manual tracking — forget the check and the policy lapses.</li>
          <li>Payments were followed up by hand; chasing them took longer than selling the policy.</li>
          <li>No upselling guidance, so agents renewed last year&apos;s cover.</li>
          <li>Nothing worked on mobile, so deals were hard to close in the field.</li>
        </ul>
      </CaseSection>

      <CaseSection eyebrow="Solutions" heading="Blocks, not screens.">
        <p>
          At its core the product was a multi-step data entry application:
          every task moved agents through complex forms and validations. We
          treated the interface as a system built from modular blocks — for
          navigation, data entry and context — which made the multi-step flow
          scalable and responsive across screens.
        </p>
        <p>
          Form fields were grouped logically, wizards autosave, and drill-downs
          used familiar terms so dense data stayed scannable. Renewals,
          payments and gross written premium are tracked automatically, so
          agents miss neither a follow-up nor a target.
        </p>
      </CaseSection>

      <CaseSection eyebrow="Outcomes">
        <CaseStats stats={msig.results ?? []} />
      </CaseSection>

      <CaseSection eyebrow="Selected screens" wide>
        <CaseGallery images={SCREENS} columns={2} />
      </CaseSection>
    </>
  );
}
