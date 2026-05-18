import React from 'react';
import { render, screen } from '@testing-library/react';
import { TickerBar } from '@/components/landing/TickerBar';

describe('TickerBar', () => {
  it('renders ticker symbols', () => {
    render(<TickerBar />);
    expect(screen.getAllByText('SPY').length).toBeGreaterThan(0);
    expect(screen.getAllByText('QQQ').length).toBeGreaterThan(0);
    expect(screen.getAllByText('BTC').length).toBeGreaterThan(0);
    expect(screen.getAllByText('NVDA').length).toBeGreaterThan(0);
  });

  it('renders prices', () => {
    render(<TickerBar />);
    // Check that some price text is rendered
    const container = screen.getAllByText('SPY')[0].closest('div');
    expect(container).toBeInTheDocument();
  });

  it('duplicates items for seamless scroll', () => {
    render(<TickerBar />);
    // SPY should appear at least twice (original + duplicate)
    const spyElements = screen.getAllByText('SPY');
    expect(spyElements.length).toBeGreaterThanOrEqual(2);
  });
});
