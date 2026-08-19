import CaseSummary from "@/components/case/CaseSummary";
import CaseCompare from "@/components/case/CaseCompare";
import CaseImpact from "@/components/case/CaseImpact";
import CaseQuote from "@/components/case/CaseQuote";
import CaseShowcase from "@/components/case/CaseShowcase";
import CaseNav from "@/components/case/CaseTabs";

const D = "/assets/MSIG/diagrams";

/** Spine: context → three pain points, each argued by the same diagram
    told twice → the impact they add up to → the screens.

    Every claim here traces to cyrilvarghese.framer.website/projects/msig
    or to text drawn inside its two effort-curve diagrams — the agent
    quotes ("It takes 20+ minutes just to fill a quote", "If I forget to
    check, the policy just lapses") live in the artwork, not the copy. */
export default function MsigContent() {
  return (
    <>
      <CaseSummary
        eyebrow="Context"
        heading="Selling insurance through a twenty-year-old portal."
        lede="Every quote and every renewal went through it, and no agent could work around it — which is what made replacing it risky."
        items={[
          {
            label: "Pain",
            value: "20+ min",
            body:
              "To fill one quote. Statuses never said where a submission stood, renewals ran on memory, and none of it worked on mobile.",
          },
          {
            label: "Solution",
            body: (
              <>
                <em>One responsive design system</em> — stepper, form, details
                sidebar. Fields grouped by context, wizards that autosave, and
                renewals, payments and GWP tracked rather than remembered.
              </>
            ),
          },
          {
            label: "Impact",
            value: "~8 min",
            body:
              "Cut from every quote issued, with fewer errors from fields grouped by meaning.",
          },
        ]}
        meta={[
          { label: "Role", body: "Lead Product Designer." },
          { label: "Team", body: "Two product designers, twelve developers and one PM." },
        ]}
      />

      <CaseQuote
        quote="This was more than a redesign, it was rebuilding a 20-year-old system that shaped how agents worked every day. We had to honor that legacy while creating an experience ready for the next generation"
        name="Prem Furtado"
        role="Senior Product Manager, Azentio (for MSIG)"
      />

      <CaseNav
        label="Case study sections"
        sections={[
          {
            id: "pain-points",
            label: "Pain points",
            body: (
              <>
                <CaseCompare
                  index="01"
                  eyebrow="New policy creation: slow, manual, error-prone"
                  heading="Three spikes in every new sale."
                  lede="Mapping the journey put the effort in the same three places every time: twenty minutes of cluttered form at the quote, a submission whose status nobody could read, and a payment the agent had to chase. Each one is a place the sale can stall."
                  today={{
                    title: "Effort spikes at quote, submit and payment",
                    diagram: `${D}/01-today.svg`,
                    stat: { value: "20+ min", label: "to fill one quote" },
                    caption:
                      "Cluttered forms, unclear statuses and manual payment follow-ups — every new sale takes longer and risks the revenue.",
                  }}
                  after={{
                    title: "The same journey, each spike handled",
                    diagram: `${D}/01-msig.svg`,
                    stat: { value: "~8 min", label: "cut from issuance" },
                    caption:
                      "Fields grouped by context and autosaved, a legible status, and payment tracked rather than chased.",
                  }}
                />

                <CaseCompare
                  index="02"
                  eyebrow="Renewal journey: manual tracking and missed upsells"
                  heading="A renewal nobody is reminded about."
                  lede="A renewal should be the easy one. Instead it began with the agent remembering to look, stalled waiting on customer documents, and ended in a payment reminder they had to send — with no cue anywhere to offer more than last year's cover."
                  today={{
                    title: "The agent is the reminder",
                    diagram: `${D}/02-today.svg`,
                    stat: { value: "Lapsed", label: "when the check is missed" },
                    caption:
                      "Manual tracking and missing reminders turn a simple renewal into a drawn-out process — and valuable upsells are lost along the way.",
                  }}
                  after={{
                    title: "Renewals, payments and GWP tracked",
                    diagram: `${D}/02-msig.svg`,
                    caption:
                      "Tracked automatically, so the due date surfaces on its own and neither a follow-up nor a target depends on memory.",
                  }}
                />

                <CaseCompare
                  index="03"
                  eyebrow="Macro layouts for a scalable UI"
                  heading="Blocks, not screens."
                  lede="At its core the product was a multi-step data entry application, and every task moved agents through complex forms and validations. Treating the interface as a system built from modular blocks — navigation, data entry, context — is what let the same flow scale across screens instead of breaking at the edge of a desktop."
                  today={{
                    title: "Built for one screen width",
                    diagram: `${D}/03-today.svg`,
                    caption:
                      "No mobile support: in the field the job stalls until the agent is back at a desk.",
                  }}
                  after={{
                    title: "The same blocks, restacked",
                    diagram: `${D}/03-msig.svg`,
                    caption:
                      "Stepper, form and details sidebar reflow into one column — the same task, in the hand.",
                  }}
                />

                <CaseImpact
                  eyebrow="Impact"
                  value="~8 min"
                  detail="Cut from quote-issuance time"
                  note="A scalable, responsive design system with semantically grouped data entry reduced errors and improved efficiency."
                />
              </>
            ),
          },
          {
            id: "visual-assets",
            label: "Visual assets",
            body: (
              <CaseShowcase
                eyebrow="Inside the system"
                /* Source order is grid position: the day's overview first,
                   then the queue it drives, the drill-down that answers a
                   row, the form the whole thing exists to make bearable,
                   and the block anatomy underneath all of it.

                   No videoCaption: this shipped years ago and there is no
                   walkthrough, so the bento drops its demo block rather
                   than promising one. */
                shots={[
                  {
                    src: "/assets/MSIG/Rqpyj1Ih5zkdEhilndGmKU7f8I.avif",
                    caption: "Dashboard — premium against target, renewals, payments, claims",
                  },
                  {
                    src: "/assets/MSIG/nHwgrwHqa2DjUR57calWQgQG8.webp",
                    caption: "Work queue — clear statuses and inline actions",
                  },
                  {
                    src: "/assets/MSIG/6aFnlZQqdKNvKKZwx1GtpCi4m1w.webp",
                    caption: "Drill-down — grouped layouts in familiar terms",
                  },
                  {
                    src: "/assets/MSIG/a5rRn65DtRvHwOYL9MfA5fQT7I.webp",
                    caption: "Quotation details — fields grouped by context",
                  },
                  {
                    src: "/assets/MSIG/3zVXGHubwsDkSoRejI1kNsYWI.webp",
                    caption: "Core UI blocks defining stepper, form and sidebar",
                  },
                  {
                    src: "/assets/MSIG/FZH5qRxSvJSwBEKVMgkv5TzbYU.webp",
                    caption: "Responsive layout adapting the blocks for mobile",
                  },
                ]}
              />
            ),
          },
        ]}
      />
    </>
  );
}
