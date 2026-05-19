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

function fgLabel(value: number): string {
  if (value <= 25) return 'EXTREME FEAR';
  if (value <= 45) return 'FEAR';
  if (value <= 55) return 'NEUTRAL';
  if (value <= 75) return 'GREED';
  return 'EXTREME GREED';
}

/** Compute a synthetic score from VIX (inverted scale). */
export function computeFearGreedFromVix(vix: number): FearGreedData {
  // VIX roughly maps: <12 → extreme greed, 12-16 → greed, 16-20 → neutral,
  // 20-30 → fear, >30 → extreme fear
  let value: number;
  if (vix <= 12) value = 90;
  else if (vix <= 16) value = 75 - ((vix - 12) / 4) * 10; // 75→65
  else if (vix <= 20) value = 55 - ((vix - 16) / 4) * 10; // 55→45
  else if (vix <= 30) value = 40 - ((vix - 20) / 10) * 15; // 40→25
  else value = Math.max(0, 25 - ((vix - 30) / 20) * 25); // 25→0
  value = Math.round(Math.min(100, Math.max(0, value)));
  return { value, label: fgLabel(value) };
}

export async function fetchFearGreed(): Promise<FearGreedData | null> {
  // 1. Try CNN Fear & Greed API (stock-market based)
  try {
    let res = await tryFetch('https://production.dataviz.cnn.io/index/fearandgreed/graphdata');
    if (!res) {
      res = await tryFetch(
        `https://corsproxy.io/?${encodeURIComponent('https://production.dataviz.cnn.io/index/fearandgreed/graphdata')}`
      );
    }
    if (res) {
      const data = await res.json();
      const score = data?.fear_and_greed?.score;
      if (typeof score === 'number') {
        const value = Math.round(score);
        return { value, label: fgLabel(value) };
      }
    }
  } catch { /* fall through */ }

  // 2. Fallback: derive from VIX
  try {
    const chart = await yahooChart('^VIX');
    const vix = chart?.result?.[0]?.meta?.regularMarketPrice;
    if (typeof vix === 'number') return computeFearGreedFromVix(vix);
  } catch { /* ignore */ }

  return null;
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
