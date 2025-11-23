/**
 * Portfolio Type Definitions
 * 
 * This file defines the data structures for managing the user's portfolio,
 * including positions, orders, and overall account state.
 */

export type OptionType = 'call' | 'put';
export type OrderType = 'market' | 'limit';
export type OrderSide = 'buy' | 'sell';
export type OrderStatus = 'filled' | 'pending' | 'cancelled' | 'rejected';

export interface Position {
  id: string;
  symbol: string;
  strike: number;
  type: OptionType;
  expirationDate: string; // ISO string
  quantity: number;
  avgEntryPrice: number;
  currentPrice: number;
  marketValue: number;
  pnl: number;
  pnlPercent: number;
  delta?: number;
  gamma?: number;
  theta?: number;
  vega?: number;
}

export interface Order {
  id: string;
  timestamp: number;
  symbol: string;
  strike: number;
  type: OptionType;
  expirationDate: string; // ISO string
  side: OrderSide;
  orderType: OrderType;
  quantity: number;
  price: number; // Execution price
  status: OrderStatus;
  totalCost: number;
}

export interface ClosedPosition {
  id: string;
  symbol: string;
  strike: number;
  type: OptionType;
  expirationDate: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  pnl: number;
  pnlPercent: number;
  closedAt: number; // timestamp
}

export interface PortfolioState {
  buyingPower: number;
  positions: Position[];
  orders: Order[];
  history: ClosedPosition[];
  totalPnL: number;
  totalPnLPercent: number;
  totalValue: number; // Cash + Market Value of positions
}

export interface PortfolioContextType extends PortfolioState {
  executeOrder: (order: Omit<Order, 'id' | 'timestamp' | 'status' | 'totalCost'>) => boolean;
  closePosition: (positionId: string, price: number, closedAt: Date) => void;
  updatePositions: (currentPrice: number, volatility: number, riskFreeRate: number, simulationDate: Date) => void;
  resetPortfolio: () => void;
}
