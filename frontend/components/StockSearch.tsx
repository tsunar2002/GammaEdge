'use client';

import { useState } from 'react';

interface StockBar {
  t: string;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
  n: number;
  vw: number;
}

interface StockData {
  bars: StockBar[];
  symbol: string;
  date: string;
  error?: string;
}

function sanitizeInput(input: string): string {
  return input.trim().toUpperCase().replace(/[^A-Z]/g, '').slice(0, 10);
}

import { Search } from 'lucide-react';

interface StockSearchProps {
  onSelect?: (symbol: string) => void;
}

export default function StockSearch({ onSelect }: StockSearchProps) {
  const [symbol, setSymbol] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<StockData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const sanitized = sanitizeInput(symbol);
    if (!sanitized) {
      setError('Please enter a valid stock symbol (1-10 letters)');
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`/api/stocks?symbol=${encodeURIComponent(sanitized)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: StockData = await response.json();

      if (result.error) {
        setError(result.error);
        setData(null);
      } else {
        setData(result);
        setError(null);
        if (onSelect) {
          onSelect(result.symbol);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stock data');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 10);
    setSymbol(value);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSearch} className="flex items-center gap-4">
        <input
          id="symbol"
          type="text"
          value={symbol}
          onChange={handleInputChange}
          placeholder="Enter stock symbol (e.g., AAPL)"
          className="w-full px-8 py-3 bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-lg rounded-full backdrop-blur-sm"
          disabled={loading}
          maxLength={10}
          pattern="[A-Z]{1,10}"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={loading || !symbol.trim()}
          className="px-10 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-full shadow-lg hover:shadow-blue-500/25 whitespace-nowrap"
        >
          {loading ? '...' : 'Trade'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center backdrop-blur-sm">
          {error}
        </div>
      )}
    </div>
  );
}
