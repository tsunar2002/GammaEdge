"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, TrendingUp, Zap, Users } from "lucide-react";

export const CTASection = () => {
  // Start with static values to avoid hydration mismatch
  const [tradeCount, setTradeCount] = useState(12500);
  const [activeTraders, setActiveTraders] = useState(150);


  useEffect(() => {

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTradeCount(Math.floor(Math.random() * 5000) + 10000); // 10000-15000
    setActiveTraders(Math.floor(Math.random() * 100) + 100); // 100-200

    // Simulate live trade counter
    const tradeInterval = setInterval(() => {
      setTradeCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 2000);

    // Simulate active traders fluctuation
    const tradersInterval = setInterval(() => {
      setActiveTraders(prev => {
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
        return Math.max(100, Math.min(250, prev + change)); // Keep between 100-250
      });
    }, 3000);

    return () => {
      clearInterval(tradeInterval);
      clearInterval(tradersInterval);
    };
  }, []);

  return (
    <section className="py-24 bg-[#020420] relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to build your edge?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join traders who are mastering options strategies without risking a single dollar.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/sign-up">
                <Button size="lg" className="rounded-full px-8 h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 border-0">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/trade">
                <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-lg border-white/20 text-white bg-transparent hover:bg-white/10 hover:text-white transition-all duration-300">
                  Try Demo
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Users,
                stat: activeTraders.toString(),
                description: "Traders practicing now",
                live: true,
              },
              {
                icon: TrendingUp,
                stat: "Unlimited",
                description: "Paper trades & strategies",
                live: false,
              },
              {
                icon: Zap,
                stat: tradeCount.toLocaleString(),
                description: "Trades simulated today",
                live: true,
              },
            ].map((item, index) => (
              <motion.div
                key={item.description}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="text-center relative"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4 relative">
                  <item.icon className="h-8 w-8 text-white" />
                  {item.live && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                  )}
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={item.stat}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl font-bold text-white mb-2"
                  >
                    {item.stat}
                  </motion.p>
                </AnimatePresence>
                <p className="text-sm text-gray-400">
                  {item.description}
                  {item.live && <span className="ml-1 text-green-500">●</span>}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
