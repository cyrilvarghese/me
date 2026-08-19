import CaseSummary from "@/components/case/CaseSummary";
import CaseQuote from "@/components/case/CaseQuote";
import CaseCompare from "@/components/case/CaseCompare";
import CaseShowcase from "@/components/case/CaseShowcase";
import CaseFigure from "@/components/case/CaseFigure";
import CaseNav from "@/components/case/CaseTabs";

const A = "/assets/CaseChat";
const D = `${A}/diagrams`;

/** Spine: context → the two things that keep students out of a clinic,
    each argued by a paired diagram → the screens and the demo → the
    finding that changed what got built. No impact band: the outcome
    here is qualitative, and a number invented to fill the slot would be
    the least true thing on the page. */
export default function CaseChatContent() {
  return (
    <>
      <CaseSummary
        eyebrow="Context"
        heading="Teaching clinical reasoning with simulated clinics."
        lede={
          <>
            Medical school teaches the facts well and the judgement badly — not
            by choice, but because{" "}
            <em>
              judgement needs patients, and patients are the one thing a
              curriculum cannot hand out
            </em>
            .
          </>
        }
        items={[
          {
            label: "Pain",
            /* the units sit in the number rather than under it, so the ratio
               is legible without reading the body at all. The wait takes the
               line under it: it is the second half of the same measurement,
               not commentary on it */
            value: (
              <>
                20<small>students</small> : 1<small>patient</small>
                <br />
                Fifteen minutes each.
              </>
            ),
            body: "Live patients teach best, and logistics ration them.",
          },
          {
            label: "Solution",
            /* the answer is a single sentence, so it takes the value slot: it
               reads at the size of the ratio it replaces and the outcome it
               buys, and the detail underneath starts on its own line */
            value: "AI generates the patients.",
            body:
              "The student talks, examines, tests, treats — then sees where the reasoning broke, and goes again.",
          },
          {
            label: "Impact",
            /* the break is set rather than left to the wrapper: "Unlimited
               patients" is the claim, "on demand" is the condition on it */
            value: (
              <>
                Unlimited patients
                <br />
                on demand
              </>
            ),
            body:
              "A case costs a doctor nothing to run, so a student can be wrong as often as it takes.",
          },
        ]}
        meta={[
          {
            label: "Role",
            body:
              "Founding product designer & design engineer — product strategy, design and build.",
          },
          {
            label: "Team",
            body: "Two founders: myself as CPTO, Dr Gopikrishnan Anjaneyan as CCO.",
          },
        ]}
      />

      <CaseQuote
        quote="We wanted a way to make clinical reasoning visible and teachable — and give students a tool where they don't just receive knowledge, but build it through experience."
        name="Dr Gopikrishnan Anjaneyan"
        role="Co-founder · Associate Professor of Dermatology, AIMS Cochin"
      />

      <CaseNav
        label="Case study sections"
        sections={[
          {
            id: "pain-points",
            icon: "flow",
            label: "Pain points",
            body: (
              <>
                <CaseCompare
                  index="01"
                  eyebrow="Where the hours actually go"
                  heading="The facts are taught. The judgement is left to chance."
                  lede="Lectures and textbooks build recall, and recall is what gets examined. The competence the job needs is built at the bedside — which is the smallest slice of the week, and mostly spent watching someone else decide."
                  today={{
                    title: "Two paths build recall, one builds judgement",
                    diagram: `${D}/01-today.svg`,
                    stat: { value: "20%", label: "of learning time is hands-on" },
                    caption:
                      "Time splits three ways, and only the narrowest path arrives at being able to work a patient.",
                  }}
                  after={{
                    title: "A case is one object, used from both sides",
                    diagram: `${D}/01-cases.svg`,
                    caption:
                      "A patient case carries the whole episode — history, tests, diagnosis, treatment. The teacher explains through it; the student decides inside it.",
                  }}
                />

                <CaseCompare
                  index="02"
                  eyebrow="Why cases stay rare"
                  heading="The people who can write cases are the people with no time."
                  lede="Every teacher interviewed called case-based teaching the most valuable thing they do. Every one of them also said they cannot afford to prepare it. A hand-written case runs once, for one room, and the students in it watch."
                  today={{
                    title: "A line that ends",
                    diagram: `${D}/02-today.svg`,
                    caption:
                      "Each case costs a scarce hour, is spent in a single session, and leaves the student where they started — holding theory.",
                  }}
                  after={{
                    title: "A loop that closes",
                    diagram: `${D}/02-clinic.svg`,
                    stat: { value: "6", label: "stages, then a new patient" },
                    caption:
                      "The same six stages as a real consultation, generated on demand. Coming out of feedback and into the next patient is the product.",
                  }}
                />
              </>
            ),
          },
          {
            id: "visual-assets",
            icon: "frames",
            label: "Visual assets & Demo",
            body: (
              <CaseShowcase
                eyebrow="Inside the clinic"
                stack
                /* Source order is grid position: the two entry screens sit
                   in the top strip, the decision and feedback screens run
                   down the left, beside the demo they add up to. Each
                   still carries its own annotations — open one to read
                   what the choice was and why. */
                shots={[
                  { src: `${A}/case-library.webp`, caption: "Case library, grouped by specialty" },
                  { src: `${A}/patient-chat.webp`, caption: "Taking a history from the patient" },
                  { src: `${A}/examination.webp`, caption: "Examination and lab tests, as in clinic" },
                  { src: `${A}/diagnosis.webp`, caption: "Committing to a diagnosis and a differential" },
                  { src: `${A}/feedback.webp`, caption: "Feedback on how the case was reasoned" },
                  { src: `${A}/timeline.webp`, caption: "A suggested diagnostic timeline" },
                  { src: `${A}/drug-info.webp`, caption: "Drug concepts, read while treating" },
                  { src: `${A}/assessments.webp`, caption: "Assessments shaped like the real exam" },
                ]}
                youtube="eZ2wjnFp2gs"
                poster={`${A}/demo-poster.webp`}
                videoCaption="Walkthrough — a student works a case end to end"
              />
            ),
          },
          {
            id: "learnings",
            icon: "note",
            label: "Learnings",
            body: (
              <>
                <CaseQuote
                  quote="We thought students wanted to think like doctors — but they were trying to succeed as students. Success in exams was critical for that."
                  marks={false}
                />

                <CaseFigure
                  eyebrow="What moved the needle"
                  heading="Engagement followed the thing they were graded on."
                  lede="Students were not uninterested in becoming better clinicians. They gave their time to the learning that showed up as visible progress — and progress, to them, meant exams. Shaping the assessments like the ones they actually sit turned out to raise engagement and outcomes together, rather than trading one for the other."
                  diagram={`${D}/03-engagement.svg`}
                  caption="Aligning the learning design with what students were already measured on lifted engagement and effectiveness at once — the second line is steeper on both axes, not tilted between them."
                />
              </>
            ),
          },
        ]}
      />
    </>
  );
}
