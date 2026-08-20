import CaseSummary from "@/components/case/CaseSummary";
import CaseQuote from "@/components/case/CaseQuote";
import CaseCompare from "@/components/case/CaseCompare";
import CaseShowcase from "@/components/case/CaseShowcase";
import CaseFigure from "@/components/case/CaseFigure";
import CaseVoices from "@/components/case/CaseVoices";
import CaseObject from "@/components/case/CaseObject";
import CaseNav from "@/components/case/CaseTabs";

const A = "/assets/CaseChat";
const D = `${A}/diagrams`;
const I = `${A}/icons`;

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
            Medical school teaches the facts well and the judgement badly
            because{" "}
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
               is legible without reading the body at all */
            value: (
              <>
                20<small>students</small> : 1<small>patient</small>
              </>
            ),
            /* the wait leads the body on its own line: it is the second half
               of the measurement, and the reason for it follows */
            body: (
              <>
                Fifteen minutes each.
                <br />
                Live patients teach best, and logistics ration them.
              </>
            ),
          },
          {
            label: "Solution",
            /* short enough to hold one line, which is what keeps it level with
               the ratio it answers and the outcome it buys */
            value: "AI plays the patient.",
            body:
              "The student talks, examines, tests, treats — then sees where the reasoning broke, and goes again.",
          },
          {
            label: "Impact",
            value: "Unlimited patients",
            /* "on demand" is the tail of the line above, so it stays lowercase
               and leads the body rather than starting a sentence */
            body: (
              <>
                on demand
                <br />
                A case costs a doctor nothing to run, so a student can be wrong
                as often as it takes.
              </>
            ),
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
                {/* The evidence first, in the words it arrived in, then the
                    week those words describe, then each pain point in
                    detail. Quotes before diagrams: a reader who has heard
                    the complaint reads the chart as confirmation rather
                    than as an assertion. */}
                <CaseVoices
                  eyebrow="What we heard"
                  heading="Both sides name the same gap."
                  lede="Students describe theory they cannot apply and exams they do not feel ready for. Their teachers agree that cases are the answer, and cannot find the hours to build them."
                  groups={[
                    {
                      icon: `${I}/students.png`,
                      label: "Student",
                      quotes: [
                        {
                          text: "I am not confident in my clinical exams and they are very stressful",
                          mark: "not confident in my clinical exams",
                        },
                        { text: "Lectures are lengthy and boring", mark: "boring" },
                        {
                          text: "We often have to refer 4000 page textbooks to make sense of the concepts",
                          mark: "have to refer 4000 page textbooks",
                        },
                        {
                          text: "I don't know how this applies to the real world",
                          mark: "don't know how this applies",
                        },
                      ],
                    },
                    {
                      icon: `${I}/doctor-teachers.png`,
                      label: "Doctor",
                      quotes: [
                        {
                          text: "Cases are the most important method of teaching I can think of but students don't get enough practice",
                          mark: "but students don't get enough practice",
                        },
                        {
                          text: "I don't have the time needed to prepare cases for my classroom teaching",
                          mark: "don't have the time needed",
                        },
                      ],
                    },
                  ]}
                />

                <CaseFigure
                  eyebrow="Where the hours actually go"
                  heading="Only the smallest share is hands on."
                  lede="Lectures and textbooks build recall, and recall is what gets examined. The competence the job needs is built at the bedside — which is the smallest slice of the week, and mostly spent watching someone else decide."
                  diagram={`${D}/01-today-scenes.svg`}
                  diagramMobile={`${D}/01-today-scenes-mobile.svg`}
                  caption="Lectures and textbooks take four fifths of the week between them. The bedside — the only room where a student touches a patient — takes the rest."
                />

                <CaseObject
                  eyebrow="What a case carries"
                  heading="One object, used from both sides."
                  lede="A patient case holds the whole episode — the history, the tests, the diagnosis, the treatment. The teacher explains through it; the student decides inside it. Neither is handed their own separate material."
                  object={{ icon: `${I}/Patient.png`, label: "Patient case" }}
                  attrs={[
                    { icon: `${I}/patient-history.png`, label: "History" },
                    { icon: `${I}/diagnosis.png`, label: "Diagnosis" },
                    { icon: `${I}/test.png`, label: "Tests" },
                    { icon: `${I}/treatment.png`, label: "Treatment" },
                  ]}
                  users={[
                    {
                      icon: `${I}/doctor-teachers.png`,
                      label: "Teacher",
                      quote:
                        "Teaching using a patient case allows me to teach and explain concepts through the lens of patient care",
                      mark: "explain concepts through the lens of patient care",
                    },
                    {
                      icon: `${I}/students.png`,
                      label: "Student",
                      quote: "Applying what I learn helps me understand and retain the subject better",
                      mark: "understand and retain the subject better",
                    },
                  ]}
                  caption="One case answers both complaints at once: the teacher gets something to explain through, and the student gets something to decide inside."
                />

                <CaseCompare
                  index="01"
                  eyebrow="Why cases stay rare"
                  heading="Every teacher interviewed agrees cases are the best way to learn."
                  lede="Every teacher is also a practising physician who is stretched for time."
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
