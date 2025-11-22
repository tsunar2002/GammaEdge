'use client';
import StockSearch from "@/components/StockSearch";
import StockChart from "@/components/StockChart";
import { useState } from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Stock Data Viewer</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Search for 1-minute stock data from Alpaca Markets
          </p>
        </div>
        <StockSearchWrapper />
      </div>
    </div>
  );
}

function StockSearchWrapper() {
  const [symbol, setSymbol] = useState<string | null>(null);

  if (symbol) {
    return (
      <div className="space-y-4">
        <button 
          onClick={() => setSymbol(null)}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          ← Back to Search
        </button>
        <div className="p-4 bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-2xl font-bold mb-4 px-2">{symbol} Live Simulation</h2>
            <StockChart symbol={symbol} />
        </div>
      </div>
    );
  }

  return <StockSearch onSelect={(s) => setSymbol(s)} />;
}
