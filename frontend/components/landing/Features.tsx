"use client";
import React from "react";
import { motion } from "framer-motion";
import { LineChart, History, Zap, Shield } from "lucide-react";

const features = [
  {
    title: "Historical Simulation",
    description: "Replay market conditions from any date in the past. Test how your strategies would have performed during major market events.",
    icon: History,
  },
  {
    title: "Real-time Analytics",
    description: "Get instant feedback on your Greeks (Delta, Gamma, Theta, Vega) and P&L as you trade.",
    icon: LineChart,
  },
  {
    title: "Risk-Free Environment",
    description: "Trade with virtual paper money. Make mistakes, learn from them, and refine your edge without losing a cent.",
    icon: Shield,
  },
  {
    title: "Lightning Fast",
    description: "Built on a high-performance engine to ensure smooth charting and rapid execution simulation.",
    icon: Zap,
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Everything you need to succeed.</h2>
          <p className="text-lg text-gray-500">
            GammaEdge provides professional-grade tools for traders of all levels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6 text-black">
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
