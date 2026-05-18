import {
  Trade,
  StockData,
  CandleData,
  PortfolioMetrics,
  WatchlistItem,
  MarketEvent,
} from './types';

export const TRADES: Trade[] = [
  {
    id: 'trade-001',
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
    thesis: 'AI infrastructure buildout is a generational megatrend. NVDA owns the compute layer. Data center revenue trajectory is parabolic. Every hyperscaler is in an arms race for GPU capacity.',
    notes: [
      {
        id: 'n1',
        content: 'Earnings crushed expectations. Data center revenue up 409% YoY. This is not a bubble — this is infrastructure.',
        type: 'earnings',
        createdAt: '2024-02-22T18:00:00Z',
      },
      {
        id: 'n2',
        content: 'Blackwell architecture announcement. Next-gen chips will maintain moat. AMD/Intel still 2 generations behind in software ecosystem.',
        type: 'technical',
        createdAt: '2024-03-01T10:00:00Z',
      },
      {
        id: 'n3',
        content: 'Position sizing increased. Conviction remains maximum. The AI capex cycle is still in early innings.',
        type: 'update',
        createdAt: '2024-03-10T14:00:00Z',
      },
    ],
    targets: [
      { price: 1200, label: 'Initial target' },
      { price: 1500, label: 'Extended target' },
    ],
    stopLoss: 750,
    tags: ['AI', 'semiconductors', 'mega-cap', 'momentum'],
  },
  {
    id: 'trade-002',
    symbol: 'AAPL',
    company: 'Apple Inc.',
    direction: 'SELL',
    status: 'CLOSED',
    entryPrice: 195.50,
    currentPrice: 172.30,
    exitPrice: 172.30,
    shares: 100,
    conviction: 3,
    sentiment: 'BEARISH',
    sector: 'Technology',
    entryDate: '2024-01-08',
    exitDate: '2024-02-20',
    createdAt: '2024-01-08T10:15:00Z',
    updatedAt: '2024-02-20T15:45:00Z',
    thesis: 'iPhone cycle peaking. China weakness. Services growth decelerating. Multiple compression incoming as AI narrative shifts capital elsewhere.',
    notes: [
      {
        id: 'n4',
        content: 'China iPhone sales down 24%. Vision Pro launch underwhelming for stock. Thesis playing out.',
        type: 'analysis',
        createdAt: '2024-01-22T09:00:00Z',
      },
      {
        id: 'n5',
        content: 'Closing position at $172.30. Target hit. Moving capital to higher conviction ideas.',
        type: 'update',
        createdAt: '2024-02-20T15:45:00Z',
      },
    ],
    targets: [
      { price: 175, label: 'Support test' },
      { price: 165, label: 'Breakdown target' },
    ],
    stopLoss: 205,
    tags: ['mega-cap', 'consumer', 'short'],
  },
  {
    id: 'trade-003',
    symbol: 'SMCI',
    company: 'Super Micro Computer',
    direction: 'BUY',
    status: 'OPEN',
    entryPrice: 284.30,
    currentPrice: 922.10,
    shares: 75,
    conviction: 4,
    sentiment: 'BULLISH',
    sector: 'Technology',
    entryDate: '2023-11-20',
    createdAt: '2023-11-20T11:00:00Z',
    updatedAt: '2024-03-12T16:00:00Z',
    thesis: 'AI server infrastructure pure play. Direct beneficiary of NVDA GPU demand. Revenue growth trajectory rivals dot-com era leaders. Liquid cooling moat.',
    notes: [
      {
        id: 'n6',
        content: 'Revenue guidance raised again. AI server demand is insatiable. This is the picks-and-shovels play of AI.',
        type: 'earnings',
        createdAt: '2024-01-29T18:30:00Z',
      },
      {
        id: 'n7',
        content: 'S&P 500 inclusion catalyst ahead. Institutional flows will accelerate.',
        type: 'analysis',
        createdAt: '2024-03-01T08:00:00Z',
      },
    ],
    targets: [
      { price: 1000, label: 'Psychological level' },
      { price: 1200, label: 'Full extension' },
    ],
    stopLoss: 220,
    tags: ['AI', 'servers', 'momentum', 'mid-cap'],
  },
  {
    id: 'trade-004',
    symbol: 'TSLA',
    company: 'Tesla Inc.',
    direction: 'SELL',
    status: 'OPEN',
    entryPrice: 248.50,
    currentPrice: 177.80,
    shares: 40,
    conviction: 4,
    sentiment: 'BEARISH',
    sector: 'Consumer',
    entryDate: '2024-01-02',
    createdAt: '2024-01-02T09:35:00Z',
    updatedAt: '2024-03-14T16:00:00Z',
    thesis: 'Margin compression from price cuts. EV competition intensifying globally. Cybertruck ramp challenges. Growth story transitioning to value trap.',
    notes: [
      {
        id: 'n8',
        content: 'Q4 deliveries missed. Margin guidance concerning. BYD now outselling globally.',
        type: 'analysis',
        createdAt: '2024-01-03T08:00:00Z',
      },
      {
        id: 'n9',
        content: 'Market finally pricing in the demand destruction. Still room to run lower.',
        type: 'psychology',
        createdAt: '2024-02-15T12:00:00Z',
      },
    ],
    targets: [
      { price: 170, label: 'Support zone' },
      { price: 150, label: 'Capitulation target' },
    ],
    stopLoss: 270,
    tags: ['EV', 'consumer', 'short', 'overvalued'],
  },
  {
    id: 'trade-005',
    symbol: 'META',
    company: 'Meta Platforms',
    direction: 'BUY',
    status: 'CLOSED',
    entryPrice: 312.80,
    currentPrice: 502.60,
    exitPrice: 502.60,
    shares: 60,
    conviction: 5,
    sentiment: 'BULLISH',
    sector: 'Technology',
    entryDate: '2023-10-15',
    exitDate: '2024-02-28',
    createdAt: '2023-10-15T10:00:00Z',
    updatedAt: '2024-02-28T16:00:00Z',
    thesis: 'Year of efficiency paying off. Reels monetization inflecting. AI-driven ad targeting improvements. Massive buyback program providing floor.',
    notes: [
      {
        id: 'n10',
        content: 'Earnings blowout. First ever dividend announced. The efficiency narrative is real.',
        type: 'earnings',
        createdAt: '2024-02-01T18:00:00Z',
      },
      {
        id: 'n11',
        content: 'Taking profits at $502.60. +60.7% gain. Rotating into higher beta AI plays.',
        type: 'update',
        createdAt: '2024-02-28T16:00:00Z',
      },
    ],
    targets: [
      { price: 450, label: 'Conservative target' },
      { price: 520, label: 'Stretch target' },
    ],
    stopLoss: 280,
    tags: ['social', 'AI', 'mega-cap', 'value'],
  },
  {
    id: 'trade-006',
    symbol: 'AMD',
    company: 'Advanced Micro Devices',
    direction: 'BUY',
    status: 'OPEN',
    entryPrice: 138.20,
    currentPrice: 192.45,
    shares: 80,
    conviction: 4,
    sentiment: 'BULLISH',
    sector: 'Technology',
    entryDate: '2024-01-22',
    createdAt: '2024-01-22T09:32:00Z',
    updatedAt: '2024-03-15T16:00:00Z',
    thesis: 'MI300X gaining traction. AI accelerator TAM expanding faster than supply. AMD is the clear #2 behind NVDA with improving software stack.',
    notes: [
      {
        id: 'n12',
        content: 'MI300X revenue guidance raised to $3.5B. Still underestimated by consensus.',
        type: 'earnings',
        createdAt: '2024-01-31T18:00:00Z',
      },
      {
        id: 'n13',
        content: 'EPYC server share gains continue. AI + server CPU is a dual catalyst story.',
        type: 'technical',
        createdAt: '2024-02-15T10:00:00Z',
      },
    ],
    targets: [
      { price: 210, label: 'Near term' },
      { price: 250, label: 'AI rerate target' },
    ],
    stopLoss: 120,
    tags: ['AI', 'semiconductors', 'growth'],
  },
  {
    id: 'trade-007',
    symbol: 'COIN',
    company: 'Coinbase Global',
    direction: 'BUY',
    status: 'OPEN',
    entryPrice: 125.40,
    currentPrice: 254.80,
    shares: 45,
    conviction: 3,
    sentiment: 'BULLISH',
    sector: 'Finance',
    entryDate: '2023-12-01',
    createdAt: '2023-12-01T10:00:00Z',
    updatedAt: '2024-03-14T16:00:00Z',
    thesis: 'Bitcoin ETF approval catalyst. Crypto infrastructure monopoly in US. Regulatory clarity improving. Base product launching on-chain economy.',
    notes: [
      {
        id: 'n14',
        content: 'Bitcoin ETF approved. COIN is the custodian for most ETFs. Revenue diversification improving.',
        type: 'macro',
        createdAt: '2024-01-11T12:00:00Z',
      },
    ],
    targets: [
      { price: 280, label: 'ETF flow target' },
      { price: 350, label: 'Crypto bull market target' },
    ],
    stopLoss: 100,
    tags: ['crypto', 'fintech', 'ETF'],
  },
  {
    id: 'trade-008',
    symbol: 'XOM',
    company: 'Exxon Mobil',
    direction: 'SELL',
    status: 'CLOSED',
    entryPrice: 104.20,
    currentPrice: 98.50,
    exitPrice: 98.50,
    shares: 50,
    conviction: 2,
    sentiment: 'BEARISH',
    sector: 'Energy',
    entryDate: '2024-02-01',
    exitDate: '2024-03-01',
    createdAt: '2024-02-01T09:30:00Z',
    updatedAt: '2024-03-01T16:00:00Z',
    thesis: 'Oil demand peaking. Renewable transition accelerating. China demand weaker than expected.',
    notes: [
      {
        id: 'n15',
        content: 'Small winner. Not enough conviction to hold longer. Opportunity cost too high.',
        type: 'update',
        createdAt: '2024-03-01T16:00:00Z',
      },
    ],
    targets: [{ price: 95, label: 'Demand destruction' }],
    stopLoss: 110,
    tags: ['energy', 'oil', 'short'],
  },
];

