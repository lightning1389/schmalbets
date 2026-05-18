import { TRADES, STOCKS, WATCHLIST, PORTFOLIO_METRICS, MARKET_EVENTS, TICKER_DATA, SECTOR_PERFORMANCE, generateCandleData } from '@/lib/mockData';

describe('Mock Data Integrity', () => {
  describe('TRADES', () => {
    it('has trades defined', () => {
      expect(TRADES.length).toBeGreaterThan(0);
    });

    it('all trades have required fields', () => {
      TRADES.forEach((trade) => {
        expect(trade.id).toBeTruthy();
        expect(trade.symbol).toBeTruthy();
        expect(trade.company).toBeTruthy();
        expect(['BUY', 'SELL']).toContain(trade.direction);
        expect(['OPEN', 'CLOSED', 'PARTIAL']).toContain(trade.status);
        expect(trade.entryPrice).toBeGreaterThan(0);
        expect(trade.currentPrice).toBeGreaterThan(0);
        expect(trade.shares).toBeGreaterThan(0);
        expect(trade.conviction).toBeGreaterThanOrEqual(1);
        expect(trade.conviction).toBeLessThanOrEqual(5);
        expect(['BULLISH', 'BEARISH', 'NEUTRAL']).toContain(trade.sentiment);
        expect(trade.thesis).toBeTruthy();
        expect(trade.createdAt).toBeTruthy();
        expect(trade.updatedAt).toBeTruthy();
      });
    });

    it('closed trades have exit prices', () => {
      TRADES.filter((t) => t.status === 'CLOSED').forEach((trade) => {
        expect(trade.exitPrice).toBeDefined();
        expect(trade.exitDate).toBeDefined();
      });
    });

    it('all trade IDs are unique', () => {
      const ids = TRADES.map((t) => t.id);
      const unique = new Set(ids);
      expect(unique.size).toBe(ids.length);
    });

    it('all notes have required fields', () => {
      TRADES.forEach((trade) => {
        trade.notes.forEach((note) => {
          expect(note.id).toBeTruthy();
          expect(note.content).toBeTruthy();
          expect(['analysis', 'update', 'macro', 'earnings', 'psychology', 'technical']).toContain(note.type);
          expect(note.createdAt).toBeTruthy();
        });
      });
    });
  });

  describe('STOCKS', () => {
    it('has stocks defined', () => {
      expect(STOCKS.length).toBeGreaterThan(0);
    });

    it('all stocks have required fields', () => {
      STOCKS.forEach((stock) => {
        expect(stock.symbol).toBeTruthy();
        expect(stock.company).toBeTruthy();
        expect(stock.price).toBeGreaterThan(0);
        expect(stock.volume).toBeGreaterThan(0);
        expect(stock.marketCap).toBeTruthy();
        expect(stock.sector).toBeTruthy();
        expect(stock.high52w).toBeGreaterThan(0);
        expect(stock.low52w).toBeGreaterThan(0);
        expect(stock.high52w).toBeGreaterThanOrEqual(stock.low52w);
      });
    });

    it('all symbols from trades exist in stocks', () => {
      const stockSymbols = new Set(STOCKS.map((s) => s.symbol));
      TRADES.forEach((trade) => {
        expect(stockSymbols.has(trade.symbol)).toBe(true);
      });
    });
  });

  describe('WATCHLIST', () => {
    it('has items', () => {
      expect(WATCHLIST.length).toBeGreaterThan(0);
    });

    it('all items have required fields', () => {
      WATCHLIST.forEach((item) => {
        expect(item.symbol).toBeTruthy();
        expect(item.company).toBeTruthy();
        expect(item.price).toBeGreaterThan(0);
        expect(item.notes).toBeTruthy();
        expect(item.addedAt).toBeTruthy();
      });
    });
  });

  describe('PORTFOLIO_METRICS', () => {
    it('has valid metrics', () => {
      expect(PORTFOLIO_METRICS.totalValue).toBeGreaterThan(0);
      expect(PORTFOLIO_METRICS.winRate).toBeGreaterThanOrEqual(0);
      expect(PORTFOLIO_METRICS.winRate).toBeLessThanOrEqual(100);
      expect(PORTFOLIO_METRICS.totalTrades).toBeGreaterThan(0);
      expect(PORTFOLIO_METRICS.openPositions).toBeGreaterThanOrEqual(0);
      expect(PORTFOLIO_METRICS.sharpeRatio).toBeDefined();
    });
  });

  describe('MARKET_EVENTS', () => {
    it('has events', () => {
      expect(MARKET_EVENTS.length).toBeGreaterThan(0);
    });

    it('all events have required fields', () => {
      MARKET_EVENTS.forEach((event) => {
        expect(event.id).toBeTruthy();
        expect(event.title).toBeTruthy();
        expect(['earnings', 'macro', 'insider', 'sentiment', 'volume']).toContain(event.type);
        expect(event.description).toBeTruthy();
        expect(event.date).toBeTruthy();
        expect(['high', 'medium', 'low']).toContain(event.impact);
      });
    });
  });

  describe('TICKER_DATA', () => {
    it('has ticker items', () => {
      expect(TICKER_DATA.length).toBeGreaterThan(0);
    });

    it('all items have symbol and price', () => {
      TICKER_DATA.forEach((item) => {
        expect(item.symbol).toBeTruthy();
        expect(item.price).toBeGreaterThan(0);
        expect(typeof item.change).toBe('number');
      });
    });
  });

  describe('SECTOR_PERFORMANCE', () => {
    it('has sector data', () => {
      expect(SECTOR_PERFORMANCE.length).toBeGreaterThan(0);
    });

    it('all sectors have required fields', () => {
      SECTOR_PERFORMANCE.forEach((sector) => {
        expect(sector.sector).toBeTruthy();
        expect(typeof sector.performance).toBe('number');
        expect(sector.color).toMatch(/^#[0-9a-f]{6}$/);
      });
    });
  });
});

describe('generateCandleData', () => {
  it('generates data with correct number of trading days', () => {
    const data = generateCandleData('TEST', 30, 100);
    // Should have ~21 trading days for 30 calendar days (minus weekends)
    expect(data.length).toBeGreaterThan(15);
    expect(data.length).toBeLessThanOrEqual(30);
  });

  it('generates valid OHLCV data', () => {
    const data = generateCandleData('TEST', 10, 100);
    data.forEach((candle) => {
      expect(candle.time).toBeTruthy();
      expect(candle.open).toBeGreaterThan(0);
      expect(candle.high).toBeGreaterThanOrEqual(Math.max(candle.open, candle.close));
      expect(candle.low).toBeLessThanOrEqual(Math.min(candle.open, candle.close));
      expect(candle.close).toBeGreaterThan(0);
      if (candle.volume !== undefined) {
        expect(candle.volume).toBeGreaterThan(0);
      }
    });
  });

  it('is deterministic for the same symbol', () => {
    const data1 = generateCandleData('NVDA', 30, 100);
    const data2 = generateCandleData('NVDA', 30, 100);
    expect(data1).toEqual(data2);
  });

  it('generates different data for different symbols', () => {
    const data1 = generateCandleData('AAPL', 30, 100);
    const data2 = generateCandleData('NVDA', 30, 100);
    expect(data1[0].close).not.toBe(data2[0].close);
  });

  it('respects base price', () => {
    const data = generateCandleData('TEST', 5, 500);
    // First candle should be near base price
    expect(data[0].open).toBeGreaterThan(400);
    expect(data[0].open).toBeLessThan(600);
  });

  it('excludes weekends', () => {
    const data = generateCandleData('TEST', 60, 100);
    data.forEach((candle) => {
      const date = new Date(candle.time + 'T12:00:00Z');
      expect(date.getUTCDay()).not.toBe(0); // Sunday
      expect(date.getUTCDay()).not.toBe(6); // Saturday
    });
  });

  it('data is chronologically ordered', () => {
    const data = generateCandleData('TEST', 60, 100);
    for (let i = 1; i < data.length; i++) {
      expect(data[i].time > data[i - 1].time).toBe(true);
    }
  });
});
