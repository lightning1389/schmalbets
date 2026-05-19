/**
 * Live market data service.
 * Fetches stock prices, VIX, sector performance, and sentiment from Yahoo Finance + free APIs.
 * Tries direct request first, then CORS proxy as fallback.
 */

interface YahooChartResult {
  chart?: {
    result?: Array<{
      meta?: {
        regularMarketPrice?: number;
        chartPreviousClose?: number;
        fiftyTwoWeekHigh?: number;
        symbol?: string;
      };
      indicators?: {
        quote?: Array<{
          close?: (number | null)[];
        }>;
      };
    }>;
  };
}

async function tryFetch(url: string): Promise<Response | null> {
  try {
    const res = await fetch(url);
    if (res.ok) return res;
  } catch { /* ignore */ }
  return null;
}

async function yahooFetch(url: string): Promise<Response | null> {
  let res = await tryFetch(url);
  if (!res) {
    res = await tryFetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);
  }
  return res;
}

async function yahooChart(symbol: string, range = '1d'): Promise<YahooChartResult['chart']> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=${range}`;
  const res = await yahooFetch(url);
  if (!res) return undefined;
  try {
    const data: YahooChartResult = await res.json();
    return data.chart;
  } catch {
    return undefined;
  }
}

// ─── STOCK PRICES ───────────────────────────────────────────────

export async function fetchLivePrice(symbol: string): Promise<number | null> {
  const chart = await yahooChart(symbol);
  return chart?.result?.[0]?.meta?.regularMarketPrice ?? null;
}

export async function fetchLivePrices(symbols: string[]): Promise<Record<string, number>> {
  const unique = Array.from(new Set(symbols));
  const results: Record<string, number> = {};
  const prices = await Promise.all(unique.map(fetchLivePrice));
  unique.forEach((sym, idx) => {
    if (prices[idx] !== null) results[sym] = prices[idx]!;
  });
  return results;
}

// ─── VIX & S&P 500 ─────────────────────────────────────────────

export interface MarketOverview {
  vix: number;
  vixChange: number;
  spxPrice: number;
  spxChange: number;
  spxFromATH: number;
}

export async function fetchMarketOverview(): Promise<MarketOverview | null> {
  try {
    const [vixChart, spxChart] = await Promise.all([
      yahooChart('^VIX', '5d'),
      yahooChart('^GSPC', '5d'),
    ]);
    const vixMeta = vixChart?.result?.[0]?.meta;
    const spxMeta = spxChart?.result?.[0]?.meta;
    if (!vixMeta?.regularMarketPrice || !spxMeta?.regularMarketPrice) return null;

    const vixPrev = vixMeta.chartPreviousClose ?? vixMeta.regularMarketPrice;
    const spxPrev = spxMeta.chartPreviousClose ?? spxMeta.regularMarketPrice;
    const spxHigh = spxMeta.fiftyTwoWeekHigh ?? spxMeta.regularMarketPrice;

    return {
      vix: vixMeta.regularMarketPrice,
      vixChange: ((vixMeta.regularMarketPrice - vixPrev) / vixPrev) * 100,
      spxPrice: spxMeta.regularMarketPrice,
      spxChange: ((spxMeta.regularMarketPrice - spxPrev) / spxPrev) * 100,
      spxFromATH: ((spxMeta.regularMarketPrice - spxHigh) / spxHigh) * 100,
    };
  } catch {
    return null;
  }
}

// ─── FEAR & GREED (alternative.me — crypto-based but widely used) ──

export interface FearGreedData {
  value: number;
  label: string;
}

export async function fetchFearGreed(): Promise<FearGreedData | null> {
  try {
    const res = await tryFetch('https://api.alternative.me/fng/?limit=1');
    if (!res) return null;
    const data = await res.json();
    const entry = data?.data?.[0];
    if (!entry) return null;
    return {
      value: parseInt(entry.value, 10),
      label: entry.value_classification?.toUpperCase() ?? 'NEUTRAL',
    };
  } catch {
    return null;
  }
}

// ─── SECTOR PERFORMANCE (via sector ETFs) ───────────────────────

const SECTOR_ETFS: Record<string, string> = {
  Technology: 'XLK',
  Financials: 'XLF',
  Energy: 'XLE',
  Healthcare: 'XLV',
  Industrials: 'XLI',
  'Comm Services': 'XLC',
  'Consumer Disc.': 'XLY',
  'Consumer Staples': 'XLP',
  Utilities: 'XLU',
  'Real Estate': 'XLRE',
  Materials: 'XLB',
};

export interface SectorData {
  sector: string;
  etf: string;
  performance: number;
  price: number;
}

export async function fetchSectorPerformance(): Promise<SectorData[]> {
  const entries = Object.entries(SECTOR_ETFS);
  const results: SectorData[] = [];

  const charts = await Promise.all(
    entries.map(([, etf]) => yahooChart(etf, '5d'))
  );

  entries.forEach(([sector, etf], idx) => {
    const meta = charts[idx]?.result?.[0]?.meta;
    if (!meta?.regularMarketPrice) return;
    const prev = meta.chartPreviousClose ?? meta.regularMarketPrice;
    results.push({
      sector,
      etf,
      price: meta.regularMarketPrice,
      performance: Math.round(((meta.regularMarketPrice - prev) / prev) * 10000) / 100,
    });
  });

  // Sort by performance descending
  results.sort((a, b) => b.performance - a.performance);
  return results;
}

// ─── TICKER BAR DATA ────────────────────────────────────────────

const TICKER_SYMBOLS = ['SPY', 'QQQ', 'DIA', 'IWM', 'AAPL', 'NVDA', 'MSFT', 'TSLA', 'AMZN', 'META', 'GOOG', 'BTC-USD', 'GC=F', 'CL=F'];

export interface TickerItem {
  symbol: string;
  price: number;
  change: number;
}

export async function fetchTickerData(): Promise<TickerItem[]> {
  const results: TickerItem[] = [];
  const charts = await Promise.all(
    TICKER_SYMBOLS.map((sym) => yahooChart(sym, '5d'))
  );

  TICKER_SYMBOLS.forEach((sym, idx) => {
    const meta = charts[idx]?.result?.[0]?.meta;
    if (!meta?.regularMarketPrice) return;
    const prev = meta.chartPreviousClose ?? meta.regularMarketPrice;
    const displaySymbol = sym.replace('-USD', '').replace('=F', '');
    results.push({
      symbol: displaySymbol,
      price: meta.regularMarketPrice,
      change: ((meta.regularMarketPrice - prev) / prev) * 100,
    });
  });

  return results;
}
