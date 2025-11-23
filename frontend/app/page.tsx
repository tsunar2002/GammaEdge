import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { OptionsChainPreview } from "@/components/landing/OptionsChainPreview";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-blue-100">
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
