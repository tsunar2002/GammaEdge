"use client";
import React from "react";
import { motion } from "framer-motion";
import { LineChart, History, Zap, Shield, Calculator, Gauge, Cpu, RefreshCw } from "lucide-react";

const features = [
  {
    title: "Black-Scholes Pricing Engine",
    subtitle: "Exact Analytical Pricing",
    description: "Calculates call/put theoretical prices, bid-ask spreads, and all five primary Greeks (Delta, Gamma, Theta, Vega, Rho) in real-time.",
    icon: Calculator,
    badge: "100% MATHEMATICAL",
    color: "cyan",
  },
  {
    title: "Alpaca Market Data v2",
    subtitle: "Real Intraday 1-Min Bars",
    description: "Queries historical 1-minute stock data with market-hours filtering (09:30 - 16:00 EST) and multi-day holiday fallback protection.",
    icon: History,
    badge: "ALPACA v2 CONNECTED",
    color: "emerald",
  },
  {
    title: "Intraday Tick Simulator",
    subtitle: "Candle Replay Interpolation",
    description: "Linearly interpolates 1-minute OHLC candles into continuous ticks with tick noise and variable playback speeds (1x to 300x).",
    icon: Gauge,
    badge: "1x - 300x SPEED",
    color: "purple",
  },
  {
    title: "Virtual Portfolio Engine",
    subtitle: "$100k Virtual Cash",
    description: "Executes buy/sell market and limit orders with instant position averaging, mark-to-market valuations, and P&L history.",
    icon: Shield,
    badge: "$100K STARTING CASH",
    color: "amber",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-28 bg-[#050811] relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4 inline-block">
            Architectural Blueprint
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Engineered for Serious Traders.
          </h2>
          <p className="text-base md:text-lg text-gray-400">
            GammaEdge replaces generic paper-trading with exact Black-Scholes math and high-resolution historical data replays.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative rounded-2xl p-8 bg-[#070c18]/80 border border-cyan-500/15 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 shadow-xl overflow-hidden hover:shadow-[0_0_30px_rgba(0,242,254,0.1)]"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/15 transition-all" />

                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                    <Icon size={24} />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-[#091122] border border-cyan-500/20 text-cyan-300">
                    {feature.badge}
                  </span>
                </div>

                <p className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1 font-semibold">
                  {feature.subtitle}
                </p>
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed font-normal">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
