'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import OrderModal from './OrderModal';
import { priceOption } from '@/utils/blackScholes';
import { getCurrentRiskFreeRate, getNextFriday } from '@/utils/optionsHelpers';
import { getSimulationTimeToExpiry } from '@/utils/simulationContext';

interface OptionChainItem {
  strike: number;
  bid: number;
  ask: number;
  theoretical: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  volume: number;
  moneyness: 'ITM' | 'ATM' | 'OTM';
}

interface OptionsChainData {
  symbol: string;
  currentPrice: number;
  volatility: number;
  expirationDate: string;
  daysToExpiry: number;
  optionType: 'call' | 'put';
  chain: OptionChainItem[];
}

import { usePortfolio } from '@/utils/PortfolioContext';

interface OptionsChainProps {
  symbol: string;
  currentPrice: number | null;
  simulationDate: Date | null;
  isSimulationActive: boolean;
  selectedDate: Date | null;
}

export default function OptionsChain({ symbol, currentPrice, simulationDate, isSimulationActive, selectedDate }: OptionsChainProps) {
  const [optionType, setOptionType] = useState<'call' | 'put'>('call');
  const [data, setData] = useState<OptionsChainData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<OptionChainItem & { strike: number; type: 'call' | 'put' } | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const atmRef = useRef<HTMLDivElement>(null);
  
  const { updatePositions } = usePortfolio();

  // Fetch initial chain data only when simulation is active
  useEffect(() => {
    if (!symbol || !isSimulationActive) return;

    const fetchOptionsChain = async () => {
      setLoading(true);
      setError(null);

      try {
        let url = `/api/options?symbol=${symbol}&type=${optionType}`;
        if (selectedDate) {
            url += `&date=${selectedDate.toISOString().split('T')[0]}`;
        }
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch options chain');
        }

        const chainData = await response.json();
        setData(chainData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOptionsChain();
  }, [symbol, optionType, isSimulationActive, selectedDate]);

  // Update portfolio positions when price changes
  useEffect(() => {
    if (currentPrice && data && simulationDate) {
      updatePositions(
        currentPrice,
        data.volatility / 100,
        getCurrentRiskFreeRate(),
        simulationDate
      );
    }
  }, [currentPrice, data, simulationDate, updatePositions]);

  // Recalculate option prices when current price changes
  const liveChain = useMemo(() => {
    if (!data || !currentPrice) return data?.chain || [];

    // Recalculate prices with new stock price
    // Use simulation date if available, otherwise fallback to now (though simulationDate should be available)
    const simDate = simulationDate || new Date();
    const expirationDate = getNextFriday(simDate);
    const timeToExpiry = getSimulationTimeToExpiry(expirationDate, simDate);
    const riskFreeRate = getCurrentRiskFreeRate();

    return data.chain.map(option => {
      const newPrice = priceOption({
        stockPrice: currentPrice,
        strikePrice: option.strike,
        timeToExpiry,
        riskFreeRate,
        volatility: data.volatility / 100, // Convert from percentage
        optionType,
      });

      // Determine moneyness with new price
      let moneyness: 'ITM' | 'ATM' | 'OTM';
      const priceDiff = Math.abs(option.strike - currentPrice);
      const strikeInterval = data.chain[1]?.strike - data.chain[0]?.strike || 2.5;

      if (priceDiff < strikeInterval / 2) {
        moneyness = 'ATM';
      } else if (optionType === 'call') {
        moneyness = option.strike < currentPrice ? 'ITM' : 'OTM';
      } else {
        moneyness = option.strike > currentPrice ? 'ITM' : 'OTM';
      }

      return {
        ...option,
        bid: newPrice.bid,
        ask: newPrice.ask,
        theoretical: newPrice.theoreticalPrice,
        delta: newPrice.greeks.delta,
        gamma: newPrice.greeks.gamma,
        theta: newPrice.greeks.theta,
        vega: newPrice.greeks.vega,
        moneyness,
      };
    });
  }, [data, currentPrice, optionType, simulationDate]);

  // Scroll to ATM option when data loads or option type changes
  useEffect(() => {
    if (data && atmRef.current && scrollContainerRef.current) {
      setTimeout(() => {
        atmRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);
    }
  }, [data, optionType]);

  const handleBuyClick = (option: OptionChainItem) => {
    // Pass the live option data with current prices
    setSelectedOption({
      ...option,
      strike: option.strike,
      type: optionType,
    });
  };

  // Get sorted chain based on option type
  const getSortedChain = () => {
    const chainToSort = currentPrice ? liveChain : (data?.chain || []);
    
    // Both use descending order (highest strike first)
    const sorted = [...chainToSort].sort((a, b) => b.strike - a.strike);
    
    return sorted;
  };

  if (!symbol) {
    return null;
  }

  const sortedChain = getSortedChain();
  const displayPrice = currentPrice || data?.currentPrice;

  return (
    <>
      <div className="h-full flex flex-col bg-[#0f0f0f]">
        {/* Header with Toggle */}
        <div className="px-4 py-3 border-b border-gray-800 shrink-0">
          <div className="flex gap-1 mb-3">
            <button
              onClick={() => setOptionType('call')}
              className={`flex-1 py-1.5 text-[10px] font-semibold uppercase tracking-wide transition-all ${
                optionType === 'call'
                  ? 'bg-gray-800 text-white'
                  : 'bg-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              Calls
            </button>
            <button
              onClick={() => setOptionType('put')}
              className={`flex-1 py-1.5 text-[10px] font-semibold uppercase tracking-wide transition-all ${
                optionType === 'put'
                  ? 'bg-gray-800 text-white'
                  : 'bg-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              Puts
            </button>
          </div>
          {data && (
            <div className="text-center">
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                Exp: {new Date(data.expirationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
              <p className="text-sm font-bold text-green-500 mt-1">
                ${displayPrice?.toFixed(2)}
              </p>
            </div>
          )}
        </div>

        {/* Options List */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
          {!isSimulationActive && (
            <div className="flex items-center justify-center py-12 px-4">
              <div className="text-center">
                <div className="text-gray-600 text-xs mb-2">Start simulation to view options</div>
                <div className="text-gray-700 text-[10px]">Click "Start Simulation" on the chart</div>
              </div>
            </div>
          )}

          {isSimulationActive && loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-600 text-xs">Loading...</div>
            </div>
          )}

          {isSimulationActive && error && (
            <div className="p-4">
              <div className="bg-red-950/20 border border-red-900/50 p-3">
                <p className="text-red-400 text-[10px]">{error}</p>
              </div>
            </div>
          )}

          {isSimulationActive && !loading && !error && data && (
            <div>
              {sortedChain.map((option) => {
                const isATM = option.moneyness === 'ATM';
                
                return (
                  <div
                    key={option.strike}
                    ref={isATM ? atmRef : null}
                    className={`px-4 py-2.5 transition-colors border-b border-gray-800 hover:bg-[#141414] ${
                      isATM ? 'bg-[#141414]' : ''
                    }`}
                  >
                    {/* Strike and Price Row */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-white">
                          ${option.strike}
                        </span>
                        <span className="text-[10px] text-gray-500 uppercase">
                          {optionType}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-green-500">
                          ${option.ask.toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleBuyClick(option)}
                          className="bg-gray-800 hover:bg-gray-700 text-white w-6 h-6 flex items-center justify-center transition-colors text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Greeks */}
                    <div className="mt-1 text-[10px] text-gray-600">
                      Δ{option.delta.toFixed(3)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Order Modal */}
      {selectedOption && data && (
        <OrderModal
          option={{
            // Find the live option from the sorted chain to get real-time updates
            ...(sortedChain.find(opt => opt.strike === selectedOption.strike) || selectedOption),
            type: optionType, // Ensure type is always present
          }}
          symbol={symbol}
          currentPrice={displayPrice || data.currentPrice}
          expirationDate={data.expirationDate}
          volatility={data.volatility / 100}
          onClose={() => setSelectedOption(null)}
        />
      )}
    </>
  );
}
