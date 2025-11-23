/**
 * Simulation Context Utilities
 * 
 * This module provides utilities for managing the simulation context.
 * In historical simulation mode, we replay past market data as if it's happening live.
 * 
 * Key Concept: The "simulation date" is the date we're simulating (e.g., Monday),
 * while the "current date" is today's actual date (e.g., Tuesday).
 */

/**
 * Represents the current state of the simulation
 */
export interface SimulationContext {
  simulationDate: Date;      // The date being simulated (e.g., Monday)
  currentBarIndex: number;   // Current position in the data
  totalBars: number;         // Total number of bars in the simulation
  isLive: boolean;          // Whether simulation is currently running
}

/**
 * Get the simulation date from stock bar data
 * This extracts the date from the first bar in the dataset
 * 
 * @param bars - Array of stock bars
 * @returns The date of the first bar (simulation start date)
 */
export function getSimulationStartDate(bars: Array<{ t: string }>): Date {
  if (bars.length === 0) {
    throw new Error('Cannot get simulation date from empty bars array');
  }
  
  return new Date(bars[0].t);
}

/**
 * Get the current simulation time based on the current bar
 * 
 * @param bars - Array of stock bars
 * @param currentBarIndex - Current position in the simulation
 * @returns The timestamp of the current bar
 */
export function getCurrentSimulationTime(
  bars: Array<{ t: string }>,
  currentBarIndex: number
): Date {
  if (currentBarIndex >= bars.length) {
    // Simulation finished, return last bar time
    return new Date(bars[bars.length - 1].t);
  }
  
  return new Date(bars[currentBarIndex].t);
}

/**
 * Calculate time to expiry relative to simulation time (not real time)
 * 
 * IMPORTANT: In historical simulation mode, we need to calculate time to expiry
 * based on the simulation date, not today's date.
 * 
 * @param expirationDate - The option expiration date
 * @param simulationDate - The current simulation date (from bar data)
 * @returns Time to expiry in years
 */
export function getSimulationTimeToExpiry(
  expirationDate: Date,
  simulationDate: Date
): number {
  const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
  const timeDiff = expirationDate.getTime() - simulationDate.getTime();
  const yearsToExpiry = timeDiff / msPerYear;
  
  // Minimum 1 hour to avoid division by zero
  const oneHourInYears = 1 / (365.25 * 24);
  return Math.max(oneHourInYears, yearsToExpiry);
}

/**
 * Check if an option has expired relative to simulation time
 * 
 * @param expirationDate - The option expiration date
 * @param simulationDate - The current simulation date
 * @returns true if option has expired in the simulation
 */
export function isOptionExpired(
  expirationDate: Date,
  simulationDate: Date
): boolean {
  return simulationDate >= expirationDate;
}

/**
 * Format simulation date for display
 * 
 * @param date - Simulation date
 * @returns Formatted string like "Monday, Nov 18, 2024 10:30 AM"
 */
export function formatSimulationDate(date: Date): string {
  return date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/New_York',
  });
}

/**
 * Get the market date for the simulation
 * This is the date of the historical data being used
 * 
 * For example, if today is Tuesday and we're using Monday's data,
 * this returns Monday's date.
 * 
 * @returns The date of the historical data (yesterday or earlier)
 */
export function getMarketDataDate(): Date {
  // This matches the logic in /api/stocks route
  // We always use yesterday's data (or earlier if weekend/holiday)
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  
  return yesterday;
}
