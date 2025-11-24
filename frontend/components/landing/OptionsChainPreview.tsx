"use client";
import React from "react";
import { motion } from "framer-motion";

const dummyOptionsData = [
  { strike: 170, callBid: 12.50, callAsk: 12.80, putBid: 0.15, putAsk: 0.20, delta: 0.85 },
  { strike: 175, callBid: 8.20, callAsk: 8.50, putBid: 0.35, putAsk: 0.45, delta: 0.72 },
  { strike: 180, callBid: 4.80, callAsk: 5.10, putBid: 0.80, putAsk: 0.95, delta: 0.58, highlight: true },
  { strike: 185, callBid: 2.40, callAsk: 2.65, putBid: 1.85, putAsk: 2.05, delta: 0.42 },
  { strike: 190, callBid: 1.05, callAsk: 1.20, putBid: 3.95, putAsk: 4.20, delta: 0.28 },
  { strike: 195, callBid: 0.35, callAsk: 0.45, putBid: 7.50, putAsk: 7.85, delta: 0.15 },
];

export const OptionsChainPreview = () => {
  return (
    <section className="py-24 bg-[#020420]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Precision Pricing with Black-Scholes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-gray-400"
          >
            Options prices computed dynamically using the Black-Scholes model. Trade historical scenarios as if you were there.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto bg-[#0a0a0a] rounded-2xl border border-white/10 shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-white/5 px-6 py-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Options Chain</h3>
                <p className="text-sm text-gray-400">Spot: $182.50 | Expiry: 30 DTE | IV: 24.5%</p>
              </div>
              <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
                <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">Black-Scholes</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Call Bid</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Call Ask</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider font-bold">Strike</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Put Bid</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Put Ask</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">Delta</th>
                </tr>
              </thead>
              <tbody>
                {dummyOptionsData.map((row, index) => (
                  <motion.tr
                    key={row.strike}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                      row.highlight ? "bg-blue-900/20" : ""
                    }`}
                  >
                    <td className="px-4 py-4 text-sm font-medium text-green-400">${row.callBid.toFixed(2)}</td>
                    <td className="px-4 py-4 text-sm font-medium text-green-400">${row.callAsk.toFixed(2)}</td>
                    <td className="px-4 py-4 text-center text-base font-bold text-white">
                      ${row.strike}
                      {row.highlight && (
                        <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-medium text-red-400">${row.putBid.toFixed(2)}</td>
                    <td className="px-4 py-4 text-right text-sm font-medium text-red-400">${row.putAsk.toFixed(2)}</td>
                    <td className="px-4 py-4 text-right text-sm text-gray-400 hidden md:table-cell">{row.delta.toFixed(2)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Note */}
          <div className="bg-white/5 px-6 py-3 border-t border-white/10">
            <p className="text-xs text-gray-500 text-center">
              Prices calculated using historical volatility and the Black-Scholes model. Greeks update as the simulation progresses.
            </p>
          </div>
        </motion.div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">
          {[
            { label: "Greeks Analysis", value: "Δ Γ Θ Ꝟ", color: "blue" },
            { label: "Implied Volatility", value: "24.5%", color: "purple" },
            { label: "Open Interest", value: "12.4K", color: "green" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              className="bg-white/5 p-6 rounded-xl border border-white/10 text-center"
            >
              <p className="text-sm text-gray-400 mb-2">{stat.label}</p>
              <p className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
