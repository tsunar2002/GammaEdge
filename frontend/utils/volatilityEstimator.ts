/**
 * Volatility Estimation Utilities
 * 
 * This module provides functions to estimate historical volatility from stock price data.
 * Historical volatility is used as a proxy for implied volatility in the Black-Scholes model.
 */

interface AlpacaBar {
  t: string;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

/**
 * Calculate historical volatility from an array of prices
 * Uses the standard deviation of log returns, annualized
 * 
 * @param prices - Array of closing prices (most recent last)
 * @param annualizationFactor - Factor to annualize volatility (default: sqrt(252) for daily data)
 * @returns Annualized volatility as a decimal (e.g., 0.25 = 25%)
 */
export function estimateHistoricalVolatility(
  prices: number[],
  annualizationFactor: number = Math.sqrt(252)
): number {
  if (prices.length < 2) {
    // Default volatility if insufficient data
    return 0.30; // 30% default
  }
  
  // Calculate log returns
  const logReturns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > 0 && prices[i - 1] > 0) {
      logReturns.push(Math.log(prices[i] / prices[i - 1]));
    }
  }
  
  if (logReturns.length < 2) {
    return 0.30; // Default volatility
  }
  
  // Calculate mean of log returns
  const mean = logReturns.reduce((sum, ret) => sum + ret, 0) / logReturns.length;
  
  // Calculate variance
  const variance = logReturns.reduce((sum, ret) => {
    const diff = ret - mean;
    return sum + diff * diff;
  }, 0) / (logReturns.length - 1);
  
  // Standard deviation
  const stdDev = Math.sqrt(variance);
  
  // Annualize the volatility
  const annualizedVol = stdDev * annualizationFactor;
  
  // Clamp volatility to reasonable range (5% to 200%)
  return Math.max(0.05, Math.min(2.0, annualizedVol));
}

/**
 * Estimate volatility from Alpaca bar data
 * Uses 1-minute bars, so annualization factor is adjusted accordingly
 * 
 * @param bars - Array of Alpaca bars
 * @returns Annualized volatility as a decimal
 */
export function estimateVolatilityFromBars(bars: AlpacaBar[]): number {
  if (bars.length < 2) {
    return 0.30; // Default 30% volatility
  }
  
  // Extract closing prices
  const closingPrices = bars.map(bar => bar.c);
  
  // For 1-minute bars, there are approximately 390 trading minutes per day
  // and 252 trading days per year
  // Annualization factor = sqrt(390 * 252) = sqrt(98,280) ≈ 313.5
  const minutesPerDay = 390;
  const tradingDaysPerYear = 252;
  const annualizationFactor = Math.sqrt(minutesPerDay * tradingDaysPerYear);
  
  return estimateHistoricalVolatility(closingPrices, annualizationFactor);
}

/**
 * Estimate volatility using Parkinson's high-low method
 * This method uses the high and low prices to estimate volatility
 * Generally more efficient than close-to-close for intraday data
 * 
 * @param bars - Array of Alpaca bars
 * @returns Annualized volatility as a decimal
 */
export function estimateParkinsonVolatility(bars: AlpacaBar[]): number {
  if (bars.length < 2) {
    return 0.30; // Default 30% volatility
  }
  
  // Calculate sum of squared log(high/low)
  let sumSquaredLogHL = 0;
  let validBars = 0;
  
  for (const bar of bars) {
    if (bar.h > 0 && bar.l > 0 && bar.h >= bar.l) {
      const logHL = Math.log(bar.h / bar.l);
      sumSquaredLogHL += logHL * logHL;
      validBars++;
    }
  }
  
  if (validBars < 2) {
    return 0.30; // Default volatility
  }
  
  // Parkinson's formula: σ² = (1 / (4n·ln(2))) · Σ[ln(H/L)]²
  const variance = sumSquaredLogHL / (4 * validBars * Math.log(2));
  const volatility = Math.sqrt(variance);
  
  // Annualize (assuming 1-minute bars)
  const minutesPerDay = 390;
  const tradingDaysPerYear = 252;
  const annualizationFactor = Math.sqrt(minutesPerDay * tradingDaysPerYear);
  const annualizedVol = volatility * annualizationFactor;
  
  // Clamp to reasonable range
  return Math.max(0.05, Math.min(2.0, annualizedVol));
}

/**
 * Get a blended volatility estimate using both close-to-close and Parkinson methods
 * This provides a more robust estimate
 * 
 * @param bars - Array of Alpaca bars
 * @returns Annualized volatility as a decimal
 */
export function estimateBlendedVolatility(bars: AlpacaBar[]): number {
  const closeToCloseVol = estimateVolatilityFromBars(bars);
  const parkinsonVol = estimateParkinsonVolatility(bars);
  
  // Weighted average: 60% Parkinson (more efficient), 40% close-to-close
  return 0.6 * parkinsonVol + 0.4 * closeToCloseVol;
}
