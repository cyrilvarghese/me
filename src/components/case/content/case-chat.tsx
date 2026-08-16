import CaseSection from "@/components/case/CaseSection";

export default function CaseChatContent() {
  return (
    <>
      <CaseSection eyebrow="User journey" heading="Decide, get told why, go again." mock>
        <p>
          A student opens a generated clinical case, works the history and
          examination, commits to diagnostic decisions, and receives
          structured feedback on the reasoning — then repeats with a new
          case. Repetition is the product.
        </p>
      </CaseSection>
      <CaseSection eyebrow="System thinking" mock>
        <ul>
          <li>Case generator: clinically-plausible presentations on demand.</li>
          <li>Decision engine: every choice tracked against the case truth.</li>
          <li>Feedback rubric: structured, specific, never a grade alone.</li>
        </ul>
      </CaseSection>
    </>
  );
}
