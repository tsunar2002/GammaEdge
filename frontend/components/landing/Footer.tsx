"use client";
import React from "react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-[#03060d] border-t border-cyan-500/10 py-12 text-gray-400 font-mono text-xs">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-[#070c18] border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400 text-xs">
              γE
            </div>
            <span className="text-sm font-black text-white font-sans tracking-tight">GammaEdge</span>
          </div>

          <nav className="flex flex-wrap items-center gap-6">
            <Link href="/" className="hover:text-cyan-400 transition-colors">Overview</Link>
            <Link href="/#features" className="hover:text-cyan-400 transition-colors">Engine Specs</Link>
            <Link href="/#pricing-demo" className="hover:text-cyan-400 transition-colors">Black-Scholes</Link>
            <Link href="/trade" className="text-cyan-400 hover:text-cyan-300 transition-colors">Trading Terminal</Link>
            <Link href="/about" className="hover:text-cyan-400 transition-colors">About</Link>
          </nav>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <p>© {new Date().getFullYear()} GammaEdge. Intraday Weekly Options Simulator. Powered by Alpaca Market Data v2.</p>
          <p className="text-center md:text-right">
            Disclaimers: Simulated paper trading for practice only. Not financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
};
