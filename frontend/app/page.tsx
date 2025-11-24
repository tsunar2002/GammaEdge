import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { OptionsChainPreview } from "@/components/landing/OptionsChainPreview";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020420] text-white font-sans selection:bg-blue-500/30">
      <Header />
      <main>
        <Hero />
        <Features />
        <OptionsChainPreview />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
