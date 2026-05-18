import { renderHook, act } from '@testing-library/react';
import { useStore } from '@/lib/store';
import { Trade } from '@/lib/types';

// Mock firebase module
jest.mock('@/lib/firebase', () => ({
  signInWithEmail: jest.fn().mockResolvedValue({
    idToken: 'mock-token-123',
    email: 'test@test.com',
    expiresIn: '3600',
    localId: 'mock-uid',
  }),
  dbRead: jest.fn().mockResolvedValue(null),
  dbWrite: jest.fn().mockResolvedValue(true),
  dbUpdate: jest.fn().mockResolvedValue(true),
  dbDelete: jest.fn().mockResolvedValue(true),
}));

describe('Store', () => {
  beforeEach(() => {
    // Reset store state
    const { result } = renderHook(() => useStore());
    act(() => {
      result.current.logout();
    });
  });

  describe('trades', () => {
    it('starts with empty trades before loading', () => {
      const { result } = renderHook(() => useStore());
      expect(result.current.trades.length).toBe(0);
    });

    it('can add a trade when authenticated', async () => {
      const { result } = renderHook(() => useStore());

      // Login first
      await act(async () => {
        await result.current.login('test@test.com', 'password');
      });

      const initialLength = result.current.trades.length;

      const newTrade: Trade = {
        id: 'test-trade-1',
        symbol: 'TEST',
        company: 'Test Company',
        direction: 'BUY',
        status: 'OPEN',
        entryPrice: 100,
        currentPrice: 100,
        shares: 10,
        conviction: 3,
        sentiment: 'BULLISH',
        sector: 'Technology',
        entryDate: '2024-03-15',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        thesis: 'Test thesis',
        notes: [],
        targets: [],
        tags: ['test'],
      };

      await act(async () => {
        await result.current.addTrade(newTrade);
      });

      expect(result.current.trades.length).toBe(initialLength + 1);
      expect(result.current.trades[0].id).toBe('test-trade-1');
    });

    it('adds new trade at the beginning', async () => {
      const { result } = renderHook(() => useStore());

      await act(async () => {
        await result.current.login('test@test.com', 'password');
      });

      const newTrade: Trade = {
        id: 'new-first',
        symbol: 'FIRST',
        company: 'First Company',
        direction: 'BUY',
        status: 'OPEN',
        entryPrice: 50,
        currentPrice: 50,
        shares: 5,
        conviction: 1,
        sentiment: 'NEUTRAL',
        sector: 'Finance',
        entryDate: '2024-03-15',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        thesis: 'First trade',
        notes: [],
        targets: [],
        tags: [],
      };

      await act(async () => {
        await result.current.addTrade(newTrade);
      });

      expect(result.current.trades[0].symbol).toBe('FIRST');
    });

    it('can remove a trade', async () => {
      const { result } = renderHook(() => useStore());

      await act(async () => {
        await result.current.login('test@test.com', 'password');
      });

      const initialLength = result.current.trades.length;
      const tradeToRemove = result.current.trades[0].id;

      await act(async () => {
        await result.current.removeTrade(tradeToRemove);
      });

      expect(result.current.trades.length).toBe(initialLength - 1);
      expect(result.current.trades.find((t) => t.id === tradeToRemove)).toBeUndefined();
    });

    it('can update a trade', async () => {
      const { result } = renderHook(() => useStore());

      await act(async () => {
        await result.current.login('test@test.com', 'password');
      });

      const tradeId = result.current.trades[0].id;

      await act(async () => {
        await result.current.updateTrade(tradeId, { currentPrice: 999.99 });
      });

      const updated = result.current.trades.find((t) => t.id === tradeId);
      expect(updated?.currentPrice).toBe(999.99);
    });

    it('updates the updatedAt timestamp on trade update', async () => {
      const { result } = renderHook(() => useStore());

      await act(async () => {
        await result.current.login('test@test.com', 'password');
      });

      const tradeId = result.current.trades[0].id;
      const originalUpdatedAt = result.current.trades[0].updatedAt;

      await act(async () => {
        await result.current.updateTrade(tradeId, { currentPrice: 888 });
      });

      const updated = result.current.trades.find((t) => t.id === tradeId);
      expect(updated?.updatedAt).toBeTruthy();
      expect(new Date(updated!.updatedAt).getTime()).toBeGreaterThanOrEqual(
        new Date(originalUpdatedAt).getTime()
      );
    });

    it('returns false when not authenticated', async () => {
      const { result } = renderHook(() => useStore());
      const initialLength = result.current.trades.length;

      let success: boolean = true;
      await act(async () => {
        success = await result.current.removeTrade('some-id');
      });

      expect(success).toBe(false);
      expect(result.current.trades.length).toBe(initialLength);
    });
  });

  describe('watchlist', () => {
    it('starts with empty watchlist before loading', () => {
      const { result } = renderHook(() => useStore());
      expect(result.current.watchlist.length).toBe(0);
    });

    it('can add to watchlist', () => {
      const { result } = renderHook(() => useStore());
      const initialLength = result.current.watchlist.length;

      act(() => {
        result.current.addToWatchlist({
          symbol: 'WATCH',
          company: 'Watch Co',
          price: 100,
          change: 1,
          changePercent: 1,
          notes: 'Test watchlist',
          addedAt: '2024-03-15',
        });
      });

      expect(result.current.watchlist.length).toBe(initialLength + 1);
    });

    it('can remove from watchlist', () => {
      const { result } = renderHook(() => useStore());
      const initialLength = result.current.watchlist.length;
      const symbolToRemove = result.current.watchlist[0].symbol;

      act(() => {
        result.current.removeFromWatchlist(symbolToRemove);
      });

      expect(result.current.watchlist.length).toBe(initialLength - 1);
    });
  });

  describe('authentication', () => {
    it('starts unauthenticated', () => {
      const { result } = renderHook(() => useStore());
      expect(result.current.admin.authenticated).toBe(false);
    });

    it('can login with email and password', async () => {
      const { result } = renderHook(() => useStore());

      await act(async () => {
        await result.current.login('test@test.com', 'password');
      });

      expect(result.current.admin.authenticated).toBe(true);
      expect(result.current.admin.sessionExpiry).toBeGreaterThan(Date.now());
      expect(result.current.authToken).toBe('mock-token-123');
    });

    it('sets session expiry based on token expiresIn', async () => {
      const { result } = renderHook(() => useStore());
      const before = Date.now();

      await act(async () => {
        await result.current.login('test@test.com', 'password');
      });

      // Mock returns expiresIn: '3600' (1 hour)
      const expectedExpiry = before + 3600 * 1000;
      expect(result.current.admin.sessionExpiry).toBeGreaterThanOrEqual(expectedExpiry - 2000);
      expect(result.current.admin.sessionExpiry).toBeLessThanOrEqual(expectedExpiry + 2000);
    });

    it('can logout', async () => {
      const { result } = renderHook(() => useStore());

      await act(async () => {
        await result.current.login('test@test.com', 'password');
      });

      expect(result.current.admin.authenticated).toBe(true);

      act(() => {
        result.current.logout();
      });

      expect(result.current.admin.authenticated).toBe(false);
      expect(result.current.admin.sessionExpiry).toBe(0);
      expect(result.current.authToken).toBeNull();
    });

    it('returns error on failed login', async () => {
      const { signInWithEmail } = require('@/lib/firebase');
      signInWithEmail.mockRejectedValueOnce(new Error('INVALID_PASSWORD'));

      const { result } = renderHook(() => useStore());

      let loginResult: { success: boolean; error?: string } = { success: true };
      await act(async () => {
        loginResult = await result.current.login('bad@test.com', 'wrong');
      });

      expect(loginResult.success).toBe(false);
      expect(loginResult.error).toBe('INVALID_PASSWORD');
      expect(result.current.admin.authenticated).toBe(false);
    });
  });
});
