import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StockCard } from '@/components/dashboard/StockCard';
import { StockData } from '@/lib/types';

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

const mockStock: StockData = {
  symbol: 'NVDA',
  company: 'NVIDIA Corporation',
  price: 1148.25,
  change: 42.15,
  changePercent: 3.81,
  volume: 58420000,
  marketCap: '2.83T',
  sector: 'Technology',
  high52w: 1162.50,
  low52w: 373.56,
};

const negativeStock: StockData = {
  ...mockStock,
  symbol: 'TSLA',
  company: 'Tesla Inc.',
  change: -5.20,
  changePercent: -2.84,
};

describe('StockCard', () => {
  it('renders stock symbol', () => {
    render(<StockCard stock={mockStock} />);
    expect(screen.getByText('NVDA')).toBeInTheDocument();
  });

  it('renders company name', () => {
    render(<StockCard stock={mockStock} />);
    expect(screen.getByText('NVIDIA Corporation')).toBeInTheDocument();
  });

  it('renders stock price', () => {
    render(<StockCard stock={mockStock} />);
    expect(screen.getByText(/1,?148\.25/)).toBeInTheDocument();
  });

  it('renders positive change percent', () => {
    render(<StockCard stock={mockStock} />);
    expect(screen.getByText('+3.81%')).toBeInTheDocument();
  });

  it('renders negative change percent', () => {
    render(<StockCard stock={negativeStock} />);
    expect(screen.getByText('-2.84%')).toBeInTheDocument();
  });

  it('renders sector', () => {
    render(<StockCard stock={mockStock} />);
    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('links to stock page', () => {
    render(<StockCard stock={mockStock} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/stock/NVDA/');
  });

  it('renders compact mode', () => {
    render(<StockCard stock={mockStock} compact />);
    expect(screen.getByText('NVDA')).toBeInTheDocument();
  });

  it('renders volume in full mode', () => {
    render(<StockCard stock={mockStock} />);
    expect(screen.getByText('VOL')).toBeInTheDocument();
  });
});
