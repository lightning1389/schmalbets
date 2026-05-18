import { Trade, StockData, WatchlistItem } from './types';
import { TRADES, STOCKS, WATCHLIST } from './mockData';
import { dbRead, dbWrite, dbUpdate, dbDelete } from './firebase';

/**
 * Firebase RTDB returns objects keyed by ID, not arrays.
 * This converts {id1: {...}, id2: {...}} to [{...}, {...}]
 */
function objectToArray<T>(data: Record<string, T> | T[] | null): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return Object.values(data);
}

// ─── READ OPERATIONS (public, no auth) ──────────────────────────

export async function clientFetchTrades(): Promise<Trade[]> {
  try {
    const data = await dbRead<Record<string, Trade>>('trades');
    const trades = objectToArray(data);
    return trades.length > 0 ? trades : TRADES;
  } catch {
    return TRADES;
  }
}

export async function clientFetchStocks(): Promise<StockData[]> {
  try {
    const data = await dbRead<Record<string, StockData>>('stocks');
    const stocks = objectToArray(data);
    return stocks.length > 0 ? stocks : STOCKS;
  } catch {
    return STOCKS;
  }
}

export async function clientFetchWatchlist(): Promise<WatchlistItem[]> {
  try {
    const data = await dbRead<Record<string, WatchlistItem>>('watchlist');
    const items = objectToArray(data);
    return items.length > 0 ? items : WATCHLIST;
  } catch {
    return WATCHLIST;
  }
}

// ─── WRITE OPERATIONS (require auth token) ──────────────────────

export async function writeTrade(trade: Trade, token: string): Promise<boolean> {
  return dbWrite(`trades/${trade.id}`, trade, token);
}

export async function updateTrade(id: string, updates: Partial<Trade>, token: string): Promise<boolean> {
  return dbUpdate(`trades/${id}`, updates, token);
}

export async function deleteTrade(id: string, token: string): Promise<boolean> {
  return dbDelete(`trades/${id}`, token);
}

export async function writeWatchlistItem(item: WatchlistItem, token: string): Promise<boolean> {
  return dbWrite(`watchlist/${item.symbol}`, item, token);
}

export async function deleteWatchlistItem(symbol: string, token: string): Promise<boolean> {
  return dbDelete(`watchlist/${symbol}`, token);
}

/**
 * Seed all data to Firebase (admin utility).
 * Writes mock data to RTDB if it's empty.
 */
export async function seedDatabase(token: string): Promise<boolean> {
  try {
    // Write trades keyed by ID
    const tradesObj: Record<string, Trade> = {};
    TRADES.forEach((t) => { tradesObj[t.id] = t; });

    // Write watchlist keyed by symbol
    const watchlistObj: Record<string, WatchlistItem> = {};
    WATCHLIST.forEach((w) => { watchlistObj[w.symbol] = w; });

    // Write stocks keyed by symbol
    const stocksObj: Record<string, StockData> = {};
    STOCKS.forEach((s) => { stocksObj[s.symbol] = s; });

    const [t, w, s] = await Promise.all([
      dbWrite('trades', tradesObj, token),
      dbWrite('watchlist', watchlistObj, token),
      dbWrite('stocks', stocksObj, token),
    ]);

    return t && w && s;
  } catch {
    return false;
  }
}
