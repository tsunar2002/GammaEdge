"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Activity, Zap, Users, ShieldAlert } from "lucide-react";

export const CTASection = () => {
  const [tradeCount, setTradeCount] = useState(14820);
  const [activeTraders, setActiveTraders] = useState(185);

  useEffect(() => {
    const tradeInterval = setInterval(() => {
      setTradeCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 2500);

    const tradersInterval = setInterval(() => {
      setActiveTraders((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.max(120, Math.min(300, prev + delta));
      });
    }, 3500);

    return () => {
      clearInterval(tradeInterval);
      clearInterval(tradersInterval);
    };
  }, []);

  return (
    <section className="py-28 bg-[#050811] relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-t from-cyan-500/10 to-transparent blur-3xl opacity-70" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto rounded-3xl p-10 sm:p-16 bg-gradient-to-b from-[#091122]/90 to-[#060a16] border border-cyan-500/20 shadow-[0_0_80px_rgba(0,0,0,0.8)] text-center backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6 inline-block">
              Zero Capital Risk
            </span>

            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
              Ready to Refine Your Intraday Edge?
            </h2>

            <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto font-normal leading-relaxed">
              Launch the simulator, select your target date, and experience live-feeling market action with historical data replays.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
              <Link href="/trade">
                <Button
                  size="lg"
                  className="rounded-full px-9 h-13 text-base font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 text-[#040812] hover:from-cyan-400 hover:to-emerald-400 transition-all duration-300 shadow-[0_0_35px_rgba(0,242,254,0.35)] border-0 flex items-center gap-2 group"
                >
                  <span>Start Trading</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-cyan-500/15 font-mono">
            <div className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Users className="w-4 h-4 text-cyan-400" />
                <span className="text-2xl font-bold text-white">{activeTraders}</span>
              </div>
              <span className="text-[11px] text-gray-400">Active Simulation Sessions</span>
            </div>

            <div className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span className="text-2xl font-bold text-white">$100,000</span>
              </div>
              <span className="text-[11px] text-gray-400">Starting Paper Capital</span>
            </div>

            <div className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-purple-400" />
                <span className="text-2xl font-bold text-white">{tradeCount.toLocaleString()}</span>
              </div>
              <span className="text-[11px] text-gray-400">Options Contracts Simulated</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
