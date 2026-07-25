import { NextRequest, NextResponse } from 'next/server';
import { formatDateForAPI, getDaysAgo, filterMarketHours } from '@/utils/dateUtils';

export interface AlpacaBar {
  t: string;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
  n: number;
  vw: number;
}

function sanitizeSymbol(symbol: string): string | null {
  const cleaned = symbol.trim().toUpperCase();
  if (!cleaned || cleaned.length > 10) {
    return null;
  }
  if (!/^[A-Z]{1,10}$/.test(cleaned)) {
    return null;
  }
  return cleaned;
}

async function fetchStockData(
  symbol: string,
  startDate: Date,
  endDate: Date
): Promise<{ data: AlpacaBar[] | null; date: Date; error?: string }> {
  const isProduction = process.env.NEXT_PUBLIC_ALPACA_ENV === 'production';
  const baseUrl = 'https://data.alpaca.markets/v2/stocks/bars';

  const apiKey = process.env.ALPACA_API_KEY?.trim();
  const apiSecret = process.env.ALPACA_SECRET_KEY?.trim();

  if (!apiKey || !apiSecret) {
    return {
      data: null,
      date: startDate,
      error: 'API credentials not configured.',
    };
  }

  const feed = isProduction ? 'sip' : 'iex';

  const params = new URLSearchParams({
    symbols: symbol,
    timeframe: '1min',
    start: formatDateForAPI(startDate),
    end: formatDateForAPI(endDate),
    limit: '1000',
    adjustment: 'raw',
    feed,
    sort: 'asc',
  });

  try {
    const response = await fetch(`${baseUrl}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'APCA-API-KEY-ID': apiKey,
        'APCA-API-SECRET-KEY': apiSecret,
      },
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch stock data.';
      
      if (response.status === 401) {
        errorMessage = 'Authentication failed.';
      } else if (response.status === 403) {
        errorMessage = 'Access denied.';
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again later.';
      } else if (response.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      return {
        data: null,
        date: startDate,
        error: errorMessage,
      };
    }

    const data: { bars: { [symbol: string]: AlpacaBar[] } } = await response.json();
    const allBars = data.bars?.[symbol] || [];
    
    const marketHoursBars = filterMarketHours(allBars);

    return {
      data: marketHoursBars.length > 0 ? marketHoursBars : null,
      date: startDate,
    };
  } catch {
    return {
      data: null,
      date: startDate,
      error: 'Failed to connect to data service.',
    };
  }
}

export async function getStockBars(rawSymbol: string, dateParam?: string | null) {
  if (!rawSymbol) {
    return { error: 'Symbol parameter is required', status: 400 };
  }

  const symbol = sanitizeSymbol(rawSymbol);
  if (!symbol) {
    return { error: 'Invalid symbol format. Use 1-10 uppercase letters.', status: 400 };
  }

  let startDate: Date;
  let endDate: Date;

  if (dateParam) {
    const parsedDate = new Date(dateParam);
    if (isNaN(parsedDate.getTime())) {
      return { error: 'Invalid date format.', status: 400 };
    }
    
    const [year, month, day] = dateParam.split('-').map(Number);
    startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    endDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
    
    const result = await fetchStockData(symbol, startDate, endDate);
    
    if (result.error && !result.data) {
      return { error: result.error, status: 500 };
    }

    if (!result.data) {
      return { 
        error: `No data available for ${symbol} on ${dateParam}.`,
        bars: [],
        symbol,
        date: result.date.toISOString(),
        status: 200,
      };
    }

    return {
      bars: result.data,
      symbol,
      date: result.date.toISOString(),
      status: 200,
    };

  } else {
    const yesterday = getDaysAgo(1);
    yesterday.setHours(0, 0, 0, 0);
    const yesterdayEnd = new Date(yesterday);
    yesterdayEnd.setHours(23, 59, 59, 999);
    
    let result = await fetchStockData(symbol, yesterday, yesterdayEnd);

    const maxDaysBack = 7;
    if (!result.data && !result.error?.includes('credentials')) {
      for (let daysBack = 2; daysBack <= maxDaysBack; daysBack++) {
        const targetDate = getDaysAgo(daysBack);
        targetDate.setHours(0, 0, 0, 0);
        const targetEnd = new Date(targetDate);
        targetEnd.setHours(23, 59, 59, 999);
        
        result = await fetchStockData(symbol, targetDate, targetEnd);
        
        if (result.data) {
          break;
        }
      }
    }

    if (result.error && !result.data) {
      return { error: result.error, status: 500 };
    }

    if (!result.data) {
      return { 
        error: `No data available for ${symbol}.`,
        bars: [],
        symbol,
        date: result.date.toISOString(),
        status: 200,
      };
    }

    return {
      bars: result.data,
      symbol,
      date: result.date.toISOString(),
      status: 200,
    };
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const rawSymbol = searchParams.get('symbol');
  const dateParam = searchParams.get('date');

  const res = await getStockBars(rawSymbol || '', dateParam);
  return NextResponse.json(res, { status: res.status });
}


