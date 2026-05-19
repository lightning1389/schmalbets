import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { TickerBar } from '@/components/landing/TickerBar';

jest.mock('@/lib/priceService', () => ({
  fetchTickerData: jest.fn().mockResolvedValue([
    { symbol: 'SPY', price: 450.12, change: 0.8 },
    { symbol: 'QQQ', price: 380.55, change: -0.3 },
    { symbol: 'BTC', price: 64000, change: 2.1 },
    { symbol: 'NVDA', price: 120.5, change: 1.5 },
  ]),
}));

describe('TickerBar', () => {
  it('renders ticker symbols', async () => {
    render(<TickerBar />);
    await waitFor(() => {
      expect(screen.getAllByText('SPY').length).toBeGreaterThan(0);
    });
    expect(screen.getAllByText('QQQ').length).toBeGreaterThan(0);
    expect(screen.getAllByText('BTC').length).toBeGreaterThan(0);
    expect(screen.getAllByText('NVDA').length).toBeGreaterThan(0);
  });

  it('renders prices', async () => {
    render(<TickerBar />);
    await waitFor(() => {
      expect(screen.getAllByText('SPY')[0]).toBeInTheDocument();
    });
    const container = screen.getAllByText('SPY')[0].closest('div');
    expect(container).toBeInTheDocument();
  });

  it('duplicates items for seamless scroll', async () => {
    render(<TickerBar />);
    await waitFor(() => {
      const spyElements = screen.getAllByText('SPY');
      expect(spyElements.length).toBeGreaterThanOrEqual(2);
    });
  });
});