export const STOCKS: StockData[] = [
  { symbol: 'NVDA', company: 'NVIDIA Corporation', price: 1148.25, change: 42.15, changePercent: 3.81, volume: 58420000, marketCap: '2.83T', sector: 'Technology', high52w: 1162.50, low52w: 373.56 },
  { symbol: 'AAPL', company: 'Apple Inc.', price: 172.30, change: -1.85, changePercent: -1.06, volume: 62180000, marketCap: '2.66T', sector: 'Technology', high52w: 199.62, low52w: 164.08 },
  { symbol: 'SMCI', company: 'Super Micro Computer', price: 922.10, change: 28.40, changePercent: 3.18, volume: 12450000, marketCap: '53.8B', sector: 'Technology', high52w: 1229.00, low52w: 226.59 },
  { symbol: 'TSLA', company: 'Tesla Inc.', price: 177.80, change: -5.20, changePercent: -2.84, volume: 98750000, marketCap: '567B', sector: 'Consumer', high52w: 299.29, low52w: 152.37 },
  { symbol: 'META', company: 'Meta Platforms', price: 502.60, change: 8.30, changePercent: 1.68, volume: 21340000, marketCap: '1.28T', sector: 'Technology', high52w: 531.49, low52w: 274.38 },
  { symbol: 'AMD', company: 'Advanced Micro Devices', price: 192.45, change: 4.80, changePercent: 2.56, volume: 45620000, marketCap: '310B', sector: 'Technology', high52w: 227.30, low52w: 93.12 },
  { symbol: 'COIN', company: 'Coinbase Global', price: 254.80, change: 12.60, changePercent: 5.20, volume: 15890000, marketCap: '61.2B', sector: 'Finance', high52w: 283.48, low52w: 70.67 },
  { symbol: 'XOM', company: 'Exxon Mobil', price: 98.50, change: -0.45, changePercent: -0.46, volume: 18920000, marketCap: '396B', sector: 'Energy', high52w: 120.70, low52w: 95.77 },
];

