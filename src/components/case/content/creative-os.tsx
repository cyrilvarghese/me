import CaseSection from "@/components/case/CaseSection";

export default function CreativeOsContent() {
  return (
    <>
      <CaseSection eyebrow="Problem" heading="One brief, five tools, no thread." mock>
        <p>
          Producing a single shot meant moving between scripts, prompt docs,
          reference boards and multiple generation tools — each hop losing
          context the next step needed.
        </p>
      </CaseSection>
      <CaseSection eyebrow="Pain points" mock>
        <ul>
          <li>Prompt knowledge trapped in chat histories nobody could reuse.</li>
          <li>References lived apart from the shots they informed.</li>
          <li>No shared picture of a scene while it was being made.</li>
        </ul>
      </CaseSection>
      <CaseSection eyebrow="Solutions" heading="A canvas where agents do the moving." mock>
        <p>
          One production surface: agents compose shots, draft prompts, pull
          references and run image and video generation in place — the
          context travels with the work instead of the person.
        </p>
      </CaseSection>
    </>
  );
}
