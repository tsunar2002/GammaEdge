'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData, Time, CandlestickSeries } from 'lightweight-charts';

interface StockChartProps {
  symbol: string;
}

interface AlpacaBar {
  t: string;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

// Helper to generate ticks for a single candle
class CandleSimulator {
  private targetBar: AlpacaBar;
  private currentPrice: number;
  private startTime: number;
  private duration: number = 60000; // 60 seconds
  private visitedHigh: boolean = false;
  private visitedLow: boolean = false;
  private waypoints: { price: number; time: number }[] = [];
  
  constructor(bar: AlpacaBar) {
    this.targetBar = bar;
    this.currentPrice = bar.o;
    this.startTime = Date.now();
    
    // Plan the path
    // We need to hit Open -> (High/Low) -> (Low/High) -> Close
    // We randomize whether we hit High or Low first
    const highFirst = Math.random() > 0.5;
    
    // Divide the 60s into segments
    // 0s: Open
    // t1: First Extremum
    // t2: Second Extremum
    // 60s: Close
    
    // Randomize t1 and t2 ensuring t1 < t2
    const t1 = 10000 + Math.random() * 15000; // 10-25s
    const t2 = 35000 + Math.random() * 15000; // 35-50s
    
    this.waypoints = [
      { price: bar.o, time: 0 },
      { price: highFirst ? bar.h : bar.l, time: t1 },
      { price: highFirst ? bar.l : bar.h, time: t2 },
      { price: bar.c, time: 60000 }
    ];
  }