export const WATCHLIST: WatchlistItem[] = [
  { symbol: 'PLTR', company: 'Palantir Technologies', price: 24.85, change: 1.20, changePercent: 5.07, notes: 'AI government contracts expanding. AIP momentum. Watching for enterprise breakout.', addedAt: '2024-03-10' },
  { symbol: 'MSTR', company: 'MicroStrategy', price: 1685.20, change: 85.40, changePercent: 5.34, notes: 'Bitcoin proxy trade. Saylor accumulation strategy. High beta BTC exposure.', addedAt: '2024-03-05' },
  { symbol: 'AVGO', company: 'Broadcom Inc.', price: 1380.50, change: 22.30, changePercent: 1.64, notes: 'VMware integration. AI networking ASIC opportunity. Dividend growth.', addedAt: '2024-02-28' },
  { symbol: 'PANW', company: 'Palo Alto Networks', price: 298.40, change: -4.20, changePercent: -1.39, notes: 'Cybersecurity consolidation play. Platformization strategy. Watching for entry.', addedAt: '2024-03-01' },
  { symbol: 'CRWD', company: 'CrowdStrike', price: 312.80, change: 6.50, changePercent: 2.12, notes: 'Cloud security leader. ARR growth impressive. Valuation stretched but quality.', addedAt: '2024-02-20' },
];

