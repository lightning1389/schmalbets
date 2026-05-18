'use client';

import { TICKER_DATA } from '@/lib/mockData';
import { formatPercent } from '@/lib/utils';

export function TickerBar() {
  const items = [...TICKER_DATA, ...TICKER_DATA];

  return (
    <div className="relative overflow-hidden border-y border-schmal-border/30 bg-schmal-darker/50 py-2">
      <div className="flex ticker-scroll whitespace-nowrap">
        {items.map((item, i) => (
          <div
            key={`${item.symbol}-${i}`}
            className="inline-flex items-center gap-2 px-6 text-xs font-mono"
          >
            <span className="text-schmal-muted font-semibold">{item.symbol}</span>
            <span className="text-white">
              {typeof item.price === 'number' && item.price > 1000
                ? item.price.toLocaleString()
                : item.price}
            </span>
            <span className={item.change >= 0 ? 'text-schmal-profit' : 'text-schmal-loss'}>
              {formatPercent(item.change)}
            </span>
            <span className="text-schmal-border mx-2">│</span>
          </div>
        ))}
      </div>
    </div>
  );
}
