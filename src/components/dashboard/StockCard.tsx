'use client';

import Link from 'next/link';
import { StockData } from '@/lib/types';
import { formatPercent, formatVolume } from '@/lib/utils';
import { GlowCard } from '@/components/ui/GlowCard';

interface StockCardProps {
  stock: StockData;
  compact?: boolean;
}

export function StockCard({ stock, compact = false }: StockCardProps) {
  const isPositive = stock.change >= 0;

  if (compact) {
    return (
      <Link href={`/stock/${stock.symbol}/`}>
        <div className="flex items-center justify-between p-3 rounded-lg bg-schmal-surface/50 border border-schmal-border/30 hover:border-schmal-accent/20 transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-schmal-card flex items-center justify-center">
              <span className="text-[10px] font-mono font-bold text-schmal-accent">
                {stock.symbol.slice(0, 2)}
              </span>
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-white">{stock.symbol}</span>
              <p className="text-[10px] text-schmal-muted truncate max-w-[120px]">{stock.company}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-white">${stock.price.toFixed(2)}</span>
            <p className={`text-[10px] font-mono font-bold ${isPositive ? 'text-schmal-profit' : 'text-schmal-loss'}`}>
              {formatPercent(stock.changePercent)}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/stock/${stock.symbol}/`}>
      <GlowCard glowColor={isPositive ? 'profit' : 'loss'} className="cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-bold text-white">{stock.symbol}</span>
              <span className="text-[10px] font-mono text-schmal-muted px-1.5 py-0.5 rounded bg-schmal-surface">
                {stock.sector}
              </span>
            </div>
            <p className="text-xs text-schmal-muted mt-1">{stock.company}</p>
          </div>
          <div className={`px-2 py-1 rounded text-[10px] font-mono font-bold ${
            isPositive ? 'bg-schmal-profit/10 text-schmal-profit' : 'bg-schmal-loss/10 text-schmal-loss'
          }`}>
            {formatPercent(stock.changePercent)}
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold font-mono text-white">${stock.price.toFixed(2)}</p>
            <p className={`text-xs font-mono ${isPositive ? 'text-schmal-profit' : 'text-schmal-loss'}`}>
              {isPositive ? '+' : ''}{stock.change.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono text-schmal-muted">VOL</p>
            <p className="text-xs font-mono text-schmal-text">{formatVolume(stock.volume)}</p>
          </div>
        </div>

        {/* Mini sparkline placeholder */}
        <div className="mt-4 h-8 flex items-end gap-px">
          {Array.from({ length: 20 }, (_, i) => {
            const h = 20 + Math.sin(i * 0.8 + stock.price) * 15 + Math.random() * 10;
            return (
              <div
                key={i}
                className="flex-1 rounded-t"
                style={{
                  height: `${h}%`,
                  backgroundColor: isPositive ? 'rgba(0,255,136,0.3)' : 'rgba(255,68,68,0.3)',
                }}
              />
            );
          })}
        </div>
      </GlowCard>
    </Link>
  );
}
