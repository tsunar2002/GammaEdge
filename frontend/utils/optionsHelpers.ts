/**
 * Options Helper Utilities
 * 
 * This module provides helper functions for options calculations including
 * date handling, strike price generation, and risk-free rate retrieval.
 */

/**
 * Calculate time to expiry in years from an expiration date
 * 
 * @param expirationDate - The expiration date of the option
 * @param currentDate - Optional current date (defaults to now)
 * @returns Time to expiry in years (as a decimal)
 */
export function getTimeToExpiry(
  expirationDate: Date,
  currentDate: Date = new Date()
): number {
  // Calculate difference in milliseconds
  const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
  const timeDiff = expirationDate.getTime() - currentDate.getTime();
  
  // Convert to years
  const yearsToExpiry = timeDiff / msPerYear;
  
  // Return at least 1 hour (to avoid division by zero in Black-Scholes)
  const oneHourInYears = 1 / (365.25 * 24);
  return Math.max(oneHourInYears, yearsToExpiry);
}

/**
 * Get the next Friday (4:00 PM ET) for weekly options expiration
 * 
 * IMPORTANT: For historical simulation mode, pass the simulation date
 * to calculate expiration relative to that date, not today's date.
 * 
 * @param fromDate - Date to calculate from (defaults to now, but should be simulation date in historical mode)
 * @returns Date object set to next Friday at 4:00 PM ET
 */
export function getNextFriday(fromDate: Date = new Date()): Date {
  const date = new Date(fromDate);
  
  // Convert to ET timezone
  const etDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  
  const dayOfWeek = etDate.getDay(); // 0 = Sunday, 5 = Friday
  const currentHour = etDate.getHours();
  
  let daysUntilFriday: number;
  
  if (dayOfWeek === 5) {
    // It's Friday
    if (currentHour < 16) {
      // Before 4 PM, use today
      daysUntilFriday = 0;
    } else {
      // After 4 PM, use next Friday
      daysUntilFriday = 7;
    }
  } else if (dayOfWeek === 6) {
    // Saturday
    daysUntilFriday = 6;
  } else {
    // Sunday (0) through Thursday (4)
    daysUntilFriday = 5 - dayOfWeek;
  }
  
  const nextFriday = new Date(date);
  nextFriday.setDate(date.getDate() + daysUntilFriday);
  nextFriday.setHours(16, 0, 0, 0); // 4:00 PM ET
  
  return nextFriday;
}

/**
 * Generate strike prices around the current stock price
 * Creates a symmetric range of strikes with specified interval
 * 
 * @param currentPrice - Current stock price
 * @param count - Number of strikes to generate on each side (default: 10)
 * @param interval - Price interval between strikes (default: auto-calculated)
 * @returns Array of strike prices sorted ascending
 */
export function generateStrikePrices(
  currentPrice: number,
  count: number = 5,  // Changed from 10 to 5
  interval?: number
): number[] {
  // Auto-calculate interval based on stock price if not provided
  let strikeInterval = interval;
  if (!strikeInterval) {
    if (currentPrice < 120) {
      strikeInterval = 1.0;
    } else {
      strikeInterval = 2.5;
    }
  }
  
  // Round current price to nearest strike interval (no rounding, keep exact values)
  const atmStrike = Math.round(currentPrice / strikeInterval) * strikeInterval;
  
  const strikes: number[] = [];
  
  // Generate strikes below ATM
  for (let i = count; i >= 1; i--) {
    strikes.push(atmStrike - i * strikeInterval);
  }
  
  // Add ATM strike
  strikes.push(atmStrike);
  
  // Generate strikes above ATM
  for (let i = 1; i <= count; i++) {
    strikes.push(atmStrike + i * strikeInterval);
  }
  
  // Filter out negative strikes (no rounding to preserve values like 272.5)
  return strikes.filter(strike => strike > 0);
}

/**
 * Get the current risk-free rate
 * For simulation purposes, this returns a hardcoded value
 * In production, this could fetch the current T-Bill rate from an API
 * 
 * @returns Risk-free rate as a decimal (e.g., 0.045 = 4.5%)
 */
export function getCurrentRiskFreeRate(): number {
  // Using approximate current 3-month T-Bill rate
  // In a production system, this would be fetched from an API
  return 0.045; // 4.5%
}

/**
 * Format option symbol in standard format
 * Example: AAPL250124C00150000 (AAPL Jan 24, 2025 $150 Call)
 * 
 * @param ticker - Stock ticker symbol
 * @param expirationDate - Expiration date
 * @param optionType - 'call' or 'put'
 * @param strikePrice - Strike price
 * @returns Formatted option symbol
 */
export function formatOptionSymbol(
  ticker: string,
  expirationDate: Date,
  optionType: 'call' | 'put',
  strikePrice: number
): string {
  const year = expirationDate.getFullYear().toString().slice(-2);
  const month = String(expirationDate.getMonth() + 1).padStart(2, '0');
  const day = String(expirationDate.getDate()).padStart(2, '0');
  const type = optionType === 'call' ? 'C' : 'P';
  const strike = String(Math.round(strikePrice * 1000)).padStart(8, '0');
  
  return `${ticker.toUpperCase()}${year}${month}${day}${type}${strike}`;
}

/**
 * Check if the market is currently open
 * US stock market hours: 9:30 AM - 4:00 PM ET, Monday-Friday
 * 
 * @param date - Optional date to check (defaults to now)
 * @returns true if market is open, false otherwise
 */
export function isMarketOpen(date: Date = new Date()): boolean {
  // Convert to ET timezone
  const etDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  
  const dayOfWeek = etDate.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Check if weekend
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false;
  }
  
  const hour = etDate.getHours();
  const minute = etDate.getMinutes();
  const totalMinutes = hour * 60 + minute;
  
  const marketOpen = 9 * 60 + 30;  // 9:30 AM
  const marketClose = 16 * 60;      // 4:00 PM
  
  return totalMinutes >= marketOpen && totalMinutes < marketClose;
}
