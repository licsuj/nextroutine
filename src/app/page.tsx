import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ValueProps from "@/components/ValueProps";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import EmailCapture from "@/components/EmailCapture";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ValueProps />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <FAQ />
        <EmailCapture />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
