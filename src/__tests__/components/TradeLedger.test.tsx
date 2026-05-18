import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TradeLedger } from '@/components/trades/TradeLedger';
import { Trade } from '@/lib/types';

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const filteredProps = Object.fromEntries(
        Object.entries(props).filter(([key]) =>
          !['initial', 'animate', 'exit', 'transition', 'whileInView', 'viewport', 'layout'].includes(key)
        )
      );
      return <div {...filteredProps}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

const mockTrades: Trade[] = [
  {
    id: 'trade-1',
    symbol: 'NVDA',
    company: 'NVIDIA Corporation',
    direction: 'BUY',
    status: 'OPEN',
    entryPrice: 824.15,
    currentPrice: 1148.25,
    shares: 50,
    conviction: 5,
    sentiment: 'BULLISH',
    sector: 'Technology',
    entryDate: '2024-01-15',
    createdAt: '2024-01-15T09:30:00Z',
    updatedAt: '2024-03-15T16:00:00Z',
    thesis: 'AI infrastructure is a generational megatrend.',
    notes: [
      {
        id: 'n1',
        content: 'Earnings crushed expectations.',
        type: 'earnings',
        createdAt: '2024-02-22T18:00:00Z',
      },
    ],
    targets: [{ price: 1200, label: 'Initial target' }],
    stopLoss: 750,
    tags: ['AI', 'semiconductors'],
  },
  {
    id: 'trade-2',
    symbol: 'TSLA',
    company: 'Tesla Inc.',
    direction: 'SELL',
    status: 'CLOSED',
    entryPrice: 248.50,
    currentPrice: 177.80,
    exitPrice: 177.80,
    shares: 40,
    conviction: 4,
    sentiment: 'BEARISH',
    sector: 'Consumer',
    entryDate: '2024-01-02',
    exitDate: '2024-03-01',
    createdAt: '2024-01-02T09:35:00Z',
    updatedAt: '2024-03-14T16:00:00Z',
    thesis: 'Margin compression from price cuts.',
    notes: [],
    targets: [{ price: 170, label: 'Support zone' }],
    stopLoss: 270,
    tags: ['EV', 'short'],
  },
];

describe('TradeLedger', () => {
  it('renders all trades', () => {
    render(<TradeLedger trades={mockTrades} />);
    expect(screen.getByText('NVDA')).toBeInTheDocument();
    expect(screen.getByText('TSLA')).toBeInTheDocument();
  });

  it('shows trade count', () => {
    render(<TradeLedger trades={mockTrades} />);
    expect(screen.getByText(/2 of 2 trades/)).toBeInTheDocument();
  });

  it('filters by direction BUY', () => {
    render(<TradeLedger trades={mockTrades} />);
    const buyButton = screen.getAllByText('BUY')[0];
    fireEvent.click(buyButton);
    expect(screen.getByText('NVDA')).toBeInTheDocument();
    expect(screen.getByText(/1 of 2 trades/)).toBeInTheDocument();
  });

  it('filters by direction SELL', () => {
    render(<TradeLedger trades={mockTrades} />);
    // Find the SELL filter button (not the trade direction badge)
    const sellButtons = screen.getAllByText('SELL');
    fireEvent.click(sellButtons[0]); // Click the filter button
    expect(screen.getByText('TSLA')).toBeInTheDocument();
  });

  it('filters by status OPEN', () => {
    render(<TradeLedger trades={mockTrades} />);
    const openButton = screen.getAllByText('OPEN')[0];
    fireEvent.click(openButton);
    expect(screen.getByText('NVDA')).toBeInTheDocument();
  });

  it('filters by status CLOSED', () => {
    render(<TradeLedger trades={mockTrades} />);
    const closedButton = screen.getAllByText('CLOSED')[0];
    fireEvent.click(closedButton);
    expect(screen.getByText('TSLA')).toBeInTheDocument();
  });

  it('searches by symbol', () => {
    render(<TradeLedger trades={mockTrades} />);
    const searchInput = screen.getByPlaceholderText(/Search/);
    fireEvent.change(searchInput, { target: { value: 'NVDA' } });
    expect(screen.getByText('NVDA')).toBeInTheDocument();
    expect(screen.getByText(/1 of 2 trades/)).toBeInTheDocument();
  });

  it('searches by company name', () => {
    render(<TradeLedger trades={mockTrades} />);
    const searchInput = screen.getByPlaceholderText(/Search/);
    fireEvent.change(searchInput, { target: { value: 'Tesla' } });
    expect(screen.getByText('TSLA')).toBeInTheDocument();
  });

  it('searches by tag', () => {
    render(<TradeLedger trades={mockTrades} />);
    const searchInput = screen.getByPlaceholderText(/Search/);
    fireEvent.change(searchInput, { target: { value: 'EV' } });
    expect(screen.getByText('TSLA')).toBeInTheDocument();
  });

  it('shows empty state when no results match', () => {
    render(<TradeLedger trades={mockTrades} />);
    const searchInput = screen.getByPlaceholderText(/Search/);
    fireEvent.change(searchInput, { target: { value: 'NONEXISTENT' } });
    expect(screen.getByText(/No trades match/)).toBeInTheDocument();
  });

  it('shows open and closed counts', () => {
    render(<TradeLedger trades={mockTrades} />);
    expect(screen.getByText(/1 OPEN/)).toBeInTheDocument();
    expect(screen.getByText(/1 CLOSED/)).toBeInTheDocument();
  });

  it('resets to ALL when clicking ALL filter', () => {
    render(<TradeLedger trades={mockTrades} />);
    // Filter by BUY first
    const buyButton = screen.getAllByText('BUY')[0];
    fireEvent.click(buyButton);
    expect(screen.getByText(/1 of 2 trades/)).toBeInTheDocument();

    // Click ALL to reset
    const allButtons = screen.getAllByText('ALL');
    fireEvent.click(allButtons[0]);
    expect(screen.getByText(/2 of 2 trades/)).toBeInTheDocument();
  });
});
