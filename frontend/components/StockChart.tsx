'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ColorType, createChart, IChartApi, ISeriesApi, CandlestickData, Time, CandlestickSeries } from 'lightweight-charts';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface StockChartProps {
  symbol: string;
  onPriceUpdate?: (price: number) => void;
  onTimeUpdate?: (date: Date) => void;
  onSimulationStart?: () => void;
  onSimulationEnd?: () => void;
  selectedDate: Date | null;
  onDateSelect: (date: Date | null) => void;
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

export default function StockChart({ 
  symbol, 
  onPriceUpdate, 
  onTimeUpdate, 
  onSimulationStart, 
  onSimulationEnd,
  selectedDate,
  onDateSelect
}: StockChartProps) {
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

  // Calculate date limits
  const today = new Date();
  const maxDate = today.toISOString().split('T')[0];
  
  // For month navigation: fromDate should be first day of 3 months ago
  const minDateObj = new Date(today.getFullYear(), today.getMonth() - 3, 1);
  const minDate = minDateObj.toISOString().split('T')[0];
  
  // toDate should be last day of current month to prevent navigating to future months
  const maxDateObj = new Date(today.getFullYear(), today.getMonth() + 1, 0);

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
      height: chartContainerRef.current.clientHeight,
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
        chart.applyOptions({ 
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight
        });
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
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
        let url = `/api/stocks?symbol=${symbol}`;
        if (selectedDate) {
            url += `&date=${selectedDate.toISOString().split('T')[0]}`;
        }
        const response = await fetch(url);
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
  }, [symbol, selectedDate]);

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
            // Resume logic if needed
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
            
        } else {
            if (state.currentSimulator && state.currentCandle) {
                const price = state.currentSimulator.getNextTick(elapsed);
                
                state.currentCandle.close = price;
                state.currentCandle.high = Math.max(state.currentCandle.high, price);
                state.currentCandle.low = Math.min(state.currentCandle.low, price);
                
                seriesRef.current?.update(state.currentCandle);
                setCurrentTime(new Date(state.bars[state.currentBarIndex].t).toLocaleString());
                
                // Emit current price for real-time option pricing
                onPriceUpdate?.(price);
                
                // Emit current simulation time
                if (state.currentCandle) {
                  onTimeUpdate?.(new Date(state.currentCandle.time * 1000));
                }
            }
        }

        // Schedule next tick
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
  }, [isPlaying, speed, loading, error, onPriceUpdate, onTimeUpdate]);

  const handlePlayToggle = () => {
    if (isFinished) {
        // Restart
        simulationState.current.currentBarIndex = 0;
        simulationState.current.currentSimulator = null;
        simulationState.current.currentCandle = null;
        seriesRef.current?.setData([]);
        setIsFinished(false);
        setIsPlaying(true);
        onSimulationStart?.(); // Notify parent
    } else {
        const wasNotPlaying = !isPlaying;
        setIsPlaying(!isPlaying);
        if (wasNotPlaying && simulationState.current.currentBarIndex === 0) {
          onSimulationStart?.(); // Notify parent on first start
        }
    }
  };

  const hasStarted = isPlaying || isFinished || simulationState.current.currentBarIndex > 0;

  return (
    <div className="w-full h-full relative flex flex-col bg-black">
      {/* Simulation Controls - Only show when started */}
      {hasStarted && (
        <div className="flex justify-between items-center p-3 bg-[#0E0E0E] border-b border-[#2B2B2B]">
          <div className="flex items-center gap-6">
              <button
                  onClick={handlePlayToggle}
                  className={`px-6 py-1.5 rounded-md font-medium text-sm transition-all ${
                      isPlaying 
                          ? 'bg-[#2A2E39] hover:bg-[#363A45] text-white border border-transparent' 
                          : isFinished 
                              ? 'bg-[#2962FF] hover:bg-[#1E53E5] text-white' 
                              : 'bg-[#2962FF] hover:bg-[#1E53E5] text-white'
                  }`}
              >
                  {isPlaying ? 'Pause' : isFinished ? 'Restart' : 'Resume'}
              </button>
              
              <div className="flex items-center gap-3 bg-[#1E1E1E] rounded-lg p-1">
                  <span className="text-xs font-medium text-zinc-500 px-2">SPEED</span>
                  {[1, 5, 10, 30, 60, 300].map(s => (
                      <button
                          key={s}
                          onClick={() => setSpeed(s)}
                          className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${
                              speed === s 
                                  ? 'bg-[#2962FF] text-white shadow-sm' 
                                  : 'text-zinc-400 hover:text-white hover:bg-[#2A2E39]'
                          }`}
                      >
                          {s}x
                      </button>
                  ))}
              </div>
          </div>
          <div className="text-sm font-mono text-[#D9D9D9] bg-[#1E1E1E] px-3 py-1 rounded">
              {currentTime}
          </div>
        </div>
      )}
      
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {loading && <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 text-white">Loading...</div>}
        {error && <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 text-red-500">{error}</div>}
        
        {/* Start Simulation Overlay */}
        {!hasStarted && !loading && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10 gap-8">
            <div className="flex flex-col items-center gap-3 w-full max-w-xs">
                <label className="text-zinc-400 text-sm font-medium">Select Trading Date (Optional)</label>
                <div className="relative w-full">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal bg-[#1E1E1E] border-[#2B2B2B] text-white hover:bg-[#2A2E39] hover:text-white",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-[#1E1E1E] border-[#2B2B2B] text-white" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate || undefined}
                          onSelect={(date) => onDateSelect(date || null)}
                          disabled={(date) => {
                            const today = new Date();
                            const threeMonthsAgo = new Date();
                            threeMonthsAgo.setMonth(today.getMonth() - 3);
                            return date > today || date < threeMonthsAgo;
                          }}
                          fromDate={minDateObj}
                          toDate={maxDateObj}
                          initialFocus
                          className="bg-[#1E1E1E] text-white"
                        />
                      </PopoverContent>
                    </Popover>
                </div>
                <p className="text-xs text-zinc-500 text-center">
                    Limit: Past 3 months. Leave empty for recent data.
                </p>
            </div>
            <button
              onClick={handlePlayToggle}
              className="px-8 py-4 bg-[#2962FF] hover:bg-[#1E53E5] text-white text-xl font-bold rounded-lg transition-all shadow-lg hover:shadow-[#2962FF]/20 hover:scale-105 active:scale-95"
            >
              Start Simulation
            </button>
          </div>
        )}

        {/* Restart Simulation Overlay */}
        {isFinished && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10 backdrop-blur-sm">
            <button
              onClick={handlePlayToggle}
              className="px-8 py-4 bg-[#2962FF] hover:bg-[#1E53E5] text-white text-xl font-bold rounded-lg transition-colors shadow-lg"
            >
              Restart Simulation
            </button>
          </div>
        )}

        <div ref={chartContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
}
