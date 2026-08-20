import Header from "@/components/sections/Header";
import ScrollRuler from "@/components/ScrollRuler";
import Hero from "@/components/sections/Hero";
import OutcomeTransition from "@/components/sections/OutcomeTransition";
import OperatingModel from "@/components/sections/OperatingModel";
import CaseStudies from "@/components/sections/CaseStudies";
import Career from "@/components/sections/Career";
import UnknownProblem from "@/components/sections/UnknownProblem";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <ScrollRuler />
      <main>
        <Hero />
        <OutcomeTransition />
        <CaseStudies />
        <Career />
        <UnknownProblem />
        {/* the method reads last, after the proof — it explains how the
            work above happened rather than promising it up front */}
        <OperatingModel />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
