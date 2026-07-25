import { NextRequest, NextResponse } from 'next/server';
import { priceOption } from '@/utils/blackScholes';
import { generateStrikePrices, getNextFriday, getCurrentRiskFreeRate } from '@/utils/optionsHelpers';
import { estimateBlendedVolatility } from '@/utils/volatilityEstimator';
import { getCurrentSimulationTime, getSimulationTimeToExpiry } from '@/utils/simulationContext';
import { getStockBars, AlpacaBar } from '../stocks/route';

interface OptionChainItem {
  strike: number;
  bid: number;
  ask: number;
  theoretical: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  volume: number;
  moneyness: 'ITM' | 'ATM' | 'OTM';
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbol = searchParams.get('symbol');
  const optionType = searchParams.get('type') as 'call' | 'put' | null;
  const date = searchParams.get('date');

  // Validate parameters
  if (!symbol) {
    return NextResponse.json(
      { error: 'Symbol parameter is required' },
      { status: 400 }
    );
  }

  if (!optionType || (optionType !== 'call' && optionType !== 'put')) {
    return NextResponse.json(
      { error: 'Type parameter must be either "call" or "put"' },
      { status: 400 }
    );
  }

  try {
    // Fetch stock data directly
    const stockData = await getStockBars(symbol, date);

    if (stockData.error || !stockData.bars || stockData.bars.length === 0) {
      return NextResponse.json(
        { error: stockData.error || `No data available for ${symbol}` },
        { status: stockData.status || 404 }
      );
    }

    const bars: AlpacaBar[] = stockData.bars;
    
    // Get current price (last bar's close)
    const currentPrice = bars[bars.length - 1].c;

    // Calculate volatility from historical data
    const volatility = estimateBlendedVolatility(bars);

    // Get simulation date from the last bar
    const simulationDate = getCurrentSimulationTime(bars, bars.length - 1);

    // Calculate expiration (next Friday from simulation date)
    const expirationDate = getNextFriday(simulationDate);
    const timeToExpiry = getSimulationTimeToExpiry(expirationDate, simulationDate);
    const daysToExpiry = timeToExpiry * 365;

    // Get risk-free rate
    const riskFreeRate = getCurrentRiskFreeRate();

    // Generate strike prices (5 on each side of current price)
    const strikes = generateStrikePrices(currentPrice, 5);

    // Price each option
    const chain: OptionChainItem[] = strikes.map(strike => {
      const option = priceOption({
        stockPrice: currentPrice,
        strikePrice: strike,
        timeToExpiry,
        riskFreeRate,
        volatility,
        optionType,
      });

      // Determine moneyness
      let moneyness: 'ITM' | 'ATM' | 'OTM';
      const priceDiff = Math.abs(strike - currentPrice);
      const strikeInterval = strikes[1] - strikes[0]; // Get interval between strikes

      if (priceDiff < strikeInterval / 2) {
        moneyness = 'ATM';
      } else if (optionType === 'call') {
        moneyness = strike < currentPrice ? 'ITM' : 'OTM';
      } else {
        moneyness = strike > currentPrice ? 'ITM' : 'OTM';
      }

      return {
        strike,
        bid: option.bid,
        ask: option.ask,
        theoretical: option.theoreticalPrice,
        delta: option.greeks.delta,
        gamma: option.greeks.gamma,
        theta: option.greeks.theta,
        vega: option.greeks.vega,
        volume: 0, // Simulated volume (always 0 for now)
        moneyness,
      };
    });

    return NextResponse.json({
      symbol: symbol.toUpperCase(),
      currentPrice: Math.round(currentPrice * 100) / 100,
      volatility: Math.round(volatility * 10000) / 100, // Convert to percentage
      expirationDate: expirationDate.toISOString(),
      daysToExpiry: Math.round(daysToExpiry * 10) / 10,
      optionType,
      chain,
    });

  } catch (error) {
    console.error('Error generating options chain:', error);
    return NextResponse.json(
      { error: 'Failed to generate options chain' },
      { status: 500 }
    );
  }
}
