import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { TickerMarquee } from "@/components/landing/TickerMarquee";
import { Features } from "@/components/landing/Features";
import { OptionsChainPreview } from "@/components/landing/OptionsChainPreview";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050811] text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <Header />
      <main>
        <Hero />
        <TickerMarquee />
        <Features />
        <OptionsChainPreview />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
