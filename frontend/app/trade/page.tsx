'use client';
import StockSearch from "@/components/StockSearch";
import StockChart from "@/components/StockChart";
import OptionsChain from "@/components/OptionsChain";
import { useState } from "react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSimulationActive, setIsSimulationActive] = useState(false);

  const popularStocks = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN', 'NVDA', 'META', 'SPY'];

  if (!symbol) {
    const popularStocksData = [
      { symbol: 'AAPL', change: '+1.2%', isPositive: true },
      { symbol: 'MSFT', change: '-0.5%', isPositive: false },
      { symbol: 'GOOGL', change: '+0.8%', isPositive: true },
      { symbol: 'TSLA', change: '+1.2%', isPositive: true },
      { symbol: 'AMZN', change: '-1.5%', isPositive: false },
      { symbol: 'META', change: '-1.5%', isPositive: false },
      { symbol: 'SPY', change: '+51%', isPositive: true },
      { symbol: 'NVDA', change: '+2.4%', isPositive: true },
      { symbol: 'AMD', change: '+1.8%', isPositive: true },
      { symbol: 'NFLX', change: '-0.8%', isPositive: false },
    ];

    // Duplicate for infinite scroll
    const marqueeStocks = [...popularStocksData, ...popularStocksData];

    return (
      <div className="min-h-screen bg-[#020420] text-white">
        <Header />
        
        {/* Hero Section */}
        <div className="relative min-h-[85vh] w-full overflow-hidden flex flex-col items-center justify-center pt-20 pb-10">
          {/* Background - Dark Blue */}
          <div className="absolute inset-0 bg-[#020420] z-0" />
          
          <div className="relative z-10 w-full flex flex-col items-center text-center">
            <div className="max-w-5xl px-6 mb-8">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
                Start Trading
              </h1>
              <p className="text-lg text-gray-300 font-light drop-shadow-md">
                Search for any stock to begin options trading simulation
              </p>
            </div>
            
            <div className="w-full px-6 mb-12">
              <StockSearch onSelect={(s) => setSymbol(s)} />
            </div>

            {/* Popular Stocks - Infinite Marquee (Full Width) */}
            <div className="w-full overflow-hidden relative group mb-12">
              <div className="max-w-7xl mx-auto px-6 mb-6">
                <p className="text-xs text-gray-400 uppercase tracking-[0.2em] font-medium text-center">TRENDING ASSETS</p>
              </div>
              
              <div className="flex w-full overflow-hidden mask-image-linear-gradient">
                <div className="flex gap-4 animate-scroll hover:pause whitespace-nowrap pl-4">
                  {marqueeStocks.map((stock, index) => (
                    <button
                      key={`${stock.symbol}-${index}`}
                      onClick={() => setSymbol(stock.symbol)}
                      className={`shrink-0 group/item relative px-6 py-2.5 rounded-full border backdrop-blur-sm transition-all hover:scale-105 ${
                        stock.isPositive 
                          ? 'bg-green-500/10 border-green-500/20 hover:bg-green-500/20' 
                          : 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-white">{stock.symbol}</span>
                        <span className={`text-xs font-medium ${stock.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                          {stock.change}
                        </span>
                        {stock.isPositive ? (
                          <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                 <div className="flex gap-4 animate-scroll hover:pause whitespace-nowrap ml-4" aria-hidden="true">
                  {marqueeStocks.map((stock, index) => (
                    <button
                      key={`dup-${stock.symbol}-${index}`}
                      onClick={() => setSymbol(stock.symbol)}
                      className={`shrink-0 group/item relative px-6 py-2.5 rounded-full border backdrop-blur-sm transition-all hover:scale-105 ${
                        stock.isPositive 
                          ? 'bg-green-500/10 border-green-500/20 hover:bg-green-500/20' 
                          : 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-white">{stock.symbol}</span>
                        <span className={`text-xs font-medium ${stock.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                          {stock.change}
                        </span>
                        {stock.isPositive ? (
                          <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <style jsx>{`
                @keyframes scroll {
                  from { transform: translateX(0); }
                  to { transform: translateX(-100%); }
                }
                .animate-scroll {
                  animation: scroll 40s linear infinite;
                }
                .hover\\:pause:hover {
                  animation-play-state: paused;
                }
              `}</style>
            </div>
          </div>
        </div>

        {/* Feature Cards - Overlapping */}
        <div className="relative -mt-20 z-20 px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Real Data */}
              <div className="bg-white/5 p-8 rounded-2xl border border-white/10 shadow-lg hover:bg-white/10 transition-all group">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Real Data</h3>
                <p className="text-gray-400 leading-relaxed">
                  Access historical market data to test your strategies against real market conditions.
                </p>
              </div>

              {/* No Risk */}
              <div className="bg-white/5 p-8 rounded-2xl border border-white/10 shadow-lg hover:bg-white/10 transition-all group">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">No Risk</h3>
                <p className="text-gray-400 leading-relaxed">
                  Practice trading with paper money. Learn from mistakes without losing real capital.
                </p>
              </div>

              {/* Live Greeks */}
              <div className="bg-white/5 p-8 rounded-2xl border border-white/10 shadow-lg hover:bg-white/10 transition-all group">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 3.666A5.976 5.976 0 019 12.133m9-3v1.5m-9 3v3.75m3.75-3.75h3.75m-3.75 0V15m0-1.5h-.75m.75 0H15m0 0H9m0 0h-.75" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Live Greeks</h3>
                <p className="text-gray-400 leading-relaxed">
                  Real-time calculation of Delta, Gamma, Theta, and Vega for every option contract.
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
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
              setSelectedDate(null);
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
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
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
              selectedDate={selectedDate}
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
