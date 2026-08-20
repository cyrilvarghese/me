import Header from "@/components/sections/Header";
import ScrollRuler from "@/components/ScrollRuler";
import Hero from "@/components/sections/Hero";
import OutcomeTransition from "@/components/sections/OutcomeTransition";
import ToolList from "@/components/sections/ToolList";
import CaseStudies from "@/components/sections/CaseStudies";
import About from "@/components/sections/About";
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
        {/* the timeline reads after the proof: who did it, once what was
            done is on the page */}
        <About />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
