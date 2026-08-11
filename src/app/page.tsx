import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import KnifeStory from "@/components/knife/KnifeStory";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <KnifeStory />
        {/* temp spacer; replaced by OutcomeTransition (Task 7) */}
        <div style={{ height: "60vh" }} />
      </main>
    </>
  );
}
