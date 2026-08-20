import Header from "@/components/sections/Header";
import ScrollRuler from "@/components/ScrollRuler";
import Hero from "@/components/sections/Hero";
import OutcomeTransition from "@/components/sections/OutcomeTransition";
import ToolList from "@/components/sections/ToolList";
import CaseStudies from "@/components/sections/CaseStudies";
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
        {/* mobile only: the six tools as a plain list, plus the compass
            close. The pinned desktop stage carries both above 768px. */}
        <ToolList />
        <CaseStudies />
        <UnknownProblem />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
