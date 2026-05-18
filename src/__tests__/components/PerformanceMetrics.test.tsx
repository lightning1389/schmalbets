import React from 'react';
import { render, screen } from '@testing-library/react';
import { PerformanceMetrics } from '@/components/dashboard/PerformanceMetrics';
import { PortfolioMetrics } from '@/lib/types';

// Mock AnimatedCounter to avoid RAF issues in tests
jest.mock('@/components/ui/AnimatedCounter', () => ({
  AnimatedCounter: ({ value, prefix, suffix }: { value: number; prefix?: string; suffix?: string }) => (
    <span>{prefix}{value}{suffix}</span>
  ),
}));

const mockMetrics: PortfolioMetrics = {
  totalValue: 482650,
  totalGain: 127840,
  totalGainPercent: 36.02,
  winRate: 75.0,
  totalTrades: 8,
  openPositions: 5,
  bestTrade: { symbol: 'SMCI', gain: 224.4 },
  worstTrade: { symbol: 'XOM', gain: -5.5 },
  avgHoldingDays: 68,
  sharpeRatio: 2.14,
};

describe('PerformanceMetrics', () => {
  it('renders portfolio value label', () => {
    render(<PerformanceMetrics metrics={mockMetrics} />);
    expect(screen.getByText('PORTFOLIO VALUE')).toBeInTheDocument();
  });

  it('renders total P&L label', () => {
    render(<PerformanceMetrics metrics={mockMetrics} />);
    expect(screen.getByText('TOTAL P&L')).toBeInTheDocument();
  });

  it('renders win rate label', () => {
    render(<PerformanceMetrics metrics={mockMetrics} />);
    expect(screen.getByText('WIN RATE')).toBeInTheDocument();
  });

  it('renders sharpe ratio label', () => {
    render(<PerformanceMetrics metrics={mockMetrics} />);
    expect(screen.getByText('SHARPE RATIO')).toBeInTheDocument();
  });

  it('renders open positions label', () => {
    render(<PerformanceMetrics metrics={mockMetrics} />);
    expect(screen.getByText('OPEN POSITIONS')).toBeInTheDocument();
  });

  it('renders avg holding label', () => {
    render(<PerformanceMetrics metrics={mockMetrics} />);
    expect(screen.getByText('AVG HOLDING')).toBeInTheDocument();
  });

  it('renders six metric cards', () => {
    const { container } = render(<PerformanceMetrics metrics={mockMetrics} />);
    const cards = container.querySelectorAll('.glass-card');
    expect(cards.length).toBe(6);
  });
});
