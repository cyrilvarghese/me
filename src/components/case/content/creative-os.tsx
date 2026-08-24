import CaseSummary from "@/components/case/CaseSummary";
import CaseCompare from "@/components/case/CaseCompare";
import CaseImpact from "@/components/case/CaseImpact";
import CaseShowcase from "@/components/case/CaseShowcase";
import CaseNav from "@/components/case/CaseTabs";

const D = "/assets/CreativeOS/diagrams";

/** Spine: context → three pain points, each argued by the same diagram
    told twice → the impact they add up to → the screens. */
export default function CreativeOsContent() {
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
              "Context is rebuilt from scratch for every asset. The work is spread across disconnected tools, so a mistake surfaces late — once it is already video.",
          },
          {
            label: "Solution",
            body:
              "One platform where brand context, script through reels, and approvals all live in the same space — faster iterations, lower cost.",
          },
          {
            label: "Outcomes",
            value: "40% time saved",
            body:
              "2.5 hrs → 1.5 hrs per asset, with errors caught while they are still cheap to fix.",
          },
        ]}
        meta={[
          {
            label: "For",
            body: "Agencies handling large volumes of social-media content.",
          },
          {
            label: "What I owned",
            lines: [
              "Product — what got built, and in what order",
              "All design and UX, and the design system under it",
              "The front end, written hands-on",
              "Go-to-market",
            ],
          },
          {
            label: "Team",
            body: "Two AI engineers and one product designer.",
          },
          {
            label: "Stack",
            tags: ["Next.js", "Tailwind", "shadcn/ui", "RAG", "LLM APIs", "Figma", "Design systems"],
          },
        ]}
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
                  eyebrow="The hidden cost of AI production"
                  heading="Every new creative still starts from scratch."
                  lede="Dozens of assets later, the knowledge still sits in chats on disconnected platforms. Every new asset rebuilds the same context."
                  today={{
                    title: "Every reel needs its context set again",
                    diagram: `${D}/01-today.svg`,
                    stat: { value: "3×", label: "context setup, for 3 reels" },
                  }}
                  after={{
                    title: "One setup, all reels run in parallel",
                    diagram: `${D}/01-creativeos.svg`,
                    stat: { value: "1×", label: "context setup, for 3 reels" },
                  }}
                />

                <CaseCompare
                  index="02"
                  eyebrow="Any edit means jumping between platforms"
                  heading="One canvas, not five tools."
                  lede="Every kind of asset means another tool, and every tool needs the context set again."
                  today={{
                    title: "Generation needs 5 separate tools",
                    diagram: `${D}/02-today.svg`,
                  }}
                  after={{
                    title: "One canvas for all kinds of assets",
                    diagram: `${D}/02-canvas.svg`,
                  }}
                />

                <CaseCompare
                  index="03"
                  eyebrow="Catch errors while they are cheap"
                  heading="Catch mistakes early, before they get expensive."
                  lede="An error caught at a later stage costs a minimum of 4x more. CreativeOS adds a review component early in the pipeline, before any video is generated."
                  today={{
                    title: "Errors surface after the video is made",
                    diagram: `${D}/03-today.svg`,
                    stat: { value: "4×", label: "cost of a late catch" },
                  }}
                  after={{
                    title: "A review component early in the pipeline",
                    diagram: `${D}/03-creativeos.svg`,
                  }}
                />

                <CaseImpact
                  eyebrow="Outcomes"
                  value="40% time saved"
                  detail="2.5 hrs → 1.5 hrs per asset"
                  note="Context set once, one canvas end to end, and a review checkpoint before the expensive step."
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
                /* Source order is the pipeline: the canvas everything lives
                   on, then one asset travelling through it — prompt,
                   references, image, motion prompt, video. A reader who
                   only scrolls the pictures still sees the sequence the
                   case study argues for. */
                shots={[
                  {
                    src: "/assets/CreativeOS/canvas.webp",
                    caption: "The production canvas — every shot, prompt and render in one graph",
                  },
                  { src: "/assets/CreativeOS/img-prompt.png", caption: "The image prompt, composed from the brief" },
                  { src: "/assets/CreativeOS/gallery.png", caption: "Brand references added without leaving the canvas" },
                  { src: "/assets/CreativeOS/img-gen.png", caption: "The image, generated with that context attached" },
                  { src: "/assets/CreativeOS/video-prompt.png", caption: "The motion prompt, carried from the image" },
                  { src: "/assets/CreativeOS/video-gen.webp", caption: "The video, generated from the approved shot" },
                ]}
                /* Demo hidden 2026-08-21 (Cyril). videoCaption is the switch
                   CaseShowcase reads, so with both props off `hasDemo` is
                   false and the bento drops the tile entirely rather than
                   standing an "in production" placeholder over it — the same
                   path MSIG takes. The source is kept here, not deleted, so
                   putting it back is uncommenting these two lines and
                   restoring "& Demo" to the label above.

                   video="https://storage.googleapis.com/creativeos-assets/demo-assets/Demo(comp).mp4"
                   videoCaption="Walkthrough — brief to finished reel" */
              />
            ),
          },
        ]}
      />
    </>
  );
}
