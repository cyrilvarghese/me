import KnifeStory from "@/components/knife/KnifeStory";

export default function Home() {
  return (
    <main>
      {/* temp spacers to test scroll entry/exit; replaced by Hero (Task 6) and OutcomeTransition (Task 7) */}
      <div style={{ height: "60vh" }} />
      <KnifeStory />
      <div style={{ height: "60vh" }} />
    </main>
  );
}
