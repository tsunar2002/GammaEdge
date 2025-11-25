'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { PortfolioContextType, PortfolioState, Order, ClosedPosition } from './portfolioTypes';
import { priceOption } from './blackScholes';
import { getSimulationTimeToExpiry } from './simulationContext';

const INITIAL_BUYING_POWER = 100000; // $100k starting cash

const initialState: PortfolioState = {
  buyingPower: INITIAL_BUYING_POWER,
  positions: [],
  orders: [],
  history: [],
  totalPnL: 0,
  totalPnLPercent: 0,
  totalValue: INITIAL_BUYING_POWER,
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PortfolioState>(initialState);

  // Execute a new order
  const executeOrder = useCallback((orderParams: Omit<Order, 'id' | 'timestamp' | 'status' | 'totalCost'>): boolean => {
    const totalCost = orderParams.price * orderParams.quantity * 100;

    // Check buying power for buy orders
    if (orderParams.side === 'buy' && totalCost > state.buyingPower) {
      console.warn('Insufficient buying power');
      return false;
    }

    const newOrder: Order = {
      ...orderParams,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      status: 'filled',
      totalCost,
    };

    setState(prevState => {
      let newBuyingPower = prevState.buyingPower;
      const newPositions = [...prevState.positions];

      if (newOrder.side === 'buy') {
        newBuyingPower -= totalCost;

        // Check if position already exists to average down
        const existingPosIndex = newPositions.findIndex(
          p => p.symbol === newOrder.symbol && 
               p.strike === newOrder.strike && 
               p.type === newOrder.type &&
               p.expirationDate === newOrder.expirationDate
        );

        if (existingPosIndex >= 0) {
          const existing = newPositions[existingPosIndex];
          const totalQty = existing.quantity + newOrder.quantity;
          const totalCostBasis = (existing.avgEntryPrice * existing.quantity) + (newOrder.price * newOrder.quantity);
          
          newPositions[existingPosIndex] = {
            ...existing,
            quantity: totalQty,
            avgEntryPrice: totalCostBasis / totalQty,
          };
        } else {
          newPositions.push({
            id: Math.random().toString(36).substr(2, 9),
            symbol: newOrder.symbol,
            strike: newOrder.strike,
            type: newOrder.type,
            expirationDate: (orderParams as Order).expirationDate || new Date().toISOString(),
            quantity: newOrder.quantity,
            avgEntryPrice: newOrder.price,
            currentPrice: newOrder.price,
            marketValue: totalCost,
            pnl: 0,
            pnlPercent: 0,
          });
        }
      }

      return {
        ...prevState,
        buyingPower: newBuyingPower,
        positions: newPositions,
        orders: [newOrder, ...prevState.orders],
        totalValue: newBuyingPower + newPositions.reduce((sum, p) => sum + p.marketValue, 0),
      };
    });

    return true;
  }, [state.buyingPower]);



  // Close a position
  const closePosition = useCallback((positionId: string, price: number, closedAt: Date) => {
    setState(prevState => {
      const position = prevState.positions.find(p => p.id === positionId);
      if (!position) return prevState;

      const credit = price * position.quantity * 100;
      const newBuyingPower = prevState.buyingPower + credit;
      
      // Calculate P&L for the closed position
      const costBasis = position.avgEntryPrice * position.quantity * 100;
      const pnl = credit - costBasis;
      const pnlPercent = (pnl / costBasis) * 100;

      // Record sell order
      const closeOrder: Order = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: closedAt.getTime(),
        symbol: position.symbol,
        strike: position.strike,
        type: position.type,
        expirationDate: position.expirationDate,
        side: 'sell',
        orderType: 'market',
        quantity: position.quantity,
        price: price,
        status: 'filled',
        totalCost: credit,
      };

      // Create history entry
      const historyEntry: ClosedPosition = {
        id: Math.random().toString(36).substr(2, 9),
        symbol: position.symbol,
        strike: position.strike,
        type: position.type,
        expirationDate: position.expirationDate,
        entryPrice: position.avgEntryPrice,
        exitPrice: price,
        quantity: position.quantity,
        pnl,
        pnlPercent,
        closedAt: closedAt.getTime(),
      };

      return {
        ...prevState,
        buyingPower: newBuyingPower,
        positions: prevState.positions.filter(p => p.id !== positionId),
        orders: [closeOrder, ...prevState.orders],
        history: [historyEntry, ...prevState.history],
        totalValue: newBuyingPower + prevState.positions.filter(p => p.id !== positionId).reduce((sum, p) => sum + p.marketValue, 0),
      };
    });
  }, []);

  // Update positions based on live market data
  const updatePositions = useCallback((currentPrice: number, volatility: number, riskFreeRate: number, simulationDate: Date) => {
    setState(prevState => {
      if (prevState.positions.length === 0) return prevState;

      let totalPositionValue = 0;


      const updatedPositions = prevState.positions.map(position => {
        // Recalculate option price
        const timeToExpiry = getSimulationTimeToExpiry(new Date(position.expirationDate), simulationDate);
        
        const pricedOption = priceOption({
          stockPrice: currentPrice,
          strikePrice: position.strike,
          timeToExpiry,
          riskFreeRate,
          volatility,
          optionType: position.type,
        });

        // Use the theoretical price or mid price for valuation
        const markPrice = pricedOption.theoreticalPrice; 
        const marketValue = markPrice * position.quantity * 100;
        const costBasis = position.avgEntryPrice * position.quantity * 100;
        const pnl = marketValue - costBasis;
        const pnlPercent = (pnl / costBasis) * 100;

        totalPositionValue += marketValue;


        return {
          ...position,
          currentPrice: markPrice,
          marketValue,
          pnl,
          pnlPercent,
          delta: pricedOption.greeks.delta,
          gamma: pricedOption.greeks.gamma,
          theta: pricedOption.greeks.theta,
          vega: pricedOption.greeks.vega,
        };
      });

      const totalValue = prevState.buyingPower + totalPositionValue;
      const totalPnLPercent = ((totalValue - INITIAL_BUYING_POWER) / INITIAL_BUYING_POWER) * 100;

      return {
        ...prevState,
        positions: updatedPositions,
        totalPnL: totalValue - INITIAL_BUYING_POWER,
        totalPnLPercent,
        totalValue,
      };

    });
  }, []);

  const resetPortfolio = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <PortfolioContext.Provider value={{ ...state, executeOrder, closePosition, updatePositions, resetPortfolio }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
