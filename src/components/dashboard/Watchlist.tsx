'use client';

import { WatchlistItem } from '@/lib/types';
import { formatPercent } from '@/lib/utils';
import { GlowCard } from '@/components/ui/GlowCard';

interface WatchlistProps {
  items: WatchlistItem[];
}

export function Watchlist({ items }: WatchlistProps) {
  return (
    <GlowCard glowColor="accent">
      <h3 className="text-xs font-mono font-bold text-schmal-muted tracking-widest mb-6">
        WATCHLIST
      </h3>
      <div className="space-y-3">
        {items.map((item) => {
          const isPositive = item.change >= 0;
          return (
            <div
              key={item.symbol}
              className="p-3 rounded-lg bg-schmal-surface/50 border border-schmal-border/30 hover:border-schmal-accent/20 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white">{item.symbol}</span>
                  <span className="text-[10px] text-schmal-muted">{item.company}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-white">${item.price.toFixed(2)}</span>
                  <span className={`text-[10px] font-mono font-bold ${
                    isPositive ? 'text-schmal-profit' : 'text-schmal-loss'
                  }`}>
                    {formatPercent(item.changePercent)}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-schmal-muted leading-relaxed">{item.notes}</p>
            </div>
          );
        })}
      </div>
    </GlowCard>
  );
}
