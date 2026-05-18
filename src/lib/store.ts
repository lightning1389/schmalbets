import { create } from 'zustand';
import { Trade, WatchlistItem, AdminUser } from './types';
import { clientFetchTrades, clientFetchWatchlist, writeTrade, deleteTrade, updateTrade as fbUpdateTrade, seedDatabase } from './dataFetcher';
import { signInWithEmail } from './firebase';

interface AppState {
  trades: Trade[];
  watchlist: WatchlistItem[];
  admin: AdminUser;
  authToken: string | null;
  dataLoaded: boolean;
  loadData: () => Promise<void>;
  addTrade: (trade: Trade) => Promise<boolean>;
  removeTrade: (id: string) => Promise<boolean>;
  updateTrade: (id: string, updates: Partial<Trade>) => Promise<boolean>;
  addToWatchlist: (item: WatchlistItem) => void;
  removeFromWatchlist: (symbol: string) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  seedData: () => Promise<boolean>;
}

export const useStore = create<AppState>((set, get) => ({
  trades: [],
  watchlist: [],
  admin: { authenticated: false, sessionExpiry: 0 },
  authToken: null,
  dataLoaded: false,

  loadData: async () => {
    if (get().dataLoaded) return;
    try {
      const [trades, watchlist] = await Promise.all([
        clientFetchTrades(),
        clientFetchWatchlist(),
      ]);
      set({ trades, watchlist, dataLoaded: true });
    } catch {
      set({ dataLoaded: true });
    }
  },

  addTrade: async (trade) => {
    const token = get().authToken;
    if (!token) return false;
    const success = await writeTrade(trade, token);
    if (success) {
      set((state) => ({ trades: [trade, ...state.trades] }));
    }
    return success;
  },

  removeTrade: async (id) => {
    const token = get().authToken;
    if (!token) return false;
    const success = await deleteTrade(id, token);
    if (success) {
      set((state) => ({ trades: state.trades.filter((t) => t.id !== id) }));
    }
    return success;
  },

  updateTrade: async (id, updates) => {
    const token = get().authToken;
    if (!token) return false;
    const updatedFields = { ...updates, updatedAt: new Date().toISOString() };
    const success = await fbUpdateTrade(id, updatedFields, token);
    if (success) {
      set((state) => ({
        trades: state.trades.map((t) =>
          t.id === id ? { ...t, ...updatedFields } : t
        ),
      }));
    }
    return success;
  },

  addToWatchlist: (item) =>
    set((state) => ({ watchlist: [item, ...state.watchlist] })),

  removeFromWatchlist: (symbol) =>
    set((state) => ({
      watchlist: state.watchlist.filter((w) => w.symbol !== symbol),
    })),

  login: async (email, password) => {
    try {
      const auth = await signInWithEmail(email, password);
      set({
        authToken: auth.idToken,
        admin: {
          authenticated: true,
          sessionExpiry: Date.now() + parseInt(auth.expiresIn) * 1000,
        },
      });
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      return { success: false, error: message };
    }
  },

  logout: () =>
    set({ admin: { authenticated: false, sessionExpiry: 0 }, authToken: null }),

  seedData: async () => {
    const token = get().authToken;
    if (!token) return false;
    return seedDatabase(token);
  },
}));