  public getNextTick(elapsed: number): number {
    // Find which segment we are in
    let startWP = this.waypoints[0];
    let endWP = this.waypoints[1];
    
    for (let i = 0; i < this.waypoints.length - 1; i++) {
      if (elapsed >= this.waypoints[i].time && elapsed < this.waypoints[i+1].time) {
        startWP = this.waypoints[i];
        endWP = this.waypoints[i+1];
        break;
      }
    }
    
    if (elapsed >= 60000) return this.targetBar.c;

    // Linear interpolation between waypoints
    const segmentDuration = endWP.time - startWP.time;
    const segmentElapsed = elapsed - startWP.time;
    const progress = segmentElapsed / segmentDuration;
    
    const basePrice = startWP.price + (endWP.price - startWP.price) * progress;
    
    // Add volatility/noise
    // We use a combination of volume, body size, top and bottom wick for the noise factor.
    // For now, let's use a simple noise factor relative to the price range.
    const range = this.targetBar.h - this.targetBar.l;
    const noiseMagnitude = range * 0.1; // 10% of range as noise
    const noise = (Math.random() - 0.5) * noiseMagnitude;
    
    let nextPrice = basePrice + noise;
    
    // Clamp to High/Low to ensure we don't violate the candle boundaries too early/late
    // (Though in real life, price could briefly go outside, but for this simulation we want to form THIS candle)
    // Actually, we should clamp to the overall High/Low of the target bar
    nextPrice = Math.max(this.targetBar.l, Math.min(this.targetBar.h, nextPrice));
    
    return nextPrice;
  }
}

export default function StockChart({ symbol }: StockChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const simulationRef = useRef<{
    startTime: number;
    pausedAt: number;
    elapsedBeforePause: number;
    intervalId: NodeJS.Timeout | null;
  }>({ startTime: 0, pausedAt: 0, elapsedBeforePause: 0, intervalId: null });

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#D9D9D9',
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.5)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.5)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    chartRef.current = chart;
    seriesRef.current = series as ISeriesApi<"Candlestick">;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  const simulationState = useRef<{
    bars: AlpacaBar[];
    currentBarIndex: number;
    currentSimulator: CandleSimulator | null;
    currentCandle: any;
  }>({
    bars: [],
    currentBarIndex: 0,
    currentSimulator: null,
    currentCandle: null,
  });

  useEffect(() => {
    if (!symbol) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setIsFinished(false);
      try {
        const response = await fetch(`/api/stocks?symbol=${symbol}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch data');
        }
        
        if (!data.bars || data.bars.length === 0) {
            setError('No data available for this symbol');
            setLoading(false);
            return;
        }

        simulationState.current.bars = data.bars;
        simulationState.current.currentBarIndex = 0;
        simulationState.current.currentSimulator = null;
        simulationState.current.currentCandle = null;
        
        // Clear chart
        seriesRef.current?.setData([]);
        
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const stopSimulation = () => {
      if (simulationRef.current.intervalId) {
        clearTimeout(simulationRef.current.intervalId);
        simulationRef.current.intervalId = null;
      }
      if (timeoutId) clearTimeout(timeoutId);
    };

    const runSimulationStep = () => {
        const state = simulationState.current;
        if (state.currentBarIndex >= state.bars.length) {
            setIsPlaying(false);
            setIsFinished(true);
            stopSimulation();
            return;
        }

        if (!state.currentSimulator) {
            // Start new bar
            const targetBar = state.bars[state.currentBarIndex];
            state.currentSimulator = new CandleSimulator(targetBar);
            simulationRef.current.elapsedBeforePause = 0;
            simulationRef.current.startTime = Date.now();
            
            const barTime = new Date(targetBar.t).getTime() / 1000 as Time;
            state.currentCandle = {
                time: barTime,
                open: targetBar.o,
                high: targetBar.o,
                low: targetBar.o,
                close: targetBar.o
            };
            seriesRef.current?.update(state.currentCandle);
        } else {
            // Resume logic if needed, but mainly we just rely on elapsed time
            // If we just resumed, we need to adjust startTime
             // This is handled by the interval logic below
        }
    };

    if (isPlaying && !loading && !error) {
        // Initialize if needed
        if (!simulationState.current.currentSimulator && simulationState.current.bars.length > 0) {
            runSimulationStep();
        } else if (simulationState.current.bars.length > 0) {
             // Resume: adjust start time to account for pause
             simulationRef.current.startTime = Date.now() - simulationRef.current.elapsedBeforePause;
        }

        let lastTickTime = Date.now();

      const loop = () => {
        if (!isMounted) return;
        const state = simulationState.current;

        const now = Date.now();
        if (state.bars.length === 0 || state.currentBarIndex >= state.bars.length) {
            setIsPlaying(false);
            setIsFinished(true);
            stopSimulation();
            return;
        }

        const delta = now - lastTickTime;
        lastTickTime = now;

        const effectiveDelta = delta * speed;
        simulationRef.current.elapsedBeforePause += effectiveDelta;
        const elapsed = simulationRef.current.elapsedBeforePause;

        if (elapsed >= 60000) {
            // Bar complete
            const targetBar = state.bars[state.currentBarIndex];
            seriesRef.current?.update({
                time: new Date(targetBar.t).getTime() / 1000 as Time,
                open: targetBar.o,
                high: targetBar.h,
                low: targetBar.l,
                close: targetBar.c
            });

            state.currentBarIndex++;
            state.currentSimulator = null; // Reset for next bar
            
            if (state.currentBarIndex >= state.bars.length) {
                setIsPlaying(false);
                setIsFinished(true);
                stopSimulation();
                return;
            }
            
            // Start next bar immediately
            runSimulationStep();
            // The runSimulationStep will start its own loop/tick if needed, 
            // but actually we are IN the loop.
            // We should just continue the loop.
            // But runSimulationStep initializes the new bar.
            // Let's just schedule the next tick.
            
            // Actually, runSimulationStep calls update() for the OPEN of the new bar.
            // We need to make sure we don't double-schedule.
            // Let's refine runSimulationStep to NOT start the loop, just init state.
            
        } else {
            if (state.currentSimulator && state.currentCandle) {
                const price = state.currentSimulator.getNextTick(elapsed);
                
                state.currentCandle.close = price;
                state.currentCandle.high = Math.max(state.currentCandle.high, price);
                state.currentCandle.low = Math.min(state.currentCandle.low, price);
                
                seriesRef.current?.update(state.currentCandle);
                setCurrentTime(new Date(state.bars[state.currentBarIndex].t).toLocaleString());
            }
        }

        // Schedule next tick
        // Random delay between 1000ms and 3000ms, adjusted by speed
        const minDelay = 1000;
        const maxDelay = 3000;
        const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;
        const adjustedDelay = randomDelay / speed;
        
        timeoutId = setTimeout(loop, adjustedDelay);
        simulationRef.current.intervalId = timeoutId; // Store it to clear later
      };

      loop();
    }

    return () => {
        isMounted = false;
        stopSimulation();
    };
  }, [isPlaying, speed, loading, error]);

  const handlePlayToggle = () => {
    if (isFinished) {
        // Restart
        simulationState.current.currentBarIndex = 0;
        simulationState.current.currentSimulator = null;
        simulationState.current.currentCandle = null;
        seriesRef.current?.setData([]);
        setIsFinished(false);
        setIsPlaying(true);
    } else {
        setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="w-full h-full relative flex flex-col">
      <div className="flex justify-between items-center mb-4 p-2 bg-zinc-100 dark:bg-zinc-800 rounded">
        <div className="flex items-center gap-4">
            <button
                onClick={handlePlayToggle}
                className={`px-4 py-2 rounded font-bold ${isPlaying ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
            >
                {isPlaying ? 'Pause' : isFinished ? 'Restart Simulation' : 'Start Simulation'}
            </button>
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Speed:</span>
                {[1, 5, 10, 30, 60, 300].map(s => (
                    <button
                        key={s}
                        onClick={() => setSpeed(s)}
                        className={`px-2 py-1 text-xs rounded ${speed === s ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-700'}`}
                    >
                        {s}x
                    </button>
                ))}
            </div>
        </div>
        <div className="text-sm font-mono">
            {currentTime}
        </div>
      </div>
      
      <div className="relative flex-1 min-h-[500px]">
        {loading && <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 text-white">Loading...</div>}
        {error && <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 text-red-500">{error}</div>}
        <div ref={chartContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
}
