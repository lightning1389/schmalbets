export type TradeDirection = 'BUY' | 'SELL';
export type TradeStatus = 'OPEN' | 'CLOSED' | 'PARTIAL';
export type Conviction = 1 | 2 | 3 | 4 | 5;
export type Sentiment = 'BULLISH' | 'BEARISH' | 'NEUTRAL';
export type Sector =
  | 'Technology'
  | 'Healthcare'
  | 'Finance'
  | 'Energy'
  | 'Consumer'
  | 'Industrial'
  | 'Real Estate'
  | 'Utilities'
  | 'Materials'
  | 'Telecom';

export interface Trade {
  id: string;
  symbol: string;
  company: string;
  direction: TradeDirection;
  status: TradeStatus;
  entryPrice: number;
  currentPrice: number;
  exitPrice?: number;
  shares: number;
  conviction: Conviction;
  sentiment: Sentiment;
  sector: Sector;
  entryDate: string;
  exitDate?: string;
  createdAt: string;
  updatedAt: string;
  notes: TradeNote[];
  thesis: string;
  targets: {
    price: number;
    label: string;
  }[];
  stopLoss?: number;
  tags: string[];
}

export interface TradeNote {
  id: string;
  content: string;
  type: 'analysis' | 'update' | 'macro' | 'earnings' | 'psychology' | 'technical';
  createdAt: string;
}

export interface StockData {
  symbol: string;
  company: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  sector: Sector;
  high52w: number;
  low52w: number;
}

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface ChartMarker {
  time: string;
  position: 'aboveBar' | 'belowBar';
  color: string;
  shape: 'arrowUp' | 'arrowDown' | 'circle';
  text: string;
  tradeId: string;
}

export interface PortfolioMetrics {
  totalValue: number;
  totalGain: number;
  totalGainPercent: number;
  winRate: number;
  totalTrades: number;
  openPositions: number;
  bestTrade: { symbol: string; gain: number };
  worstTrade: { symbol: string; gain: number };
  avgHoldingDays: number;
  sharpeRatio: number;
}

export interface WatchlistItem {
  symbol: string;
  company: string;
  price: number;
  change: number;
  changePercent: number;
  notes: string;
  addedAt: string;
}

export interface MarketEvent {
  id: string;
  title: string;
  type: 'earnings' | 'macro' | 'insider' | 'sentiment' | 'volume';
  description: string;
  date: string;
  impact: 'high' | 'medium' | 'low';
  symbols?: string[];
}

export interface AdminUser {
  authenticated: boolean;
  sessionExpiry: number;
}
