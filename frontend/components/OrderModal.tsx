'use client';

import { useState, useEffect } from 'react';
import { priceOption } from '@/utils/blackScholes';
import { getCurrentRiskFreeRate, getNextFriday } from '@/utils/optionsHelpers';
import { getSimulationTimeToExpiry } from '@/utils/simulationContext';

interface OrderModalProps {
  option: {
    strike: number;
    bid: number;
    ask: number;
    theoretical: number;
    delta: number;
    gamma: number;
    theta: number;
    vega: number;
    type: 'call' | 'put';
  };
  symbol: string;
  currentPrice: number;
  expirationDate: string;
  volatility?: number;
  onClose: () => void;
}

import { usePortfolio } from '@/utils/PortfolioContext';

export default function OrderModal({ option, symbol, currentPrice, expirationDate, volatility = 0.30, onClose }: OrderModalProps) {
  const [quantity, setQuantity] = useState(1);
  const { executeOrder, buyingPower } = usePortfolio();

  const handleSubmit = () => {
    const price = option.ask;
    const totalCost = price * quantity * 100;

    if (totalCost > buyingPower) {
      alert('Insufficient buying power!');
      return;
    }

    const success = executeOrder({
      symbol,
      strike: option.strike,
      type: option.type,
      expirationDate, // Passed from props
      side: 'buy',
      orderType: 'market',
      quantity,
      price,
    });

    if (success) {
      onClose();
    } else {
      alert('Failed to execute order');
    }
  };

  const totalCost = option.ask * quantity * 100;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-[#0f0f0f] border border-zinc-800 w-full max-w-sm shadow-2xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-[#141414]">
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wide">Buy Option</h2>
            <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
              {symbol} ${option.strike} {option.type.toUpperCase()}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Top Row: Price & Expiration */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#141414] border border-zinc-800 p-3">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Stock Price</div>
              <div className="text-xl font-bold text-white font-mono">${currentPrice.toFixed(2)}</div>
            </div>
            <div className="bg-[#141414] border border-zinc-800 p-3">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Expiration</div>
              <div className="text-xs font-medium text-white">
                {new Date(expirationDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Greeks Grid - Compact */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-[#141414] border border-zinc-800 p-2 text-center">
              <div className="text-[9px] text-zinc-500 uppercase">Delta</div>
              <div className="text-xs font-mono text-zinc-300">{option.delta.toFixed(3)}</div>
            </div>
            <div className="bg-[#141414] border border-zinc-800 p-2 text-center">
              <div className="text-[9px] text-zinc-500 uppercase">Gamma</div>
              <div className="text-xs font-mono text-zinc-300">{option.gamma.toFixed(3)}</div>
            </div>
            <div className="bg-[#141414] border border-zinc-800 p-2 text-center">
              <div className="text-[9px] text-zinc-500 uppercase">Theta</div>
              <div className="text-xs font-mono text-zinc-300">{option.theta.toFixed(2)}</div>
            </div>
            <div className="bg-[#141414] border border-zinc-800 p-2 text-center">
              <div className="text-[9px] text-zinc-500 uppercase">Vega</div>
              <div className="text-xs font-mono text-zinc-300">{option.vega.toFixed(2)}</div>
            </div>
          </div>

          {/* Market Data & Quantity Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Bid/Ask */}
            <div className="bg-[#141414] border border-zinc-800 p-3">
              <div className="flex justify-between items-end mb-1">
                <div className="text-[10px] text-zinc-500 uppercase">Bid</div>
                <div className="text-sm font-mono text-green-500">${option.bid.toFixed(2)}</div>
              </div>
              <div className="flex justify-between items-end">
                <div className="text-[10px] text-zinc-500 uppercase">Ask</div>
                <div className="text-sm font-mono text-red-500">${option.ask.toFixed(2)}</div>
              </div>
            </div>

            {/* Quantity Input */}
            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5 block">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full bg-[#141414] border border-zinc-800 px-3 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-blue-600 transition-colors"
              />
            </div>
          </div>

          {/* Total Cost */}
          <div className="bg-blue-950/20 border border-blue-900/30 p-4 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-blue-400 uppercase tracking-wider mb-0.5">Total Cost</div>
              <div className="text-[10px] text-zinc-500 font-mono">
                {quantity} × ${option.ask.toFixed(2)} × 100
              </div>
            </div>
            <div className="text-2xl font-bold text-white font-mono">${totalCost.toFixed(2)}</div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-zinc-800 flex gap-3 bg-[#141414]">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wide bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wide bg-green-600 text-white hover:bg-green-500 transition-colors"
          >
            Buy Order
          </button>
        </div>
      </div>
    </div>
  );
}
