'use client';
import StockSearch from "@/components/StockSearch";
import StockChart from "@/components/StockChart";
import OptionsChain from "@/components/OptionsChain";
import { useState } from "react";

export default function TradePage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-4">
        <StockSearchWrapper />
      </div>
    </div>
  );
}

function StockSearchWrapper() {
  const [symbol, setSymbol] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [isSimulationActive, setIsSimulationActive] = useState(false);

  if (!symbol) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2 text-white">GammaEdge</h1>
            <p className="text-zinc-400">
              Options Trading Simulator
            </p>
          </div>
          <StockSearch onSelect={(s) => setSymbol(s)} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => {
            setSymbol(null);
            setIsSimulationActive(false);
            setCurrentPrice(null);
          }}
          className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded hover:bg-zinc-700 transition-colors"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-white">{symbol}</h2>
        <div className="w-20"></div> {/* Spacer for centering */}
      </div>

      {/* Main Content: Chart (80%) + Options (20%) */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Chart Section - 80% */}
        <div className="flex-[4] bg-zinc-900 rounded-lg border border-zinc-800 p-4 overflow-hidden">
          <StockChart 
            symbol={symbol} 
            onPriceUpdate={setCurrentPrice}
            onSimulationStart={() => setIsSimulationActive(true)}
            onSimulationEnd={() => setIsSimulationActive(false)}
          />
        </div>

        {/* Options Section - 20% */}
        <div className="flex-[1] overflow-hidden">
          <OptionsChain 
            symbol={symbol} 
            currentPrice={currentPrice}
            isSimulationActive={isSimulationActive}
          />
        </div>
      </div>
    </div>
  );
}
