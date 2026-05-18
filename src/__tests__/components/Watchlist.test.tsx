import React from 'react';
import { render, screen } from '@testing-library/react';
import { Watchlist } from '@/components/dashboard/Watchlist';
import { WatchlistItem } from '@/lib/types';

const mockWatchlist: WatchlistItem[] = [
  {
    symbol: 'PLTR',
    company: 'Palantir Technologies',
    price: 24.85,
    change: 1.20,
    changePercent: 5.07,
    notes: 'AI government contracts expanding.',
    addedAt: '2024-03-10',
  },
  {
    symbol: 'AVGO',
    company: 'Broadcom Inc.',
    price: 1380.50,
    change: -4.20,
    changePercent: -0.30,
    notes: 'VMware integration play.',
    addedAt: '2024-02-28',
  },
];

describe('Watchlist', () => {
  it('renders all watchlist items', () => {
    render(<Watchlist items={mockWatchlist} />);
    expect(screen.getByText('PLTR')).toBeInTheDocument();
    expect(screen.getByText('AVGO')).toBeInTheDocument();
  });

  it('renders company names', () => {
    render(<Watchlist items={mockWatchlist} />);
    expect(screen.getByText('Palantir Technologies')).toBeInTheDocument();
    expect(screen.getByText('Broadcom Inc.')).toBeInTheDocument();
  });

  it('renders prices', () => {
    render(<Watchlist items={mockWatchlist} />);
    expect(screen.getByText('$24.85')).toBeInTheDocument();
    expect(screen.getByText('$1380.50')).toBeInTheDocument();
  });

  it('renders notes', () => {
    render(<Watchlist items={mockWatchlist} />);
    expect(screen.getByText('AI government contracts expanding.')).toBeInTheDocument();
  });

  it('renders section header', () => {
    render(<Watchlist items={mockWatchlist} />);
    expect(screen.getByText('WATCHLIST')).toBeInTheDocument();
  });

  it('renders with empty watchlist', () => {
    render(<Watchlist items={[]} />);
    expect(screen.getByText('WATCHLIST')).toBeInTheDocument();
  });
});
