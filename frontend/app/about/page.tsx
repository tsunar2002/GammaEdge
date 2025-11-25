import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#020420] text-white font-sans selection:bg-blue-500/30 flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            About GammaEdge
          </h1>
          
          <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
            <p>
              GammaEdge is a personal project born from a passion for financial markets and software engineering. 
              It serves as a realistic options trading simulator designed to help users understand complex 
              derivatives without financial risk.
            </p>
            
            <p>
              This application demonstrates full-stack development capabilities, featuring real-time data visualization, 
              complex financial calculations (Black-Scholes model), and a modern, responsive user interface.
            </p>
            

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
