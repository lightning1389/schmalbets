import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCompactCurrency(value: number): string {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return formatCurrency(value);
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatVolume(value: number): string {
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toString();
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getTradeGain(entryPrice: number, currentPrice: number, direction: 'BUY' | 'SELL'): number {
  if (direction === 'BUY') {
    return ((currentPrice - entryPrice) / entryPrice) * 100;
  }
  return ((entryPrice - currentPrice) / entryPrice) * 100;
}

export function getTradeGainValue(entryPrice: number, currentPrice: number, shares: number, direction: 'BUY' | 'SELL'): number {
  if (direction === 'BUY') {
    return (currentPrice - entryPrice) * shares;
  }
  return (entryPrice - currentPrice) * shares;
}

export function getConvictionLabel(conviction: number): string {
  const labels: Record<number, string> = {
    1: 'LOW',
    2: 'MODERATE',
    3: 'MEDIUM',
    4: 'HIGH',
    5: 'MAXIMUM',
  };
  return labels[conviction] || 'UNKNOWN';
}

export function getConvictionColor(conviction: number): string {
  const colors: Record<number, string> = {
    1: '#8b949e',
    2: '#00bcd4',
    3: '#ff8800',
    4: '#00d4aa',
    5: '#00ff88',
  };
  return colors[conviction] || '#8b949e';
}

export function getDaysSince(dateStr: string): number {
  const now = new Date();
  const date = new Date(dateStr);
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
}

export function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}
