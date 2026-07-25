"use client";
import React from "react";

const marqueeData = [
  { symbol: "SPY 510C", strike: "$510.00", iv: "14.2%", change: "+142.5%", isPositive: true, price: "$4.85" },
  { symbol: "QQQ 440P", strike: "$440.00", iv: "18.5%", change: "-38.2%", isPositive: false, price: "$2.10" },
  { symbol: "NVDA 900C", strike: "$900.00", iv: "48.1%", change: "+310.4%", isPositive: true, price: "$24.50" },
  { symbol: "AAPL 185C", strike: "$185.00", iv: "16.8%", change: "+85.2%", isPositive: true, price: "$3.20" },
  { symbol: "TSLA 175P", strike: "$175.00", iv: "42.0%", change: "+112.0%", isPositive: true, price: "$6.40" },
  { symbol: "AMZN 180C", strike: "$180.00", iv: "21.3%", change: "-15.4%", isPositive: false, price: "$1.95" },
  { symbol: "MSFT 425C", strike: "$425.00", iv: "17.9%", change: "+64.1%", isPositive: true, price: "$5.10" },
  { symbol: "META 500P", strike: "$500.00", iv: "29.4%", change: "-45.0%", isPositive: false, price: "$8.30" },
];

export const TickerMarquee = () => {
  const items = [...marqueeData, ...marqueeData];

  return (
    <div className="w-full bg-[#03060d] border-y border-cyan-500/10 py-3 overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#03060d] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#03060d] to-transparent z-10 pointer-events-none" />
      
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {items.map((item, index) => (
          <div
            key={`${item.symbol}-${index}`}
            className="flex items-center gap-3 mx-4 px-4 py-1.5 rounded-lg bg-[#070d1a]/80 border border-white/5 text-xs shadow-sm hover:border-cyan-500/30 transition-all cursor-pointer"
          >
            <span className="font-bold text-white font-mono">{item.symbol}</span>
            <span className="text-gray-400 font-mono">{item.price}</span>
            <span className="text-[10px] text-gray-500 font-mono">IV {item.iv}</span>
            <span
              className={`font-semibold font-mono px-1.5 py-0.5 rounded text-[10px] ${
                item.isPositive
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              }`}
            >
              {item.change}
            </span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
      `}</style>
    </div>
  );
};
