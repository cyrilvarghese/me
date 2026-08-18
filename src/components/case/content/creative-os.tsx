import CaseSection from "@/components/case/CaseSection";
import CaseCompare from "@/components/case/CaseCompare";
import CaseImpact from "@/components/case/CaseImpact";
import CaseShowcase from "@/components/case/CaseShowcase";

const D = "/assets/CreativeOS/diagrams";

/** Spine: context → three pain points, each argued by the same diagram
    told twice → the impact they add up to → the screens and the demo. */
export default function CreativeOsContent() {
  return (
    <>
      <CaseSection eyebrow="Context" heading="Agencies ship volume; the context never comes with it.">
        <p>
          A D2C agency produces dozens of reels and stills a month. The brand
          rules, lighting notes, tone and trend research exist — but they live
          in chats, drives and dashboards, so every new asset starts by
          rebuilding what the last one already knew.
        </p>
      </CaseSection>

      <CaseCompare
        index="01"
        eyebrow="The hidden cost of AI production"
        heading="Every new creative still starts from scratch."
        lede="Dozens of assets later, the knowledge still sits in chats, drives, and dashboards. Every new asset rebuilds the same context."
        today={{
          title: "Today — set context for every reel",
          diagram: `${D}/01-today.svg`,
          stat: { value: "3×", label: "context setup, for 3 reels" },
          caption: "Context needs to be set every time for a new asset.",
        }}
        after={{
          title: "CreativeOS — set once, run parallel",
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
          title: "Today — five tools",
          diagram: `${D}/02-today.svg`,
          caption:
            "Every fix bounces back across every platform — re-brief, re-upload, regenerate.",
        }}
        after={{
          title: "With CreativeOS",
          diagram: `${D}/02-creativeos.svg`,
          caption:
            "An error found in review goes straight back — fixed on the same canvas, context intact.",
        }}
      />

      <CaseCompare
        index="03"
        eyebrow="Catch errors while they are cheap"
        heading="Catch mistakes early, before they get expensive."
        lede="The same mistake costs a few credits in an image — and a full batch in video. CreativeOS adds a senior review checkpoint before any video is generated."
        today={{
          title: "Today — no checkpoint",
          diagram: `${D}/03-today.svg`,
          stat: { value: "4×", label: "cost of a late catch" },
          caption: "A flawed image slips through — errors caught later are 4x more expensive.",
        }}
        after={{
          title: "With CreativeOS",
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

      <CaseShowcase
        eyebrow="Inside the system"
        shots={[
          { src: "/assets/CreativeOS/gallery.png", caption: "Canvas — shots in progress" },
          { src: "/assets/CreativeOS/img-gen.png", caption: "Generation with context attached" },
          { src: "/assets/CreativeOS/img-prompt.png", caption: "Prompt composed from references" },
        ]}
        videoCaption="Walkthrough — brief to finished reel"
      />
    </>
  );
}
