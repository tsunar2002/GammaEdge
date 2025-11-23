'use client';
import StockSearch from "@/components/StockSearch";
import StockChart from "@/components/StockChart";
import OptionsChain from "@/components/OptionsChain";
import { useState } from "react";
import { Header } from "@/components/landing/Header";

import { PortfolioProvider } from "@/utils/PortfolioContext";
import PositionsPanel from "@/components/PositionsPanel";

export default function TradePage() {
  return (
    <PortfolioProvider>
      <StockSearchWrapper />
    </PortfolioProvider>
  );
}

function StockSearchWrapper() {
  const [symbol, setSymbol] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [simulationDate, setSimulationDate] = useState<Date | null>(null);
  const [isSimulationActive, setIsSimulationActive] = useState(false);

  const popularStocks = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN', 'NVDA', 'META', 'SPY'];

  if (!symbol) {
    return (
      <div className="min-h-screen bg-white text-black">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-6 relative overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/50 blur-[120px]" />
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-100/50 blur-[120px]" />
          </div>

          <div className="max-w-4xl w-full">
            <div className="mb-12 text-center">
              <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-black via-gray-800 to-gray-600 bg-clip-text text-transparent">
                Start Trading
              </h1>
              <p className="text-xl text-gray-500 mb-10">
                Search for any stock to begin options trading simulation
              </p>
              
              {/* Popular Stocks */}
              <div className="mb-10">
                <p className="text-sm text-gray-500 mb-4 uppercase tracking-wider font-medium">Popular Stocks</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {popularStocks.map((stock) => (
                    <button
                      key={stock}
                      onClick={() => setSymbol(stock)}
                      className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-800 hover:text-black text-sm font-semibold transition-all border border-gray-200 hover:border-gray-300 rounded-xl shadow-sm hover:shadow-md"
                    >
                      {stock}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <StockSearch onSelect={(s) => setSymbol(s)} />
            
            {/* Feature Info */}
            <div className="mt-16 grid grid-cols-3 gap-8 text-center">
              <div className="p-6 bg-white/50 rounded-2xl border border-gray-100 backdrop-blur-sm shadow-sm">
                <div className="text-3xl font-bold text-black mb-2">Real Data</div>
                <div className="text-sm text-gray-500">Historical market data</div>
              </div>
              <div className="p-6 bg-white/50 rounded-2xl border border-gray-100 backdrop-blur-sm shadow-sm">
                <div className="text-3xl font-bold text-black mb-2">No Risk</div>
                <div className="text-sm text-gray-500">Practice with paper money</div>
              </div>
              <div className="p-6 bg-white/50 rounded-2xl border border-gray-100 backdrop-blur-sm shadow-sm">
                <div className="text-3xl font-bold text-black mb-2">Live Greeks</div>
                <div className="text-sm text-gray-500">Real-time calculations</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0a0a0a] text-white overflow-hidden flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0f0f0f] border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              setSymbol(null);
              setIsSimulationActive(false);
              setCurrentPrice(null);
              setSimulationDate(null);
            }}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Back
          </button>
          <div className="flex items-baseline gap-3">
            <h2 className="text-xl font-bold text-white">{symbol}</h2>
            {currentPrice && (
              <span className="text-green-500 text-sm font-medium">
                ${currentPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        {simulationDate && (
          <div className="text-xs text-gray-500">
            {simulationDate.toLocaleString()}
          </div>
        )}
      </div>

      {/* Main Content - Full Screen */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left: Chart (70%) */}
        <div className="flex-[7] flex flex-col border-r border-gray-800">
          <div className="flex-1 bg-[#0a0a0a] overflow-hidden">
            <StockChart 
              symbol={symbol} 
              onPriceUpdate={setCurrentPrice}
              onTimeUpdate={setSimulationDate}
              onSimulationStart={() => setIsSimulationActive(true)}
              onSimulationEnd={() => setIsSimulationActive(false)}
            />
          </div>
        </div>

        {/* Right Column: Options Chain + Positions (30%) */}
        <div className="flex-[3] flex flex-col overflow-hidden bg-[#0f0f0f]">
          {/* Options Chain - 60% */}
          <div className="flex-[6] overflow-hidden border-b border-gray-800">
            <OptionsChain 
              symbol={symbol} 
              currentPrice={currentPrice}
              simulationDate={simulationDate}
              isSimulationActive={isSimulationActive}
            />
          </div>
          
          {/* Positions - 40% */}
          <div className="flex-[4] overflow-hidden">
            <PositionsPanel simulationDate={simulationDate} />
          </div>
        </div>
      </div>
    </div>
  );
}
