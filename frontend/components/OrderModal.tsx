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

export default function OrderModal({ option, symbol, currentPrice, expirationDate, volatility = 0.30, onClose }: OrderModalProps) {
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [limitPrice, setLimitPrice] = useState(option.ask.toFixed(2));
  const [quantity, setQuantity] = useState(1);

  // Update limit price when option.ask changes (live updates)
  useEffect(() => {
    if (orderType === 'market') {
      setLimitPrice(option.ask.toFixed(2));
    }
  }, [option.ask, orderType]);

  const handleSubmit = () => {
    // TODO: Implement order submission in Phase 3
    console.log('Order submitted:', {
      symbol,
      strike: option.strike,
      type: option.type,
      orderType,
      price: orderType === 'market' ? option.ask : parseFloat(limitPrice),
      quantity,
    });
    onClose();
  };

  const totalCost = (orderType === 'market' ? option.ask : parseFloat(limitPrice)) * quantity * 100;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-lg border border-zinc-800 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-white">Buy Option</h2>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="text-sm text-zinc-400">
            {symbol} ${option.strike} {option.type.toUpperCase()}
          </div>
        </div>

        {/* Option Details */}
        <div className="p-6 space-y-4">
          {/* Current Price */}
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <div className="text-xs text-zinc-500 mb-1">Stock Price</div>
            <div className="text-2xl font-bold text-white">${currentPrice.toFixed(2)}</div>
          </div>

          {/* Greeks - Live Updating */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-800/50 rounded-lg p-3">
              <div className="text-xs text-zinc-500">Delta</div>
              <div className="text-lg font-semibold text-white">{option.delta.toFixed(4)}</div>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-3">
              <div className="text-xs text-zinc-500">Gamma</div>
              <div className="text-lg font-semibold text-white">{option.gamma.toFixed(4)}</div>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-3">
              <div className="text-xs text-zinc-500">Theta</div>
              <div className="text-lg font-semibold text-white">${option.theta.toFixed(2)}</div>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-3">
              <div className="text-xs text-zinc-500">Vega</div>
              <div className="text-lg font-semibold text-white">{option.vega.toFixed(2)}</div>
            </div>
          </div>

          {/* Bid/Ask Spread - Live Updating */}
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <div>
                <div className="text-xs text-zinc-500">Bid</div>
                <div className="text-lg font-semibold text-green-500">${option.bid.toFixed(2)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-zinc-500">Ask</div>
                <div className="text-lg font-semibold text-red-500">${option.ask.toFixed(2)}</div>
              </div>
            </div>
            <div className="text-xs text-zinc-500 text-center">
              Spread: ${(option.ask - option.bid).toFixed(2)}
            </div>
          </div>

          {/* Expiration */}
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <div className="text-xs text-zinc-500 mb-1">Expiration</div>
            <div className="text-sm font-semibold text-white">
              {new Date(expirationDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>

          {/* Order Type Toggle */}
          <div>
            <div className="text-sm font-semibold text-white mb-2">Order Type</div>
            <div className="flex gap-2">
              <button
                onClick={() => setOrderType('market')}
                className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${
                  orderType === 'market'
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                Market
              </button>
              <button
                onClick={() => setOrderType('limit')}
                className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${
                  orderType === 'limit'
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                Limit
              </button>
            </div>
          </div>

          {/* Limit Price Input */}
          {orderType === 'limit' && (
            <div>
              <label className="text-sm font-semibold text-white mb-2 block">Limit Price</label>
              <input
                type="number"
                step="0.01"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-600"
              />
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="text-sm font-semibold text-white mb-2 block">Quantity (Contracts)</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Total Cost - Live Updating */}
          <div className="bg-blue-950/30 border border-blue-900/50 rounded-lg p-4">
            <div className="text-xs text-blue-400 mb-1">Total Cost</div>
            <div className="text-2xl font-bold text-white">${totalCost.toFixed(2)}</div>
            <div className="text-xs text-zinc-500 mt-1">
              {quantity} contract{quantity > 1 ? 's' : ''} × ${orderType === 'market' ? option.ask.toFixed(2) : limitPrice} × 100
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-zinc-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg font-semibold bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            Buy {orderType === 'market' ? 'at Market' : 'with Limit'}
          </button>
        </div>
      </div>
    </div>
  );
}