export const PORTFOLIO_METRICS: PortfolioMetrics = {
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

export const MARKET_EVENTS: MarketEvent[] = [
  { id: 'evt-1', title: 'NVDA Earnings Report', type: 'earnings', description: 'Q4 FY2024 earnings after market close. Expected EPS $4.59.', date: '2024-02-21', impact: 'high', symbols: ['NVDA'] },
  { id: 'evt-2', title: 'Fed Rate Decision', type: 'macro', description: 'FOMC meeting concludes. Rate decision and dot plot release.', date: '2024-03-20', impact: 'high' },
  { id: 'evt-3', title: 'SMCI S&P 500 Inclusion', type: 'macro', description: 'Super Micro Computer added to S&P 500 index.', date: '2024-03-18', impact: 'high', symbols: ['SMCI'] },
  { id: 'evt-4', title: 'Unusual Options Activity: AMD', type: 'volume', description: 'Large call sweeps detected at $200 strike for April expiry.', date: '2024-03-15', impact: 'medium', symbols: ['AMD'] },
  { id: 'evt-5', title: 'Bitcoin Halving Approaching', type: 'macro', description: 'Bitcoin halving event expected April 2024. Historical catalyst for crypto.', date: '2024-04-15', impact: 'high', symbols: ['COIN'] },
  { id: 'evt-6', title: 'META Insider Sale', type: 'insider', description: 'Zuckerberg sells $400M in shares per 10b5-1 plan.', date: '2024-03-12', impact: 'low', symbols: ['META'] },
];

function seedRandom(seed: number) {
  return function () {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

export function generateCandleData(
  symbol: string,
  days: number = 180,
  basePrice: number = 100
): CandleData[] {
  const random = seedRandom(symbol.split('').reduce((a, c) => a + c.charCodeAt(0), 0));
  const data: CandleData[] = [];
  let price = basePrice;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const volatility = 0.02 + random() * 0.03;
    const drift = (random() - 0.48) * 0.01;
    const open = price;
    const changePercent = drift + (random() - 0.5) * volatility;
    const close = open * (1 + changePercent);
    const high = Math.max(open, close) * (1 + random() * 0.015);
    const low = Math.min(open, close) * (1 - random() * 0.015);

    data.push({
      time: date.toISOString().split('T')[0],
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume: Math.round(1000000 + random() * 50000000),
    });

    price = close;
  }

  return data;
}

export const TICKER_DATA = [
  { symbol: 'SPY', price: 512.40, change: 0.85 },
  { symbol: 'QQQ', price: 445.20, change: 1.22 },
  { symbol: 'DIA', price: 394.80, change: 0.31 },
  { symbol: 'IWM', price: 208.60, change: -0.45 },
  { symbol: 'VIX', price: 14.25, change: -3.20 },
  { symbol: 'BTC', price: 72450, change: 4.12 },
  { symbol: 'ETH', price: 4020, change: 3.85 },
  { symbol: 'GOLD', price: 2185, change: 0.62 },
  { symbol: 'OIL', price: 78.40, change: -1.15 },
  { symbol: 'DXY', price: 103.20, change: -0.18 },
  { symbol: '10Y', price: 4.28, change: 0.02 },
  { symbol: 'NVDA', price: 1148.25, change: 3.81 },
  { symbol: 'AAPL', price: 172.30, change: -1.06 },
  { symbol: 'TSLA', price: 177.80, change: -2.84 },
  { symbol: 'META', price: 502.60, change: 1.68 },
  { symbol: 'AMD', price: 192.45, change: 2.56 },
];

export const SECTOR_PERFORMANCE = [
  { sector: 'Technology', performance: 12.4, color: '#00d4aa' },
  { sector: 'Healthcare', performance: 3.2, color: '#00bcd4' },
  { sector: 'Finance', performance: 8.1, color: '#4caf50' },
  { sector: 'Energy', performance: -2.4, color: '#ff4444' },
  { sector: 'Consumer', performance: -1.8, color: '#ff6b35' },
  { sector: 'Industrial', performance: 5.6, color: '#7c4dff' },
  { sector: 'Real Estate', performance: -3.1, color: '#ff4444' },
  { sector: 'Utilities', performance: 1.2, color: '#8bc34a' },
  { sector: 'Materials', performance: 2.8, color: '#00bcd4' },
  { sector: 'Telecom', performance: 4.5, color: '#00d4aa' },
];
