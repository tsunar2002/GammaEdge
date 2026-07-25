"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, ArrowUpRight, TrendingUp, CheckCircle2 } from "lucide-react";

const dummyOptionsData = [
  { strike: 505, callBid: 9.80, callAsk: 10.05, putBid: 0.25, putAsk: 0.32, delta: 0.88, gamma: 0.015, theta: -0.12, vega: 0.18 },
  { strike: 510, callBid: 5.60, callAsk: 5.85, putBid: 0.85, putAsk: 0.95, delta: 0.64, gamma: 0.028, theta: -0.22, vega: 0.32 },
  { strike: 512.5, callBid: 3.90, callAsk: 4.10, putBid: 1.65, putAsk: 1.80, delta: 0.51, gamma: 0.034, theta: -0.28, vega: 0.38, highlight: true },
  { strike: 515, callBid: 2.30, callAsk: 2.50, putBid: 3.10, putAsk: 3.30, delta: 0.38, gamma: 0.029, theta: -0.24, vega: 0.33 },
  { strike: 520, callBid: 0.75, callAsk: 0.88, putBid: 7.40, putAsk: 7.75, delta: 0.16, gamma: 0.016, theta: -0.14, vega: 0.19 },
];

export const OptionsChainPreview = () => {
  const [selectedStrike, setSelectedStrike] = useState<number>(512.5);
  const [optionType, setOptionType] = useState<"call" | "put">("call");

  const activeRow = dummyOptionsData.find((r) => r.strike === selectedStrike) || dummyOptionsData[2];

  return (
    <section id="pricing-demo" className="py-28 bg-[#03060d] relative border-t border-cyan-500/10">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4 inline-block">
            Quantitative Pricing Model
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Live Black-Scholes Greeks.
          </h2>
          <p className="text-base md:text-lg text-gray-400">
            Click any strike price below to inspect dynamic theoretical prices and real-time Greek sensitivities.
          </p>
        </div>

        <div className="max-w-5xl mx-auto bg-[#070c18] rounded-2xl border border-cyan-500/20 shadow-[0_10px_50px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* Header Bar */}
          <div className="bg-[#091122] px-6 py-4 border-b border-cyan-500/15 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>SPY Weekly Contracts</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  EXP: THIS FRIDAY
                </span>
              </h3>
              <p className="text-xs font-mono text-gray-400 mt-0.5">Spot Price: $512.40 | Risk-Free Rate: 5.25% | Volatility: 18.6%</p>
            </div>

            <div className="flex items-center gap-2 bg-[#050811] p-1 rounded-lg border border-white/10">
              <button
                onClick={() => setOptionType("call")}
                className={`px-4 py-1.5 rounded text-xs font-bold font-mono transition-all ${
                  optionType === "call" ? "bg-emerald-500 text-black shadow" : "text-gray-400 hover:text-white"
                }`}
              >
                CALLS
              </button>
              <button
                onClick={() => setOptionType("put")}
                className={`px-4 py-1.5 rounded text-xs font-bold font-mono transition-all ${
                  optionType === "put" ? "bg-rose-500 text-white shadow" : "text-gray-400 hover:text-white"
                }`}
              >
                PUTS
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono">
              <thead>
                <tr className="bg-[#050914] text-[11px] text-gray-400 uppercase border-b border-white/5">
                  <th className="px-6 py-3 font-semibold">Strike</th>
                  <th className="px-6 py-3 font-semibold">Type</th>
                  <th className="px-6 py-3 font-semibold">Bid / Ask</th>
                  <th className="px-6 py-3 font-semibold text-center">Delta (Δ)</th>
                  <th className="px-6 py-3 font-semibold text-center">Gamma (Γ)</th>
                  <th className="px-6 py-3 font-semibold text-center">Theta (Θ)</th>
                  <th className="px-6 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {dummyOptionsData.map((row) => {
                  const isSelected = selectedStrike === row.strike;
                  const bid = optionType === "call" ? row.callBid : row.putBid;
                  const ask = optionType === "call" ? row.callAsk : row.putAsk;
                  const formattedDelta = optionType === "call" ? row.delta : (row.delta - 1);

                  return (
                    <tr
                      key={row.strike}
                      onClick={() => setSelectedStrike(row.strike)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? "bg-cyan-500/10" : "hover:bg-white/[0.03]"
                      }`}
                    >
                      <td className="px-6 py-4 font-bold text-white">
                        ${row.strike.toFixed(2)}
                        {row.highlight && (
                          <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                            ATM
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 uppercase text-xs font-semibold">
                        <span className={optionType === "call" ? "text-emerald-400" : "text-rose-400"}>
                          {optionType}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-white">
                        ${bid.toFixed(2)} / ${ask.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-center text-cyan-400 font-bold">
                        {formattedDelta.toFixed(3)}
                      </td>
                      <td className="px-6 py-4 text-center text-purple-400">
                        {row.gamma.toFixed(3)}
                      </td>
                      <td className="px-6 py-4 text-center text-rose-400">
                        {row.theta.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="px-3 py-1 rounded text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500 hover:text-black transition-all">
                          Inspect →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Selected Strike Inspector */}
          <div className="bg-[#050914] p-6 border-t border-cyan-500/15">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <span className="text-xs font-mono text-gray-400 uppercase">
                Active Selection: <strong className="text-white font-bold">${selectedStrike} {optionType.toUpperCase()}</strong>
              </span>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Black-Scholes Model Verified
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
              <div className="p-3 rounded-lg bg-[#070c18] border border-white/5">
                <span className="text-[10px] text-gray-500 uppercase block">Delta (Δ)</span>
                <span className="text-base font-bold text-cyan-400">
                  {(optionType === "call" ? activeRow.delta : activeRow.delta - 1).toFixed(4)}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#070c18] border border-white/5">
                <span className="text-[10px] text-gray-500 uppercase block">Gamma (Γ)</span>
                <span className="text-base font-bold text-purple-400">{activeRow.gamma.toFixed(4)}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#070c18] border border-white/5">
                <span className="text-[10px] text-gray-500 uppercase block">Theta (Θ) / Day</span>
                <span className="text-base font-bold text-rose-400">${activeRow.theta.toFixed(2)}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#070c18] border border-white/5">
                <span className="text-[10px] text-gray-500 uppercase block">Vega (Ꝟ) / 1% IV</span>
                <span className="text-base font-bold text-amber-400">${activeRow.vega.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
