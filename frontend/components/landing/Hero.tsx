"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TradingViewWidget from "./TradingViewWidget";
import { ArrowRight, Play, Activity, ShieldCheck, Cpu } from "lucide-react";

export const Hero = () => {
  const [activeTab, setActiveTab] = useState<"SPY" | "AAPL" | "NVDA" | "TSLA">("SPY");

  return (
    <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-[#050811]">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10">
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[300px] rounded-full bg-cyan-500/15 blur-[140px]" />
        <div className="absolute top-[25%] right-[20%] w-[450px] h-[350px] rounded-full bg-emerald-500/10 blur-[150px]" />
        <div className="absolute top-[40%] left-[35%] w-[400px] h-[250px] rounded-full bg-purple-500/10 blur-[130px]" />
      </div>

      <div className="container mx-auto px-4 text-center z-10 relative">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#091122] border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold tracking-wider uppercase mb-8 shadow-lg shadow-cyan-950/40"
        >
          <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Intraday Replay & Black-Scholes Greek Engine</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-6 max-w-5xl mx-auto leading-[1.05]"
        >
          Replay Intraday Options. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-300 to-cyan-200">
            Master Your Edge.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto font-normal leading-relaxed"
        >
          Simulate weekly options strategies with 1-minute historical Alpaca market replays. 
          Dynamic Black-Scholes pricing, live Greek recalculations, and $100k virtual cash — zero financial risk.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/trade">
            <Button
              size="lg"
              className="rounded-full px-8 h-13 text-base font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 text-[#040812] hover:from-cyan-400 hover:to-emerald-400 transition-all duration-300 shadow-[0_0_35px_rgba(0,242,254,0.35)] border-0 flex items-center gap-2 group"
            >
              <span>Start Trading</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <Link href="/#features">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 h-13 text-base font-semibold border-cyan-500/20 text-gray-300 bg-[#091122]/60 hover:bg-[#0f1b36] hover:text-white transition-all duration-300 backdrop-blur-md"
            >
              Explore Engine Specs
            </Button>
          </Link>
        </motion.div>

        {/* Pro Terminal Workspace Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 80, rotateX: 12 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.9, delay: 0.45, type: "spring", stiffness: 45 }}
          className="relative mx-auto max-w-6xl rounded-2xl border border-cyan-500/20 shadow-[0_20px_80px_rgba(0,0,0,0.8)] overflow-hidden bg-[#070c18] backdrop-blur-2xl"
        >
          {/* Top Window Bar */}
          <div className="flex items-center justify-between px-6 py-3 bg-[#0a1122] border-b border-cyan-500/15">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-mono text-gray-400 border-l border-white/10 pl-3">
                GammaEdge Workstation v2.4 — Live Replay Session
              </span>
            </div>

            <div className="flex items-center gap-2">
              {(["SPY", "AAPL", "NVDA", "TSLA"] as const).map((ticker) => (
                <button
                  key={ticker}
                  onClick={() => setActiveTab(ticker)}
                  className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                    activeTab === ticker
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {ticker}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Metrics Header inside Mockup */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#050914] border-b border-white/5 text-left font-mono">
            <div className="px-3 py-1.5 rounded bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-gray-500 uppercase block">Underlying Price</span>
              <span className="text-sm font-bold text-emerald-400">$512.40 <span className="text-xs text-emerald-500/80">(+1.45%)</span></span>
            </div>
            <div className="px-3 py-1.5 rounded bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-gray-500 uppercase block">Estimated IV</span>
              <span className="text-sm font-bold text-cyan-400">18.64%</span>
            </div>
            <div className="px-3 py-1.5 rounded bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-gray-500 uppercase block">ATM 0DTE Delta</span>
              <span className="text-sm font-bold text-purple-400">0.514</span>
            </div>
            <div className="px-3 py-1.5 rounded bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-gray-500 uppercase block">Replay Speed</span>
              <span className="text-sm font-bold text-amber-400">10x Intraday</span>
            </div>
          </div>

          {/* Chart Display Container */}
          <div className="h-[480px] sm:h-[540px] w-full bg-[#050914] relative">
            <TradingViewWidget />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
