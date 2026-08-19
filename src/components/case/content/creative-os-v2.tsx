import CaseSummary from "@/components/case/CaseSummary";
import CaseProblems from "@/components/case/CaseProblems";
import CaseFigure from "@/components/case/CaseFigure";
import CaseShowcase from "@/components/case/CaseShowcase";

const D = "/assets/CreativeOS/diagrams";

/** An alternative spine for the same case, built to be scanned rather
    than read: context and impact → all three problems in one row of
    small drawings → the single answer to all three → the screens.

    The live page at /work/creative-os keeps the comparison bands. This
    one lives at /lab/creative-os so the two can be judged side by side. */
export default function CreativeOsV2Content() {
  return (
    <>
      <CaseSummary
        eyebrow="Context"
        heading="Producing AI creative at agency volume."
        lede="A D2C agency producing dozens of reels and stills a month, with AI generation running through the whole job — script, references, stills, then video."
        items={[
          {
            label: "Pain",
            body:
              "Context is rebuilt from scratch for every asset, the work is spread across five disconnected tools, and nothing catches a mistake until it has already become video.",
          },
          {
            label: "Solution",
            body:
              "One platform where brand context, script through reels, and approvals all live in the same space — faster iterations, lower cost.",
          },
          {
            label: "Impact",
            value: "40% less",
            body:
              "2.5 hrs → 1.5 hrs per asset, with errors caught while they are still cheap to fix.",
          },
        ]}
        meta={[
          { label: "Role", body: "Design engineer & Product manager." },
          { label: "Team", body: "Two AI engineers and one product designer." },
        ]}
      />

      <CaseProblems
        eyebrow="The problem"
        heading="Three problems, on every asset."
        items={[
          {
            stat: "3×",
            label: "The same context is set again for every reel.",
            diagram: `${D}/p1-context.svg`,
          },
          {
            stat: "5 tools",
            label: "Script, images and video live in different places.",
            diagram: `${D}/p2-tools.svg`,
          },
          {
            stat: "4×",
            label: "A mistake found in video costs four times the image.",
            diagram: `${D}/p3-late.svg`,
          },
        ]}
      />

      <CaseFigure
        eyebrow="The solution"
        heading="One canvas answers all three."
        lede="Context is set once and travels with every run, the whole pipeline sits in a single place, and a senior review lands before the expensive step."
        diagram={`${D}/s1-canvas.svg`}
      />

      <CaseShowcase
        eyebrow="Inside the system"
        stack
        shots={[
          { src: "/assets/CreativeOS/gallery.png", caption: "Canvas — shots in progress" },
          { src: "/assets/CreativeOS/img-gen.png", caption: "Generation with context attached" },
          { src: "/assets/CreativeOS/img-prompt.png", caption: "Prompt composed from references" },
          { src: "/assets/CreativeOS/video-gen.webp", caption: "Video generated from the approved shot" },
          { src: "/assets/CreativeOS/video-prompt.webp", caption: "Motion prompt carried from the image" },
        ]}
        video="https://storage.googleapis.com/creativeos-assets/demo-assets/Demo(comp).mp4"
        videoCaption="Walkthrough — brief to finished reel"
      />
    </>
  );
}
