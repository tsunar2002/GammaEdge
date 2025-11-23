/**
 * TypeScript type definitions for options pricing
 */

export interface OptionPricingParams {
  stockPrice: number;        // Current stock price (S)
  strikePrice: number;       // Strike price (K)
  timeToExpiry: number;      // Time to expiration in years (T)
  riskFreeRate: number;      // Risk-free interest rate (r)
  volatility: number;        // Implied volatility (sigma)
  optionType: 'call' | 'put';
  bidAskSpread?: number;     // Optional spread percentage (default 0.02 = 2%)
}

export interface Greeks {
  delta: number;    // Rate of change of option price with respect to stock price
  gamma: number;    // Rate of change of delta with respect to stock price
  theta: number;    // Rate of change of option price with respect to time (per day)
  vega: number;     // Rate of change of option price with respect to volatility
  rho: number;      // Rate of change of option price with respect to interest rate
}

export interface OptionPrice {
  theoreticalPrice: number;  // Black-Scholes theoretical price
  bid: number;               // Bid price (theoretical - spread/2)
  ask: number;               // Ask price (theoretical + spread/2)
  greeks: Greeks;            // Option Greeks
}

export type OptionType = 'call' | 'put';
