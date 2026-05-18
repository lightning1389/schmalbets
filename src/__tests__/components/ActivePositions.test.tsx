import React from 'react';
import { render, screen } from '@testing-library/react';
import { ActivePositions } from '@/components/dashboard/ActivePositions';
import { Trade } from '@/lib/types';

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const makeTrade = (overrides: Partial<Trade> = {}): Trade => ({
  id: 'trade-1',
  symbol: 'ASTS',
  company: 'AST SpaceMobile',
  direction: 'BUY',
  status: 'OPEN',
  entryPrice: 24.12,
  currentPrice: 24.12,
  shares: 100,
  conviction: 5,
  sentiment: 'BULLISH',
  sector: 'Technology',
  entryDate: '2025-12-10',
  createdAt: '2025-12-10T00:00:00Z',
  updatedAt: '2025-12-10T00:00:00Z',
  thesis: 'Space connectivity play',
  notes: [],
  targets: [],
  tags: [],
  ...overrides,
});

describe('ActivePositions', () => {
  it('renders section header and position count', () => {
    const trades = [makeTrade()];
    render(<ActivePositions trades={trades} />);

    expect(screen.getByText('ACTIVE POSITIONS')).toBeInTheDocument();
    expect(screen.getByText('1 open positions')).toBeInTheDocument();
  });

  it('renders VIEW ALL link', () => {
    render(<ActivePositions trades={[makeTrade()]} />);
    expect(screen.getByText('VIEW ALL →')).toBeInTheDocument();
  });

  it('displays trade symbol and sector', () => {
    render(<ActivePositions trades={[makeTrade()]} />);
    expect(screen.getByText('ASTS')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('displays BUY direction badge', () => {
    render(<ActivePositions trades={[makeTrade({ direction: 'BUY' })]} />);
    expect(screen.getByText('BUY')).toBeInTheDocument();
  });

  it('displays entry price', () => {
    render(<ActivePositions trades={[makeTrade({ entryPrice: 24.12, currentPrice: 30.00 })]} />);
    expect(screen.getByText('$24.12')).toBeInTheDocument();
  });

  it('shows zero P&L when current price equals entry price', () => {
    const trade = makeTrade({ entryPrice: 24.12, currentPrice: 24.12 });
    render(<ActivePositions trades={[trade]} />);

    expect(screen.getByText('+$0.00')).toBeInTheDocument();
    expect(screen.getByText('+0.00%')).toBeInTheDocument();
  });

  it('shows positive P&L when current price is higher than entry', () => {
    const trade = makeTrade({ entryPrice: 24.12, currentPrice: 35.42, shares: 100 });
    render(<ActivePositions trades={[trade]} />);

    // P&L value: (35.42 - 24.12) * 100 = $1,130.00
    expect(screen.getByText('+$1,130.00')).toBeInTheDocument();
    // P&L %: ((35.42 - 24.12) / 24.12) * 100 = 46.85%
    expect(screen.getByText('+46.85%')).toBeInTheDocument();
  });

  it('shows negative P&L when current price is lower than entry', () => {
    const trade = makeTrade({ entryPrice: 24.12, currentPrice: 20.00, shares: 100 });
    render(<ActivePositions trades={[trade]} />);

    // P&L value: (20 - 24.12) * 100 = -$412.00
    expect(screen.getByText('-$412.00')).toBeInTheDocument();
    // P&L %: ((20 - 24.12) / 24.12) * 100 = -17.08%
    expect(screen.getByText('-17.08%')).toBeInTheDocument();
  });

  it('displays number of shares', () => {
    render(<ActivePositions trades={[makeTrade({ shares: 100 })]} />);
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('displays conviction label', () => {
    render(<ActivePositions trades={[makeTrade({ conviction: 5 })]} />);
    expect(screen.getByText('MAXIMUM')).toBeInTheDocument();
  });

  it('displays entry date formatted', () => {
    render(<ActivePositions trades={[makeTrade({ entryDate: '2025-12-10' })]} />);
    // Date parsing of '2025-12-10' as UTC may show Dec 9 or Dec 10 depending on timezone
    const dateCell = screen.getByText(/Dec (9|10), 2025/);
    expect(dateCell).toBeInTheDocument();
  });

  it('only shows OPEN trades', () => {
    const trades = [
      makeTrade({ id: '1', symbol: 'ASTS', status: 'OPEN' }),
      makeTrade({ id: '2', symbol: 'NVDA', status: 'CLOSED' }),
    ];
    render(<ActivePositions trades={trades} />);

    expect(screen.getByText('ASTS')).toBeInTheDocument();
    expect(screen.queryByText('NVDA')).not.toBeInTheDocument();
    expect(screen.getByText('1 open positions')).toBeInTheDocument();
  });

  it('shows correct current price after live update', () => {
    // Simulates what happens when fetchLivePrices updates currentPrice
    const trade = makeTrade({ entryPrice: 24.12, currentPrice: 35.42 });
    render(<ActivePositions trades={[trade]} />);

    expect(screen.getByText('$35.42')).toBeInTheDocument();
  });

  it('renders multiple open positions', () => {
    const trades = [
      makeTrade({ id: '1', symbol: 'ASTS', status: 'OPEN' }),
      makeTrade({ id: '2', symbol: 'NVDA', status: 'OPEN', entryPrice: 100, currentPrice: 130 }),
    ];
    render(<ActivePositions trades={trades} />);

    expect(screen.getByText('2 open positions')).toBeInTheDocument();
    expect(screen.getByText('ASTS')).toBeInTheDocument();
    expect(screen.getByText('NVDA')).toBeInTheDocument();
  });
});
