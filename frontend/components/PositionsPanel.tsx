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
    const closeDate = simulationDate || new Date();
    closePosition(id, price, closeDate);
  };

  return (
    <div className="h-full flex flex-col bg-[#0f0f0f]">
      {/* Header Stats */}
      <div className="px-4 py-3 border-b border-gray-800 grid grid-cols-3 gap-4 shrink-0">
        <div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Net Liq</div>
          <div className="text-sm font-semibold text-white">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Day P&L</div>
          <div className={`text-sm font-semibold ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="text-[10px] ml-1">
              ({totalPnLPercent >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Buying Power</div>
          <div className="text-sm font-semibold text-white">
            ${buyingPower.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 shrink-0">
        <button
          onClick={() => setActiveTab('positions')}
          className={`flex-1 py-2 text-xs font-medium transition-colors uppercase tracking-wide ${
            activeTab === 'positions' 
              ? 'text-white border-b-2 border-white bg-[#141414]' 
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Positions ({positions.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 text-xs font-medium transition-colors uppercase tracking-wide ${
            activeTab === 'history' 
              ? 'text-white border-b-2 border-white bg-[#141414]' 
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          History ({history.length})
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'positions' && (
          positions.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-600 text-xs">
              No active positions
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141414] text-gray-500 sticky top-0">
                <tr>
                  <th className="px-3 py-2 font-medium uppercase tracking-wide text-[10px]">Symbol</th>
                  <th className="px-3 py-2 font-medium uppercase tracking-wide text-[10px]">Qty</th>
                  <th className="px-3 py-2 font-medium uppercase tracking-wide text-[10px]">Avg</th>
                  <th className="px-3 py-2 font-medium uppercase tracking-wide text-[10px]">Mark</th>
                  <th className="px-3 py-2 font-medium uppercase tracking-wide text-[10px]">P&L</th>
                  <th className="px-3 py-2 font-medium uppercase tracking-wide text-[10px] text-right">Close</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {positions.map((pos) => (
                  <tr key={pos.id} className="hover:bg-[#141414] transition-colors">
                    <td className="px-3 py-2">
                      <div className="font-semibold text-white">{pos.symbol}</div>
                      <div className="text-[10px] text-gray-500">
                        {new Date(pos.expirationDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} ${pos.strike} {pos.type.toUpperCase()}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-gray-300">{pos.quantity}</td>
                    <td className="px-3 py-2 text-gray-400">${pos.avgEntryPrice.toFixed(2)}</td>
                    <td className="px-3 py-2 text-white font-medium">${pos.currentPrice.toFixed(2)}</td>
                    <td className="px-3 py-2">
                      <div className={`font-medium ${pos.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)}
                      </div>
                      <div className={`text-[10px] ${pos.pnlPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {pos.pnlPercent.toFixed(2)}%
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => handleClosePosition(pos.id, pos.currentPrice)}
                        className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-white text-[10px] transition-colors uppercase tracking-wide"
                      >
                        Close
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
        


        {activeTab === 'history' && (
          history.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-600 text-xs">
              No trade history
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141414] text-gray-500 sticky top-0">
                <tr>
                  <th className="px-3 py-2 font-medium uppercase tracking-wide text-[10px]">Symbol</th>
                  <th className="px-3 py-2 font-medium uppercase tracking-wide text-[10px]">Qty</th>
                  <th className="px-3 py-2 font-medium uppercase tracking-wide text-[10px]">Entry</th>
                  <th className="px-3 py-2 font-medium uppercase tracking-wide text-[10px]">Exit</th>
                  <th className="px-3 py-2 font-medium uppercase tracking-wide text-[10px]">P&L</th>
                  <th className="px-3 py-2 font-medium uppercase tracking-wide text-[10px] text-right">Closed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {history.map((pos) => (
                  <tr key={pos.id} className="hover:bg-[#141414] transition-colors">
                    <td className="px-3 py-2">
                      <div className="font-semibold text-white">{pos.symbol}</div>
                      <div className="text-[10px] text-gray-500">
                        {new Date(pos.expirationDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} ${pos.strike} {pos.type.toUpperCase()}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-gray-300">{pos.quantity}</td>
                    <td className="px-3 py-2 text-gray-400">${pos.entryPrice.toFixed(2)}</td>
                    <td className="px-3 py-2 text-gray-400">${pos.exitPrice.toFixed(2)}</td>
                    <td className="px-3 py-2">
                      <div className={`font-medium ${pos.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)}
                      </div>
                      <div className={`text-[10px] ${pos.pnlPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {pos.pnlPercent.toFixed(2)}%
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right text-[10px] text-gray-500">
                      {new Date(pos.closedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
