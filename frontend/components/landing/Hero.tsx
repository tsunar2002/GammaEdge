"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import TradingViewWidget from "./TradingViewWidget";

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
      <div className="container mx-auto px-4 text-center z-10 relative">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-black mb-6 max-w-4xl mx-auto leading-tight"
        >
          Master Options Trading <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Risk-Free.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto"
        >
          Simulate complex strategies with historical data. No money lost, only experience gained. The ultimate training ground for serious traders.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/trade">
            <Button size="lg" className="rounded-full px-8 h-12 text-lg bg-black text-white hover:bg-gray-800 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              Start Trading Now
            </Button>
          </Link>
          <Link href="/sign-up">
             <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-lg border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-black hover:scale-105 transition-all duration-300">
              Create Account
            </Button>
          </Link>
        </motion.div>

        {/* Hero Image / Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 100, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.6, type: "spring", stiffness: 50 }}
          className="mt-20 relative mx-auto max-w-5xl h-[600px] rounded-2xl shadow-2xl border border-gray-200 overflow-hidden bg-white perspective-1000"
          style={{ transformStyle: "preserve-3d" }}
        >
            <TradingViewWidget />
        </motion.div>
      </div>
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/50 blur-[120px]" />
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-100/50 blur-[120px]" />
      </div>
    </section>
  );
};
