"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export const Header = () => {
  return (
    <div className="fixed top-4 inset-x-0 z-50 px-4 pointer-events-none">
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="pointer-events-auto max-w-5xl mx-auto flex items-center justify-between px-6 py-2.5 rounded-full border border-cyan-500/20 bg-[#070c18]/85 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.7)]"
      >
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400 text-xs shadow-sm group-hover:scale-105 transition-transform">
            γE
          </div>
          <span className="text-base font-bold tracking-tight text-white">
            Gamma<span className="text-cyan-400">Edge</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-gray-300">
          <Link href="/" className="hover:text-cyan-400 transition-colors">
            Home
          </Link>
          <Link href="/#features" className="hover:text-cyan-400 transition-colors">
            Features
          </Link>
          <Link href="/trade" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors">
            Trade
          </Link>
          <Link href="/about" className="hover:text-cyan-400 transition-colors">
            About
          </Link>
        </nav>

        <Link href="/trade">
          <button className="px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-[#050811] font-bold text-xs hover:from-cyan-400 hover:to-emerald-400 transition-all shadow-md shadow-cyan-500/25">
            Trade →
          </button>
        </Link>
      </motion.header>
    </div>
  );
};
