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
      <form onSubmit={handleSearch} className="flex gap-4">
        <input
          id="symbol"
          type="text"
          value={symbol}
          onChange={handleInputChange}
          placeholder="Enter stock symbol (e.g., AAPL, TSLA)"
          className="flex-1 px-8 py-5 bg-white border border-gray-200 text-black placeholder:text-gray-400 focus:outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5 transition-all text-lg rounded-2xl shadow-sm"
          disabled={loading}
          maxLength={10}
          pattern="[A-Z]{1,10}"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={loading || !symbol.trim()}
          className="px-10 py-5 bg-black text-white hover:bg-gray-800 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
          {error}
        </div>
      )}
    </div>
  );
}
