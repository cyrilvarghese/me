import CaseSection from "@/components/case/CaseSection";
import CaseQuote from "@/components/case/CaseQuote";
import CaseGallery from "@/components/case/CaseGallery";
import CaseStats from "@/components/case/CaseStats";
import { cases } from "@/lib/data/cases";

const msig = cases.find((c) => c.slug === "msig")!;

/* Ordered as the work ran: diagnose the two journeys, explore layouts,
   settle the system, then the product it produced. */
const SCREENS = [
  {
    file: "6YxTcGaZtqhVPfIRfuA2QpbjW8.avif",
    alt: "Effort curve for selling a new policy, annotated with agent quotes",
    caption: "Selling a new policy: where the effort spikes, and what agents said there",
    wide: true,
  },
  {
    file: "vyjEy11RDmS1QDnXv4S9TlqDs.webp",
    alt: "Effort curve for renewing a policy, annotated with agent quotes",
    caption: "Renewals: tracked by memory, stalled by documents, closed by phone call",
    wide: true,
  },
  {
    file: "kn8Lr14RDdSdVfrbqqPrvPtW8M.avif",
    alt: "Hand-drawn sketches of three mobile screens",
    caption: "Early mobile sketches — what a step looks like on a phone",
  },
  {
    file: "e5nkT3tdjowEU0ttZEsvoSrxCLM.webp",
    alt: "Hand-drawn sketches of four desktop layout options",
    caption: "Four ways to hold a long form on desktop, before picking one",
  },
  {
    file: "3zVXGHubwsDkSoRejI1kNsYWI.webp",
    alt: "Diagram of the stepper, form data entry block and details sidebar",
    caption: "The three blocks everything is built from: stepper, form, details sidebar",
  },
  {
    file: "FZH5qRxSvJSwBEKVMgkv5TzbYU.webp",
    alt: "The same three blocks rearranged into a narrow mobile column",
    caption: "The same blocks, restacked for a phone",
  },
  {
    file: "Rqpyj1Ih5zkdEhilndGmKU7f8I.avif",
    alt: "Agent dashboard showing gross written premium, renewals, payments and claims",
    caption: "The day in one view — premium against target, renewals due, payments outstanding",
  },
  {
    file: "nHwgrwHqa2DjUR57calWQgQG8.webp",
    alt: "Work queue table with status chips and inline row actions",
    caption: "Statuses that say where a submission stands, and act on it in the row",
  },
  {
    file: "6aFnlZQqdKNvKKZwx1GtpCi4m1w.webp",
    alt: "Indicative quote panel drilling down over the work queue",
    caption: "A drill-down that answers the question without losing the queue behind it",
  },
  {
    file: "a5rRn65DtRvHwOYL9MfA5fQT7I.webp",
    alt: "Quotation details form with fields grouped under vehicle details",
    caption: "Fields regrouped into the sets agents already think in",
  },
].map(({ file, ...rest }) => ({ src: `/assets/MSIG/${file}`, ...rest }));

export default function MsigContent() {
  return (
    <>
      <CaseSection eyebrow="Problem" heading="One portal, twenty years of workarounds.">
        <p>
          MSIG&apos;s agent portal had been in daily use long enough that its
          quirks had become procedure. Agents worked around forms that asked
          for everything at once, statuses that never said where a submission
          stood, and payments chased by phone. None of it survived the trip to
          a phone, which is where the selling happens.
        </p>
        <p>
          Replacing it was never the hard part. The portal was load-bearing in
          how agents worked, so anything unfamiliar would cost more than it
          saved.
        </p>
      </CaseSection>

      <CaseQuote
        quote="This was more than a redesign, it was rebuilding a 20-year-old system that shaped how agents worked every day. We had to honor that legacy while creating an experience ready for the next generation"
        name="Prem Furtado"
        title="Senior Product Manager, Azentio (for MSIG)"
      />

      <CaseSection eyebrow="Pain points">
        <ul>
          <li>Filling a single quote took twenty minutes of undifferentiated form.</li>
          <li>Renewals ran on memory — miss the check and the policy lapses.</li>
          <li>Statuses were opaque, so agents phoned underwriting to find out.</li>
          <li>Payments were chased by hand, long after the selling was done.</li>
          <li>No upsell cues, so agents renewed whatever was already there.</li>
        </ul>
      </CaseSection>

      <CaseSection eyebrow="Solutions" heading="Blocks, not screens.">
        <p>
          Underneath, the product is multi-step data entry. We built it as one:
          a stepper, a form block and a details sidebar that recombine per task
          and restack onto a phone. Fields regrouped into the sets agents
          already think in, wizards that autosave, drill-downs that use the
          words printed on the policy.
        </p>
        <p>
          Renewals, payments and gross written premium track themselves, so the
          follow-up finds the agent rather than the other way round.
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
