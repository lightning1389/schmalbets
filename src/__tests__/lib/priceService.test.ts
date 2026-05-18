import { fetchLivePrice, fetchLivePrices } from '@/lib/priceService';

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

describe('priceService', () => {
  describe('fetchLivePrice', () => {
    it('returns the market price from Yahoo Finance response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          chart: {
            result: [
              {
                meta: {
                  regularMarketPrice: 35.42,
                  symbol: 'ASTS',
                },
              },
            ],
          },
        }),
      });

      const price = await fetchLivePrice('ASTS');
      expect(price).toBe(35.42);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch.mock.calls[0][0]).toContain('corsproxy.io');
      expect(mockFetch.mock.calls[0][0]).toContain('ASTS');
    });

    it('returns null when API response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });

      const price = await fetchLivePrice('INVALID');
      expect(price).toBeNull();
    });

    it('returns null when response has no chart data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ chart: { result: [] } }),
      });

      const price = await fetchLivePrice('ASTS');
      expect(price).toBeNull();
    });

    it('returns null when fetch throws', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const price = await fetchLivePrice('ASTS');
      expect(price).toBeNull();
    });

    it('returns null when response has no meta', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ chart: { result: [{}] } }),
      });

      const price = await fetchLivePrice('ASTS');
      expect(price).toBeNull();
    });
  });

  describe('fetchLivePrices', () => {
    it('fetches prices for multiple symbols', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            chart: { result: [{ meta: { regularMarketPrice: 35.42 } }] },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            chart: { result: [{ meta: { regularMarketPrice: 190.50 } }] },
          }),
        });

      const prices = await fetchLivePrices(['ASTS', 'NVDA']);
      expect(prices).toEqual({ ASTS: 35.42, NVDA: 190.50 });
    });

    it('deduplicates symbols', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          chart: { result: [{ meta: { regularMarketPrice: 35.42 } }] },
        }),
      });

      await fetchLivePrices(['ASTS', 'ASTS', 'ASTS']);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('skips symbols that fail to fetch', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            chart: { result: [{ meta: { regularMarketPrice: 35.42 } }] },
          }),
        })
        .mockResolvedValueOnce({ ok: false });

      const prices = await fetchLivePrices(['ASTS', 'INVALID']);
      expect(prices).toEqual({ ASTS: 35.42 });
    });

    it('returns empty object when all fetches fail', async () => {
      mockFetch.mockResolvedValue({ ok: false });

      const prices = await fetchLivePrices(['ASTS', 'NVDA']);
      expect(prices).toEqual({});
    });

    it('returns empty object for empty input', async () => {
      const prices = await fetchLivePrices([]);
      expect(prices).toEqual({});
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });
});
