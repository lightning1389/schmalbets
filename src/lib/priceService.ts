/**
 * Fetches live stock prices from Yahoo Finance chart API.
 * Falls back gracefully if the API is unavailable.
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

export async function fetchLivePrice(symbol: string): Promise<number | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data: YahooChartResult = await res.json();
    return data.chart?.result?.[0]?.meta?.regularMarketPrice ?? null;
  } catch {
    return null;
  }
}

export async function fetchLivePrices(symbols: string[]): Promise<Record<string, number>> {
  const unique = Array.from(new Set(symbols));
  const results: Record<string, number> = {};

  // Fetch in parallel (max 5 concurrent)
  const batchSize = 5;
  for (let i = 0; i < unique.length; i += batchSize) {
    const batch = unique.slice(i, i + batchSize);
    const prices = await Promise.all(batch.map(fetchLivePrice));
    batch.forEach((sym, idx) => {
      if (prices[idx] !== null) {
        results[sym] = prices[idx]!;
      }
    });
  }

  return results;
}
