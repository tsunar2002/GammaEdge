"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export const Header = () => {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-12 py-4 backdrop-blur-md border-b border-cyan-500/10 bg-[#050811]/80"
    >
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="w-8 h-8 rounded-lg bg-[#070c18] border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400 text-sm shadow-sm">
          γE
        </div>
        <span className="text-lg font-bold tracking-tight text-white">
          Gamma<span className="text-cyan-400">Edge</span>
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <Link href="/#features" className="hover:text-white transition-colors">
          Features
        </Link>
        <Link href="/trade" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">
          Trade
        </Link>
        <Link href="/about" className="hover:text-white transition-colors">
          About
        </Link>
      </nav>

      <Link href="/trade">
        <button className="px-5 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-[#050811] font-bold text-xs hover:from-cyan-400 hover:to-emerald-400 transition-all shadow-md shadow-cyan-500/20">
          Trade →
        </button>
      </Link>
    </motion.header>
  );
};
