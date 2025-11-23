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

interface OptionsChainProps {
  symbol: string;
  currentPrice: number | null;
  isSimulationActive: boolean;
}

export default function OptionsChain({ symbol, currentPrice, isSimulationActive }: OptionsChainProps) {
  const [optionType, setOptionType] = useState<'call' | 'put'>('call');
  const [data, setData] = useState<OptionsChainData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<OptionChainItem & { strike: number; type: 'call' | 'put' } | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const atmRef = useRef<HTMLDivElement>(null);

  // Fetch initial chain data only when simulation is active
  useEffect(() => {
    if (!symbol || !isSimulationActive) return;

    const fetchOptionsChain = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/options?symbol=${symbol}&type=${optionType}`);
        
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
  }, [symbol, optionType, isSimulationActive]);

  // Recalculate option prices when current price changes
  const liveChain = useMemo(() => {
    if (!data || !currentPrice) return data?.chain || [];

    // Recalculate prices with new stock price
    const simulationDate = new Date(); // In real app, get from bar data
    const expirationDate = getNextFriday(simulationDate);
    const timeToExpiry = getSimulationTimeToExpiry(expirationDate, simulationDate);
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
  }, [data, currentPrice, optionType]);

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
      <div className="h-full flex flex-col bg-zinc-900 rounded-lg border border-zinc-800">
        {/* Header with Toggle */}
        <div className="p-4 border-b border-zinc-800">
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setOptionType('call')}
              className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${
                optionType === 'call'
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              Calls
            </button>
            <button
              onClick={() => setOptionType('put')}
              className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${
                optionType === 'put'
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              Puts
            </button>
          </div>
          {data && (
            <div className="text-center">
              <p className="text-xs text-zinc-500">
                Exp: {new Date(data.expirationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
              <p className="text-lg font-bold text-green-500 mt-1">
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
                <div className="text-zinc-500 text-sm mb-2">Start simulation to view options</div>
                <div className="text-zinc-600 text-xs">Click "Start Simulation" on the chart</div>
              </div>
            </div>
          )}

          {isSimulationActive && loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-zinc-500 text-sm">Loading...</div>
            </div>
          )}

          {isSimulationActive && error && (
            <div className="p-4">
              <div className="bg-red-950/20 border border-red-900/50 rounded-lg p-3">
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            </div>
          )}

          {isSimulationActive && !loading && !error && data && (
            <div className="divide-y divide-zinc-800">
              {sortedChain.map((option) => {
                const isATM = option.moneyness === 'ATM';
                
                return (
                  <div
                    key={option.strike}
                    ref={isATM ? atmRef : null}
                    className={`p-4 transition-colors ${
                      isATM ? 'bg-zinc-800/50' : 'hover:bg-zinc-800/30'
                    }`}
                  >
                    {/* Strike and Type */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-white">
                        ${option.strike}
                      </span>
                      <span className="text-sm text-zinc-400 capitalize">
                        {optionType}
                      </span>
                      {isATM && (
                        <span className="ml-auto">
                          <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </div>

                    {/* Price and Buy Button */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex items-center justify-between bg-zinc-950/50 border border-orange-600/50 rounded-full px-4 py-2">
                        <span className="text-orange-500 font-bold">
                          ${option.ask.toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleBuyClick(option)}
                          className="bg-orange-600 hover:bg-orange-700 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                        >
                          <span className="text-lg font-bold">+</span>
                        </button>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-2 text-xs text-zinc-500">
                      Delta: {option.delta.toFixed(3)}
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
