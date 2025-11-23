'use client';
import StockSearch from "@/components/StockSearch";
import StockChart from "@/components/StockChart";
import OptionsChain from "@/components/OptionsChain";
import { useState } from "react";

import { PortfolioProvider } from "@/utils/PortfolioContext";
import PositionsPanel from "@/components/PositionsPanel";

export default function TradePage() {
  return (
    <PortfolioProvider>
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-4">
          <StockSearchWrapper />
        </div>
      </div>
    </PortfolioProvider>
  );
}

function StockSearchWrapper() {
  const [symbol, setSymbol] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [simulationDate, setSimulationDate] = useState<Date | null>(null);
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
    <div className="h-[calc(100vh-2rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <button 
          onClick={() => {
            setSymbol(null);
            setIsSimulationActive(false);
            setCurrentPrice(null);
            setSimulationDate(null);
          }}
          className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded hover:bg-zinc-700 transition-colors"
        >
          ← Back
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-white">{symbol}</h2>
          {simulationDate && (
            <div className="text-xs text-zinc-500 font-mono">
              {simulationDate.toLocaleString()}
            </div>
          )}
        </div>
        <div className="w-20"></div> {/* Spacer for centering */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 overflow-hidden min-h-0">
        {/* Left Column: Chart + Positions */}
        <div className="flex-[4] flex flex-col gap-4 overflow-hidden">
          {/* Chart Section - 60% */}
          <div className="flex-[3] bg-zinc-900 rounded-lg border border-zinc-800 p-4 overflow-hidden min-h-0">
            <StockChart 
              symbol={symbol} 
              onPriceUpdate={setCurrentPrice}
              onTimeUpdate={setSimulationDate}
              onSimulationStart={() => setIsSimulationActive(true)}
              onSimulationEnd={() => setIsSimulationActive(false)}
            />
          </div>
          
          {/* Positions Section - 40% */}
          <div className="flex-[2] overflow-hidden min-h-0">
            <PositionsPanel simulationDate={simulationDate} />
          </div>
        </div>

        {/* Right Column: Options Chain - 20% */}
        <div className="flex-[1] overflow-hidden">
          <OptionsChain 
            symbol={symbol} 
            currentPrice={currentPrice}
            simulationDate={simulationDate}
            isSimulationActive={isSimulationActive}
          />
        </div>
      </div>
    </div>
  );
}
