import CaseSummary from "@/components/case/CaseSummary";
import CaseQuote from "@/components/case/CaseQuote";
import CaseShowcase from "@/components/case/CaseShowcase";
import CaseFigure from "@/components/case/CaseFigure";
import CaseVoices from "@/components/case/CaseVoices";
import CaseObject from "@/components/case/CaseObject";
import CaseNav from "@/components/case/CaseTabs";

const A = "/assets/CaseChat";
const D = `${A}/diagrams`;
const I = `${A}/icons`;
/** The screens as exported, before anyone drew on them — transparent PNGs
    that the annotation layer is added to here rather than in the export. */
const S = `${A}/screens`;

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
            label: "Outcomes",
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
              "Founder & CPTO — design engineer and AI engineer.",
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
                  heading="Lack of real cases hurts medical learning."
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
                  eyebrow="Medical learning today"
                  heading="Only 20% is hands-on learning."
                  lede="Lectures and textbooks build recall, and recall is what gets examined. The competence the job needs is built at the bedside — which is the smallest slice of the week, and mostly spent watching someone else decide."
                  diagram={`${D}/01-today-scenes.svg`}
                  diagramMobile={`${D}/01-today-scenes-mobile.svg`}
                  caption="Lectures and textbooks take four fifths of the week between them. The bedside — the only room where a student touches a patient — takes the rest."
                />

                <CaseObject
                  eyebrow="What a case carries"
                  heading="What if every student and teacher had a patient?"
                  lede="Access to unlimited patient cases lets teachers teach and students learn through the lens of patient care."
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
                  diagramMobile={`${D}/01-cases-mobile.svg`}
                />
              </>
            ),
          },
          {
            id: "solution",
            icon: "loop",
            label: "Solution",
            body: (
              <CaseFigure
                eyebrow="What we built"
                heading="A virtual clinical environment with unlimited patients is better."
                lede="A virtual clinic lets students practise every stage of patient care — from history-taking to treatment — without real-world constraints."
                diagram={`${D}/02-clinic.svg`}
                diagramMobile={`${D}/02-clinic-mobile.svg`}
                caption="Six stops on one loop. The closing edge is the product: nothing has to be scheduled or prepared, so the student simply starts again with someone new."
              />
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
                /* Source order is reading order, and it walks the same six
                   stages a consultation does: library, history, examination
                   and tests, diagnosis, feedback, then what is read around
                   the case.

                   Every screen here is the clean export with its callouts
                   drawn by the site. The one exception is the case library,
                   which explains itself — annotating everything is how
                   annotation stops meaning anything. */
                shots={[
                  { src: `${A}/case-library.webp`, caption: "Case library, grouped by specialty" },
                  {
                    src: `${S}/patient-history.png`,
                    card: { top: 0, right: 8.2, bottom: 14.7, left: 8.1 },
                    caption: "Taking a history from the patient",
                    alt: "The consultation screen: a chat with the simulated patient, suggested openings beneath it, and a panel tracking which parts of the history are complete.",
                    /* Fractions of the screenshot, measured off the file
                       once. Ordered down the screen so the rails never
                       cross each other. */
                    points: [
                      {
                        at: [{ x: 0.54, y: 0.313 }],
                        text: "The AI patient is prompted to answer in plain language and never give the diagnosis away.",
                      },
                      {
                        at: [{ x: 0.42, y: 0.635 }],
                        text: "Students often did not know how to begin, so the screen suggests ways to open the conversation.",
                        mark: "did not know how to begin",
                        accent: true,
                      },
                      {
                        at: [{ x: 0.7, y: 0.826 }],
                        text: "A progress panel shows how much of the interview is done, and what is still missing.",
                      },
                    ],
                  },
                  {
                    src: `${S}/Physical-exam.png`,
                    card: { top: 0, right: 6.9, bottom: 19.1, left: 6.8 },
                    caption: "Examination and lab tests, as in clinic",
                    /* Two cards overlapping on the diagonal, which is the
                       arrangement the source deck used: one step of the
                       consultation that spans two screens. Percentages of
                       a 3:2 box, so the overlap holds at every width. */
                    aspect: 1.5,
                    screen: 70,
                    layers: [
                      {
                        src: `${S}/Physical-exam.png`,
                        card: { top: 0, right: 6.9, bottom: 19.1, left: 6.8 },
                        alt: "A skin examination in the consultation: the findings written out above a clinical photograph of the patient's lower leg.",
                        left: 0,
                        top: 0,
                        width: 64.7,
                      },
                      {
                        src: `${S}/test-biopsy.png`,
                        card: { top: 0, right: 7.0, bottom: 19.7, left: 7.0 },
                        alt: "A completed skin biopsy: the result written out above four stained slides labelled A to D.",
                        left: 37.6,
                        top: 25.1,
                        width: 62.4,
                      },
                    ],
                    points: [
                      {
                        at: [{ x: 0.3, y: 0.39 }],
                        text: "Requesting an exam returns a real photograph, not a written verdict.",
                      },
                      {
                        at: [{ x: 0.736, y: 0.494 }],
                        text: "Results come back as images to interpret, so the judgement stays with the student.",
                        mark: "images to interpret",
                        accent: true,
                      },
                    ],
                  },
                  {
                    src: `${S}/diagnosis.png`,
                    card: { top: 0, right: 6.4, bottom: 18.9, left: 6.4 },
                    caption: "Committing to a diagnosis and a differential",
                    alt: "The submit-diagnosis dialog: each candidate condition carries a dropdown marking it primary, differential or ruled out, and the primary one asks for a written justification.",
                    screen: 68,
                    points: [
                      {
                        at: [{ x: 0.3, y: 0.296 }],
                        text: "An answer is not accepted until the reasoning behind it is typed alongside.",
                      },
                      {
                        at: [{ x: 0.82, y: 0.56 }],
                        text: "Plausible wrong answers are mixed in, so every option has to be judged rather than skimmed.",
                        mark: "Plausible wrong answers",
                        accent: true,
                      },
                    ],
                  },
                  {
                    src: `${S}/Feedback.png`,
                    card: { top: 2.9, right: 5.8, bottom: 17.1, left: 5.6 },
                    caption: "Feedback on how the case was reasoned",
                    alt: "Three feedback cards: a starred evidence-gathering score, an accuracy card confirming the diagnosis, and a panel listing strengths beside areas for improvement.",
                    screen: 70,
                    points: [
                      {
                        /* the empty stars, which is the score the callout
                           is actually about */
                        at: [{ x: 0.115, y: 0.405 }],
                        text: "One score for how thoroughly they gathered evidence before deciding.",
                      },
                      {
                        at: [{ x: 0.44, y: 0.375 }],
                        text: "Another for whether the call was right, with their reasoning quoted back to them.",
                      },
                      {
                        /* the first missed item itself rather than the
                           heading over it, which the node would sit on */
                        at: [{ x: 0.699, y: 0.479 }],
                        text: "And the steps they skipped, so the feedback names the gap and not just the grade.",
                        mark: "names the gap and not just the grade",
                        accent: true,
                      },
                    ],
                  },
                  {
                    src: `${S}/ideal-path-diagnosis.png`,
                    card: { top: 0, right: 6.4, bottom: 18.9, left: 6.4 },
                    caption: "A suggested diagnostic timeline",
                    alt: "A numbered diagnostic timeline: ten steps, each tagged by task type — history taking, physical exam, lab test — with a one-line instruction beneath.",
                    screen: 64,
                    points: [
                      {
                        at: [{ x: 0.093, y: 0.455 }],
                        text: "The path is numbered, so the order an expert would have worked in is visible.",
                        mark: "the order an expert would have worked in",
                        accent: true,
                      },
                      {
                        at: [{ x: 0.236, y: 0.606 }],
                        text: "Each step is tagged by type, so the kind of task reads before the words do.",
                      },
                      {
                        at: [{ x: 0.57, y: 0.711 }],
                        text: "Heading first, detail under it, so the path can be scanned instead of read.",
                      },
                    ],
                  },
                  {
                    src: `${S}/drugs-info.png`,
                    card: { top: 0, right: 6.4, bottom: 14.9, left: 6.4 },
                    caption: "Drug concepts, read while treating",
                    alt: "A drug reference panel for clofazimine: why it suits this case, its indication and mechanism, dosing, a memory tip, alternatives, adverse effects and contraindications.",
                    screen: 68,
                    points: [
                      {
                        /* The memory tip leads even though the panel beside
                           it reads first. Every rail lands on the same
                           column edge at a lower point than the last, so
                           two anchors at the same height cross unless the
                           right-hand one takes the upper row — the left one
                           travels further and would climb back over it.

                           Anchors sit on the clear corner of each panel
                           rather than the middle of its copy: a node
                           dropped on a word reads as a defect in the
                           screenshot. */
                        at: [{ x: 0.86, y: 0.11 }],
                        text: "A memory hook sits at the top, because recall is what gets tested.",
                      },
                      {
                        at: [{ x: 0.46, y: 0.1 }],
                        text: "Why it matters here comes first, ahead of the reference detail.",
                      },
                      {
                        at: [
                          { x: 0.9, y: 0.415 },
                          { x: 0.9, y: 0.504 },
                        ],
                        text: "Warnings and cautions earned their place in user testing.",
                        mark: "earned their place in user testing",
                        accent: true,
                      },
                    ],
                  },
                  {
                    src: `${S}/osce-layer2.png`,
                    card: { top: 0, right: 6.6, bottom: 16.6, left: 6.4 },
                    caption: "Assessments shaped like the real exam",
                    /* The question card with the concept modal over its top
                       right, as the source deck arranged them: answering and
                       the explanation that follows are one moment. */
                    aspect: 1.359,
                    screen: 72,
                    layers: [
                      {
                        src: `${S}/osce-layer2.png`,
                        card: { top: 0, right: 6.6, bottom: 16.6, left: 6.4 },
                        alt: "An OSCE question with four stain options, the chosen answer marked wrong and the correct one expanded with an explanation.",
                        left: 0,
                        top: 12.3,
                        width: 74.7,
                      },
                      {
                        src: `${S}/osce-layer1.png`,
                        card: { top: 0, right: 9.1, bottom: 27.4, left: 9.1 },
                        alt: "The concept panel: an explanation of why AFB staining identifies leprosy, and three key concepts — specific, general and lateral.",
                        left: 47.4,
                        top: 0,
                        width: 52.6,
                      },
                    ],
                    /* The modal leads, as it does in the source deck: it is
                       the upper of the two cards, so taking the lower one
                       first would cross the rails over each other. */
                    points: [
                      {
                        at: [{ x: 0.711, y: 0.181 }],
                        text: "Opening the explanation teaches the idea behind the answer, not just which option was right.",
                        mark: "the idea behind the answer",
                        accent: true,
                      },
                      {
                        at: [{ x: 0.469, y: 0.696 }],
                        text: "Questions are modelled on the real exam, and every option carries its own explanation.",
                      },
                    ],
                  },
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
                  heading="Getting better at exams was the most important thing."
                  lede="Students appreciated the learning, and valued retention and practice more. Shaping the assessments like the ones they actually sit raised engagement and outcomes together, rather than trading one for the other."
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
