/**
 * Fetches live stock prices from Yahoo Finance.
 * Tries direct request first, then CORS proxy as fallback.
 */

interface YahooChartResult {
  chart?: {
    result?: Array<{
      meta?: {
        regularMarketPrice?: number;
        symbol?: string;
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

export async function fetchLivePrice(symbol: string): Promise<number | null> {
  const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;

  // Try direct first (works in some browsers)
  let res = await tryFetch(yahooUrl);

  // Fallback: CORS proxy (only works from browsers, not server-side)
  if (!res) {
    res = await tryFetch(`https://corsproxy.io/?${encodeURIComponent(yahooUrl)}`);
  }

  if (!res) return null;

  try {
    const data: YahooChartResult = await res.json();
    return data.chart?.result?.[0]?.meta?.regularMarketPrice ?? null;
  } catch {
    return null;
  }
}

export async function fetchLivePrices(symbols: string[]): Promise<Record<string, number>> {
  const unique = Array.from(new Set(symbols));
  const results: Record<string, number> = {};

  const prices = await Promise.all(unique.map(fetchLivePrice));
  unique.forEach((sym, idx) => {
    if (prices[idx] !== null) {
      results[sym] = prices[idx]!;
    }
  });

  return results;
}
