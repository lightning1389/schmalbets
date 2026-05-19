import { fetchLivePrice, fetchLivePrices, computeFearGreedFromVix, fetchFearGreed, fetchMarketOverview } from '@/lib/priceService';

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
      expect(mockFetch.mock.calls[0][0]).toContain('finance.yahoo.com');
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

  describe('computeFearGreedFromVix', () => {
    it('returns extreme greed for very low VIX (< 12)', () => {
      const result = computeFearGreedFromVix(10);
      expect(result.value).toBe(90);
      expect(result.label).toBe('EXTREME GREED');
    });

    it('returns greed for low VIX (12-16)', () => {
      const result = computeFearGreedFromVix(14);
      expect(result.value).toBeGreaterThanOrEqual(56);
      expect(result.value).toBeLessThanOrEqual(75);
      expect(result.label).toBe('GREED');
    });

    it('returns neutral for moderate VIX (16-20)', () => {
      const result = computeFearGreedFromVix(18);
      expect(result.value).toBeGreaterThanOrEqual(45);
      expect(result.value).toBeLessThanOrEqual(55);
      expect(result.label).toBe('NEUTRAL');
    });

    it('returns fear for elevated VIX (20-30)', () => {
      const result = computeFearGreedFromVix(25);
      expect(result.value).toBeGreaterThanOrEqual(26);
      expect(result.value).toBeLessThanOrEqual(40);
      expect(result.label).toBe('FEAR');
    });

    it('returns extreme fear for high VIX (> 30)', () => {
      const result = computeFearGreedFromVix(35);
      expect(result.value).toBeLessThanOrEqual(25);
      expect(result.label).toBe('EXTREME FEAR');
    });

    it('clamps to 0 for extremely high VIX', () => {
      const result = computeFearGreedFromVix(60);
      expect(result.value).toBe(0);
      expect(result.label).toBe('EXTREME FEAR');
    });

    it('value is always between 0 and 100', () => {
      for (const vix of [5, 10, 15, 20, 25, 30, 40, 50, 80]) {
        const result = computeFearGreedFromVix(vix);
        expect(result.value).toBeGreaterThanOrEqual(0);
        expect(result.value).toBeLessThanOrEqual(100);
      }
    });

    it('higher VIX always produces lower or equal value', () => {
      let prevValue = 100;
      for (const vix of [8, 12, 16, 20, 25, 30, 40, 50]) {
        const result = computeFearGreedFromVix(vix);
        expect(result.value).toBeLessThanOrEqual(prevValue);
        prevValue = result.value;
      }
    });
  });

  describe('fetchFearGreed', () => {
    it('returns CNN data when available', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          fear_and_greed: { score: 60.5 },
        }),
      });

      const result = await fetchFearGreed();
      expect(result).toEqual({ value: 61, label: 'GREED' });
    });

    it('falls back to VIX-based computation when CNN fails', async () => {
      // CNN fails
      mockFetch.mockResolvedValueOnce({ ok: false });
      // CORS proxy also fails
      mockFetch.mockResolvedValueOnce({ ok: false });
      // VIX Yahoo direct succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          chart: { result: [{ meta: { regularMarketPrice: 18 } }] },
        }),
      });

      const result = await fetchFearGreed();
      expect(result).not.toBeNull();
      expect(result!.value).toBeGreaterThanOrEqual(45);
      expect(result!.value).toBeLessThanOrEqual(55);
      expect(result!.label).toBe('NEUTRAL');
    });

    it('returns null when all sources fail', async () => {
      mockFetch.mockResolvedValue({ ok: false });

      const result = await fetchFearGreed();
      expect(result).toBeNull();
    });
  });

  describe('fetchMarketOverview', () => {
    it('returns VIX and SPX data', async () => {
      // VIX fetch (direct)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          chart: {
            result: [{
              meta: {
                regularMarketPrice: 18.5,
                chartPreviousClose: 19.2,
                fiftyTwoWeekHigh: 20,
              },
            }],
          },
        }),
      });
      // SPX fetch (direct)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          chart: {
            result: [{
              meta: {
                regularMarketPrice: 5900,
                chartPreviousClose: 5850,
                fiftyTwoWeekHigh: 6100,
              },
            }],
          },
        }),
      });

      const result = await fetchMarketOverview();
      expect(result).not.toBeNull();
      expect(result!.vix).toBe(18.5);
      expect(result!.vixChange).toBeCloseTo(((18.5 - 19.2) / 19.2) * 100, 1);
      expect(result!.spxPrice).toBe(5900);
      expect(result!.spxChange).toBeCloseTo(((5900 - 5850) / 5850) * 100, 1);
      expect(result!.spxFromATH).toBeCloseTo(((5900 - 6100) / 6100) * 100, 1);
    });

    it('returns null when VIX data is missing', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ chart: { result: [{ meta: {} }] } }),
      });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          chart: { result: [{ meta: { regularMarketPrice: 5900 } }] },
        }),
      });

      const result = await fetchMarketOverview();
      expect(result).toBeNull();
    });

    it('returns null when fetch fails', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await fetchMarketOverview();
      expect(result).toBeNull();
    });
  });
});
