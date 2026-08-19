import CaseSummary from "@/components/case/CaseSummary";
import CaseFigure from "@/components/case/CaseFigure";
import CaseImpact from "@/components/case/CaseImpact";
import CaseQuote from "@/components/case/CaseQuote";
import CaseShowcase from "@/components/case/CaseShowcase";
import CaseNav from "@/components/case/CaseTabs";

/** Spine: context → the PM in his own words → the impact → the screens.

    Every claim here traces to cyrilvarghese.framer.website/projects/msig. */
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
            id: "user-journeys",
            label: "User journeys",
            body: (
              <>
                <CaseFigure
                  eyebrow="The agent's day"
                  heading="The day is half selling, half servicing."
                  diagram="/assets/MSIG/diagrams/01-agent-day.svg"
                />

                <CaseFigure
                  eyebrow="Journey 01"
                  heading="Selling a new policy."
                  diagram="/assets/MSIG/diagrams/02-new-policy.svg"
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
