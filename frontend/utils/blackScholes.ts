/**
 * Black-Scholes Options Pricing Model
 * 
 * This module implements the Black-Scholes model for pricing European-style options
 * and calculating option Greeks (Delta, Gamma, Theta, Vega, Rho).
 */

import { OptionPricingParams, OptionPrice, Greeks, OptionType } from './optionsTypes';

/**
 * Cumulative distribution function for the standard normal distribution
 * Uses the Abramowitz and Stegun approximation (accurate to ~7 decimal places)
 */
export function normalCDF(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const probability = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  
  return x > 0 ? 1 - probability : probability;
}

/**
 * Probability density function for the standard normal distribution
 */
export function normalPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

/**
 * Calculate d1 parameter in Black-Scholes formula
 * d1 = [ln(S/K) + (r + σ²/2)T] / (σ√T)
 */
export function calculateD1(
  S: number,  // Stock price
  K: number,  // Strike price
  T: number,  // Time to expiry (years)
  r: number,  // Risk-free rate
  sigma: number  // Volatility
): number {
  if (T <= 0) return S >= K ? Infinity : -Infinity;
  if (sigma <= 0) return S >= K ? Infinity : -Infinity;
  
  const numerator = Math.log(S / K) + (r + 0.5 * sigma * sigma) * T;
  const denominator = sigma * Math.sqrt(T);
  
  return numerator / denominator;
}

/**
 * Calculate d2 parameter in Black-Scholes formula
 * d2 = d1 - σ√T
 */
export function calculateD2(
  d1: number,
  T: number,     // Time to expiry (years)
  sigma: number  // Volatility
): number {
  if (T <= 0) return d1;
  return d1 - sigma * Math.sqrt(T);
}

/**
 * Calculate call option price using Black-Scholes formula
 * C = S·N(d1) - K·e^(-rT)·N(d2)
 */
export function calculateCallPrice(
  S: number,     // Stock price
  K: number,     // Strike price
  T: number,     // Time to expiry (years)
  r: number,     // Risk-free rate
  sigma: number  // Volatility
): number {
  if (T <= 0) return Math.max(0, S - K);
  if (S <= 0) return 0;
  if (K <= 0) return S;
  
  const d1 = calculateD1(S, K, T, r, sigma);
  const d2 = calculateD2(d1, T, sigma);
  
  const callPrice = S * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
  
  return Math.max(0, callPrice);
}

/**
 * Calculate put option price using Black-Scholes formula
 * P = K·e^(-rT)·N(-d2) - S·N(-d1)
 */
export function calculatePutPrice(
  S: number,     // Stock price
  K: number,     // Strike price
  T: number,     // Time to expiry (years)
  r: number,     // Risk-free rate
  sigma: number  // Volatility
): number {
  if (T <= 0) return Math.max(0, K - S);
  if (S <= 0) return K * Math.exp(-r * T);
  if (K <= 0) return 0;
  
  const d1 = calculateD1(S, K, T, r, sigma);
  const d2 = calculateD2(d1, T, sigma);
  
  const putPrice = K * Math.exp(-r * T) * normalCDF(-d2) - S * normalCDF(-d1);
  
  return Math.max(0, putPrice);
}

/**
 * Calculate Delta (∂V/∂S)
 * Call: N(d1)
 * Put: N(d1) - 1
 */
export function calculateDelta(
  optionType: OptionType,
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number
): number {
  if (T <= 0) {
    if (optionType === 'call') {
      return S > K ? 1 : 0;
    } else {
      return S < K ? -1 : 0;
    }
  }
  
  const d1 = calculateD1(S, K, T, r, sigma);
  
  if (optionType === 'call') {
    return normalCDF(d1);
  } else {
    return normalCDF(d1) - 1;
  }
}

/**
 * Calculate Gamma (∂²V/∂S²)
 * Gamma = N'(d1) / (S·σ·√T)
 * Same for both calls and puts
 */
export function calculateGamma(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number
): number {
  if (T <= 0 || S <= 0) return 0;
  
  const d1 = calculateD1(S, K, T, r, sigma);
  const gamma = normalPDF(d1) / (S * sigma * Math.sqrt(T));
  
  return gamma;
}

