"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export const Header = () => {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-4 backdrop-blur-md border-b border-white/10 bg-[#020420]/50"
    >
      <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold shadow-sm bg-white text-black">
            GE
          </div>
          <span className="text-xl font-bold tracking-tight text-white">GammaEdge</span>
        </Link>

      <nav className="hidden md:flex items-center gap-8">
        <Link href="/" className="text-sm font-medium transition-colors text-gray-300 hover:text-white">
          Home
        </Link>
        <Link href="/#features" className="text-sm font-medium transition-colors text-gray-300 hover:text-white">
          Features
        </Link>
        <Link href="/trade" className="text-sm font-medium transition-colors text-gray-300 hover:text-white">
          Trade
        </Link>
        <Link href="/about" className="text-sm font-medium transition-colors text-gray-300 hover:text-white">
          About
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        {/* Auth removed as requested */}
      </div>
    </motion.header>
  );
};
