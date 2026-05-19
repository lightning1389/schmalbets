import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MarketSentiment } from '@/components/landing/MarketSentiment';

// Mock IntersectionObserver for framer-motion
beforeAll(() => {
  const mockIntersectionObserver = jest.fn().mockReturnValue({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  });
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: mockIntersectionObserver,
  });
});

const mockFearGreed = jest.fn();
const mockMarketOverview = jest.fn();

jest.mock('@/lib/priceService', () => ({
  fetchFearGreed: (...args: unknown[]) => mockFearGreed(...args),
  fetchMarketOverview: (...args: unknown[]) => mockMarketOverview(...args),
}));

beforeEach(() => {
  mockFearGreed.mockReset();
  mockMarketOverview.mockReset();
});

describe('MarketSentiment', () => {
  it('shows loading state initially', () => {
    mockFearGreed.mockReturnValue(new Promise(() => {})); // never resolves
    mockMarketOverview.mockReturnValue(new Promise(() => {}));

    render(<MarketSentiment />);
    expect(screen.getByText('LOADING...')).toBeInTheDocument();
  });

  it('renders Fear & Greed value of 60 as GREED', async () => {
    mockFearGreed.mockResolvedValue({ value: 60, label: 'GREED' });
    mockMarketOverview.mockResolvedValue({
      vix: 18.5,
      vixChange: -3.65,
      spxPrice: 5900,
      spxChange: 0.85,
      spxFromATH: -3.3,
    });

    render(<MarketSentiment />);

    await waitFor(() => {
      expect(screen.getByText('60')).toBeInTheDocument();
    });
    // The Fear & Greed label section — there are multiple "GREED" texts
    // (the FG label + the mood bar label), so use getAllByText
    const greedElements = screen.getAllByText('GREED');
    expect(greedElements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders VIX with correct value', async () => {
    mockFearGreed.mockResolvedValue({ value: 60, label: 'GREED' });
    mockMarketOverview.mockResolvedValue({
      vix: 18.5,
      vixChange: -3.65,
      spxPrice: 5900,
      spxChange: 0.85,
      spxFromATH: -3.3,
    });

    render(<MarketSentiment />);

    await waitFor(() => {
      expect(screen.getByText('18.50')).toBeInTheDocument();
    });
    expect(screen.getByText('-3.65%')).toBeInTheDocument();
    expect(screen.getByText('NORMAL')).toBeInTheDocument();
  });

  it('shows LOW volatility for VIX < 15', async () => {
    mockFearGreed.mockResolvedValue({ value: 80, label: 'EXTREME GREED' });
    mockMarketOverview.mockResolvedValue({
      vix: 12.0,
      vixChange: -1.0,
      spxPrice: 5900,
      spxChange: 0.5,
      spxFromATH: -2.0,
    });

    render(<MarketSentiment />);

    await waitFor(() => {
      expect(screen.getByText('12.00')).toBeInTheDocument();
    });
    expect(screen.getByText('LOW')).toBeInTheDocument();
  });

  it('shows ELEVATED volatility for VIX 20-30', async () => {
    mockFearGreed.mockResolvedValue({ value: 35, label: 'FEAR' });
    mockMarketOverview.mockResolvedValue({
      vix: 25.0,
      vixChange: 5.0,
      spxPrice: 5500,
      spxChange: -1.2,
      spxFromATH: -8.0,
    });

    render(<MarketSentiment />);

    await waitFor(() => {
      expect(screen.getByText('25.00')).toBeInTheDocument();
    });
    expect(screen.getByText('ELEVATED')).toBeInTheDocument();
  });

  it('shows HIGH volatility for VIX > 30', async () => {
    mockFearGreed.mockResolvedValue({ value: 15, label: 'EXTREME FEAR' });
    mockMarketOverview.mockResolvedValue({
      vix: 35.0,
      vixChange: 10.0,
      spxPrice: 5200,
      spxChange: -3.0,
      spxFromATH: -15.0,
    });

    render(<MarketSentiment />);

    await waitFor(() => {
      expect(screen.getByText('35.00')).toBeInTheDocument();
    });
    expect(screen.getByText('HIGH')).toBeInTheDocument();
  });

  it('renders S&P 500 price and change', async () => {
    mockFearGreed.mockResolvedValue({ value: 60, label: 'GREED' });
    mockMarketOverview.mockResolvedValue({
      vix: 18.5,
      vixChange: -2.0,
      spxPrice: 5900,
      spxChange: 0.85,
      spxFromATH: -3.3,
    });

    render(<MarketSentiment />);

    await waitFor(() => {
      expect(screen.getByText('5,900')).toBeInTheDocument();
    });
    expect(screen.getByText('+0.85%')).toBeInTheDocument();
    expect(screen.getByText('-3.3%')).toBeInTheDocument();
  });

  it('renders market mood matching fear/greed value', async () => {
    mockFearGreed.mockResolvedValue({ value: 60, label: 'GREED' });
    mockMarketOverview.mockResolvedValue({
      vix: 18.5,
      vixChange: -2.0,
      spxPrice: 5900,
      spxChange: 0.85,
      spxFromATH: -3.3,
    });

    render(<MarketSentiment />);

    await waitFor(() => {
      // 60 → "GREEDY" mood
      expect(screen.getByText('🟢 GREEDY')).toBeInTheDocument();
    });
  });

  it('renders panic mood for extreme fear', async () => {
    mockFearGreed.mockResolvedValue({ value: 15, label: 'EXTREME FEAR' });
    mockMarketOverview.mockResolvedValue({
      vix: 35,
      vixChange: 10,
      spxPrice: 5200,
      spxChange: -3.0,
      spxFromATH: -15.0,
    });

    render(<MarketSentiment />);

    await waitFor(() => {
      expect(screen.getByText('🔴 PANIC')).toBeInTheDocument();
    });
  });

  it('handles null API responses gracefully (shows 0s)', async () => {
    mockFearGreed.mockResolvedValue(null);
    mockMarketOverview.mockResolvedValue(null);

    render(<MarketSentiment />);

    await waitFor(() => {
      // Should show 0.00 for VIX, 0 for FG value
      expect(screen.getByText('0.00')).toBeInTheDocument();
    });
  });
});
