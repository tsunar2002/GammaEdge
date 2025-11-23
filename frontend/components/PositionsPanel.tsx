'use client';

import { usePortfolio } from '@/utils/PortfolioContext';
import { useState } from 'react';

interface PositionsPanelProps {
  simulationDate: Date | null;
}

export default function PositionsPanel({ simulationDate }: PositionsPanelProps) {
  const { positions, history, closePosition, buyingPower, totalPnL, totalPnLPercent, totalValue } = usePortfolio();
  const [activeTab, setActiveTab] = useState<'positions' | 'history'>('positions');

  const handleClosePosition = (id: string, price: number) => {
    // Use simulation date if available, otherwise fallback to now
    const closeDate = simulationDate || new Date();
    closePosition(id, price, closeDate);
  };

  return (
    <div className="h-full flex flex-col bg-zinc-900 rounded-lg border border-zinc-800 flex-1">
      {/* Header Stats */}
      <div className="p-4 border-b border-zinc-800 grid grid-cols-3 gap-4">
        <div>
          <div className="text-xs text-zinc-500">Net Liq Value</div>
          <div className="text-lg font-bold text-white">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div>
          <div className="text-xs text-zinc-500">Day P&L</div>
          <div className={`text-lg font-bold ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="text-sm ml-1">
              ({totalPnLPercent >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-zinc-500">Buying Power</div>
          <div className="text-lg font-bold text-white">
            ${buyingPower.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800">
        <button
          onClick={() => setActiveTab('positions')}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            activeTab === 'positions' 
              ? 'text-white border-b-2 border-blue-500 bg-zinc-800/50' 
              : 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/30'
          }`}
        >
          Positions ({positions.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            activeTab === 'history' 
              ? 'text-white border-b-2 border-blue-500 bg-zinc-800/50' 
              : 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/30'
          }`}
        >
          History ({history.length})
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'positions' ? (
          positions.length === 0 ? (
            <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
              No active positions
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-800/50 text-zinc-400 sticky top-0">
                <tr>
                  <th className="p-3 font-medium">Symbol</th>
                  <th className="p-3 font-medium">Qty</th>
                  <th className="p-3 font-medium">Avg Price</th>
                  <th className="p-3 font-medium">Mark</th>
                  <th className="p-3 font-medium">P&L</th>
                  <th className="p-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {positions.map((pos) => (
                  <tr key={pos.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-white">{pos.symbol}</div>
                      <div className="text-xs text-zinc-500">
                        {new Date(pos.expirationDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} ${pos.strike} {pos.type.toUpperCase()}
                      </div>
                    </td>
                    <td className="p-3 text-white">{pos.quantity}</td>
                    <td className="p-3 text-zinc-300">${pos.avgEntryPrice.toFixed(2)}</td>
                    <td className="p-3 text-white">${pos.currentPrice.toFixed(2)}</td>
                    <td className="p-3">
                      <div className={`font-medium ${pos.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)}
                      </div>
                      <div className={`text-xs ${pos.pnlPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {pos.pnlPercent.toFixed(2)}%
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleClosePosition(pos.id, pos.currentPrice)}
                        className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-white text-xs rounded transition-colors border border-zinc-700"
                      >
                        Close
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : (
          history.length === 0 ? (
            <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
              No trade history
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-800/50 text-zinc-400 sticky top-0">
                <tr>
                  <th className="p-3 font-medium">Symbol</th>
                  <th className="p-3 font-medium">Qty</th>
                  <th className="p-3 font-medium">Entry</th>
                  <th className="p-3 font-medium">Exit</th>
                  <th className="p-3 font-medium">P&L</th>
                  <th className="p-3 font-medium text-right">Closed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {history.map((pos) => (
                  <tr key={pos.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-white">{pos.symbol}</div>
                      <div className="text-xs text-zinc-500">
                        {new Date(pos.expirationDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} ${pos.strike} {pos.type.toUpperCase()}
                      </div>
                    </td>
                    <td className="p-3 text-white">{pos.quantity}</td>
                    <td className="p-3 text-zinc-300">${pos.entryPrice.toFixed(2)}</td>
                    <td className="p-3 text-zinc-300">${pos.exitPrice.toFixed(2)}</td>
                    <td className="p-3">
                      <div className={`font-medium ${pos.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)}
                      </div>
                      <div className={`text-xs ${pos.pnlPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {pos.pnlPercent.toFixed(2)}%
                      </div>
                    </td>
                    <td className="p-3 text-right text-xs text-zinc-500">
                      {new Date(pos.closedAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
}
