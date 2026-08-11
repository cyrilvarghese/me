import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import KnifeStory from "@/components/knife/KnifeStory";
import OutcomeTransition from "@/components/sections/OutcomeTransition";
import OperatingModel from "@/components/sections/OperatingModel";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <KnifeStory />
        <OutcomeTransition />
        <OperatingModel />
      </main>
    </>
  );
}