/**
 * Calculate Theta (∂V/∂t)
 * Theta represents the time decay per year, converted to per day
 * Call: -[S·N'(d1)·σ / (2√T)] - r·K·e^(-rT)·N(d2)
 * Put: -[S·N'(d1)·σ / (2√T)] + r·K·e^(-rT)·N(-d2)
 */
export function calculateTheta(
  optionType: OptionType,
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number
): number {
  if (T <= 0) return 0;
  
  const d1 = calculateD1(S, K, T, r, sigma);
  const d2 = calculateD2(d1, T, sigma);
  
  const term1 = -(S * normalPDF(d1) * sigma) / (2 * Math.sqrt(T));
  
  let theta: number;
  if (optionType === 'call') {
    const term2 = -r * K * Math.exp(-r * T) * normalCDF(d2);
    theta = term1 + term2;
  } else {
    const term2 = r * K * Math.exp(-r * T) * normalCDF(-d2);
    theta = term1 + term2;
  }
  
  // Convert from per year to per day
  return theta / 365;
}

/**
 * Calculate Vega (∂V/∂σ)
 * Vega = S·√T·N'(d1)
 * Same for both calls and puts
 * Returns vega per 1% change in volatility
 */
export function calculateVega(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number
): number {
  if (T <= 0) return 0;
  
  const d1 = calculateD1(S, K, T, r, sigma);
  const vega = S * Math.sqrt(T) * normalPDF(d1);
  
  // Return vega per 1% change in volatility (divide by 100)
  return vega / 100;
}

/**
 * Calculate Rho (∂V/∂r)
 * Call: K·T·e^(-rT)·N(d2)
 * Put: -K·T·e^(-rT)·N(-d2)
 * Returns rho per 1% change in interest rate
 */
export function calculateRho(
  optionType: OptionType,
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number
): number {
  if (T <= 0) return 0;
  
  const d2 = calculateD2(calculateD1(S, K, T, r, sigma), T, sigma);
  
  let rho: number;
  if (optionType === 'call') {
    rho = K * T * Math.exp(-r * T) * normalCDF(d2);
  } else {
    rho = -K * T * Math.exp(-r * T) * normalCDF(-d2);
  }
  
  // Return rho per 1% change in interest rate (divide by 100)
  return rho / 100;
}

/**
 * Calculate all Greeks at once for efficiency
 */
export function calculateAllGreeks(
  optionType: OptionType,
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number
): Greeks {
  return {
    delta: calculateDelta(optionType, S, K, T, r, sigma),
    gamma: calculateGamma(S, K, T, r, sigma),
    theta: calculateTheta(optionType, S, K, T, r, sigma),
    vega: calculateVega(S, K, T, r, sigma),
    rho: calculateRho(optionType, S, K, T, r, sigma),
  };
}

/**
 * Main pricing function that calculates option price with bid/ask spread
 */
export function priceOption(params: OptionPricingParams): OptionPrice {
  const {
    stockPrice,
    strikePrice,
    timeToExpiry,
    riskFreeRate,
    volatility,
    optionType,
    bidAskSpread = 0.02, // Default 2% spread
  } = params;
  
  // Calculate theoretical price
  const theoreticalPrice = optionType === 'call'
    ? calculateCallPrice(stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility)
    : calculatePutPrice(stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility);
  
  // Calculate bid/ask prices
  const spreadAmount = theoreticalPrice * bidAskSpread;
  const bid = Math.max(0, theoreticalPrice - spreadAmount / 2);
  const ask = theoreticalPrice + spreadAmount / 2;
  
  // Calculate Greeks
  const greeks = calculateAllGreeks(
    optionType,
    stockPrice,
    strikePrice,
    timeToExpiry,
    riskFreeRate,
    volatility
  );
  
  return {
    theoreticalPrice: Math.round(theoreticalPrice * 100) / 100,
    bid: Math.round(bid * 100) / 100,
    ask: Math.round(ask * 100) / 100,
    greeks: {
      delta: Math.round(greeks.delta * 10000) / 10000,
      gamma: Math.round(greeks.gamma * 10000) / 10000,
      theta: Math.round(greeks.theta * 100) / 100,
      vega: Math.round(greeks.vega * 100) / 100,
      rho: Math.round(greeks.rho * 100) / 100,
    },
  };
}
