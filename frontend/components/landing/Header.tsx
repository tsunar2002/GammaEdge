"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const Header = () => {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
          GE
        </div>
        <span className="text-xl font-bold text-black tracking-tight">GammaEdge</span>
      </div>

      <nav className="hidden md:flex items-center gap-8">
        <Link href="/" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
          Home
        </Link>
        <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
          Features
        </Link>
        <Link href="/trade" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
          Trade
        </Link>
        <Link href="#" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
          About
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        <Link href="/log-in">
            <Button className="rounded-full px-6 bg-black text-white hover:bg-gray-800 transition-all">
            Log in
            </Button>
        </Link>
      </div>
    </motion.header>
  );
};
