import CaseSummary from "@/components/case/CaseSummary";
import CaseCompare from "@/components/case/CaseCompare";
import CaseImpact from "@/components/case/CaseImpact";
import CaseShowcase from "@/components/case/CaseShowcase";
import CaseNav from "@/components/case/CaseTabs";

const D = "/assets/CreativeOS/diagrams";

/** Spine: context → three pain points, each argued by the same diagram
    told twice → the impact they add up to → the screens and the demo. */
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
              "Context is rebuilt from scratch for every asset, the work is spread across five disconnected tools, and nothing catches a mistake until it has already become video.",
          },
          {
            label: "Solution",
            body:
              "One canvas. Context is set once and travels with every run, script through reels lives in a single place, and a senior review sits before the expensive step.",
          },
          {
            label: "Impact",
            value: "40% less",
            body:
              "2.5 hrs → 1.5 hrs per asset, with errors caught while they are still cheap to fix.",
          },
        ]}
        meta={[
          {
            label: "Role",
            body: "Design engineer & Product manager.",
          },
          {
            label: "Team",
            body: "Two AI engineers and one product designer.",
          },
        ]}
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
                  eyebrow="The hidden cost of AI production"
                  heading="Every new creative still starts from scratch."
                  lede="Dozens of assets later, the knowledge still sits in chats on disconnected platforms. Every new asset rebuilds the same context."
                  today={{
                    title: "Every reel needs its context set again",
                    diagram: `${D}/01-today.svg`,
                    stat: { value: "3×", label: "context setup, for 3 reels" },
                    caption: "Context needs to be set every time for a new asset.",
                  }}
                  after={{
                    title: "One setup, all reels run in parallel",
                    diagram: `${D}/01-creativeos.svg`,
                    stat: { value: "1×", label: "context setup, for 3 reels" },
                    caption:
                      "Inputs set once — all three reels generate in parallel, a fraction of the time.",
                  }}
                />

                <CaseCompare
                  index="02"
                  eyebrow="Any edit means jumping between platforms"
                  heading="One canvas, not five tools."
                  lede="Script in one tool, images in another, video in a third. Every fix means re-briefing the brand from zero — on CreativeOS the whole pipeline lives on one canvas."
                  today={{
                    title: "Generation needs 5 separate tools",
                    diagram: `${D}/02-today.svg`,
                    caption:
                      "Every fix bounces back across every platform — re-brief, re-upload, regenerate.",
                  }}
                  after={{
                    title: "One canvas for all kinds of assets",
                    diagram: `${D}/02-canvas.svg`,
                    caption:
                      "One canvas: script, images, reels and posts are nodes on the same run — a fix never leaves it.",
                  }}
                />

                <CaseCompare
                  index="03"
                  eyebrow="Catch errors while they are cheap"
                  heading="Catch mistakes early, before they get expensive."
                  lede="The same mistake costs a few credits in an image — and a full batch in video. CreativeOS adds a senior review checkpoint before any video is generated."
                  today={{
                    title: "Errors surface after the video is made",
                    diagram: `${D}/03-today.svg`,
                    stat: { value: "4×", label: "cost of a late catch" },
                    caption: "A flawed image slips through — errors caught later are 4x more expensive.",
                  }}
                  after={{
                    title: "A review checkpoint before video",
                    diagram: `${D}/03-creativeos.svg`,
                    caption: "Review sits before video — the error is fixed once, at the image.",
                  }}
                />

                <CaseImpact
                  eyebrow="Impact"
                  value="40% less"
                  detail="2.5 hrs → 1.5 hrs per asset"
                  note="Context set once, one canvas end to end, and a review checkpoint before the expensive step."
                />
              </>
            ),
          },
          {
            id: "visual-assets",
            label: "Visual assets & Demo",
            body: (
              <CaseShowcase
                eyebrow="Inside the system"
                stack
                /* Source order is grid position: the top strip is the image
                   pipeline, the left column the video one — sitting beside
                   the demo it produces. */
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
            ),
          },
        ]}
      />
    </>
  );
}
