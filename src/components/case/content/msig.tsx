import CaseSummary from "@/components/case/CaseSummary";
import CaseFigure from "@/components/case/CaseFigure";
import CaseJourney from "@/components/case/CaseJourney";
import CaseImpact from "@/components/case/CaseImpact";
import CaseQuote from "@/components/case/CaseQuote";
import CaseShowcase from "@/components/case/CaseShowcase";
import CaseNav from "@/components/case/CaseTabs";

/** Spine: context → the PM in his own words → the agent's day → her two
    journeys, one pain at a time → the impact → the screens.

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
            label: "Outcomes",
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
            icon: "flow",
            label: "User journeys",
            body: (
              <>
                <CaseFigure
                  eyebrow="The agent's day"
                  heading="The day is half selling, half servicing."
                  diagram="/assets/MSIG/diagrams/01-agent-day.svg"
                />

                <CaseJourney
                  eyebrow="Journey 01"
                  heading="Selling a new policy."
                  icon="/assets/MSIG/icons/agent.png"
                  iconLabel="Jane, insurance agent"
                  stages={[
                    {
                      label: "Lead",
                      quote: "I can’t work while traveling; everything breaks on mobile",
                      consequence: "Hard to close a sale on the go",
                    },
                    {
                      label: "Quote",
                      quote: "It takes 20+ minutes just to fill a quote",
                      consequence: "Unorganized forms slow policy creation",
                    },
                    {
                      label: "Review",
                      quote: "I never know if this customer could take a higher cover.",
                      consequence: "No guidance, missed upsells",
                    },
                    {
                      label: "Submit",
                      quote: "I keep calling underwriting to check if it went through.",
                      consequence: "Unclear statuses cause delay",
                    },
                    {
                      label: "Payment",
                      quote: "Chasing payments takes longer than selling the policy.",
                      consequence: "Manual follow-ups delay closure",
                    },
                    { label: "Confirm" },
                  ]}
                />

                <CaseJourney
                  eyebrow="Journey 02"
                  heading="Renewing a policy."
                  icon="/assets/MSIG/icons/agent.png"
                  iconLabel="Jane, insurance agent"
                  stages={[
                    {
                      label: "Track",
                      quote: "If I forget to check, the policy just lapses.",
                      consequence: "Missed alerts, lost renewals",
                    },
                    {
                      label: "Initiate",
                      quote: "I just renew what they had last year — I don’t know what else to offer.",
                      consequence: "No cues, lost upgrades",
                    },
                    {
                      label: "Review",
                      quote: "I can’t move ahead until the customer sends their documents.",
                      consequence: "Pending docs, delayed progress",
                    },
                    {
                      label: "Payment",
                      quote: "I still have to remind customers to make the payment.",
                      consequence: "Manual payments, delayed revenue",
                    },
                    { label: "Confirm" },
                  ]}
                />

                <CaseImpact
                  eyebrow="Outcomes"
                  value="~8 min"
                  detail="Cut from quote-issuance time"
                  note="A scalable, responsive design system with semantically grouped data entry reduced errors and improved efficiency."
                />
              </>
            ),
          },
          {
            id: "visual-assets",
            icon: "frames",
            label: "Visual assets",
            body: (
              <CaseShowcase
                eyebrow="Inside the system"
                stack
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
                ]}
              />
            ),
          },
        ]}
      />
    </>
  );
}
