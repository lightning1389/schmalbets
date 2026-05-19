'use client';

import { useEffect, useState } from 'react';
import { fetchTickerData, TickerItem } from '@/lib/priceService';
import { formatPercent } from '@/lib/utils';

export function TickerBar() {
  const [tickers, setTickers] = useState<TickerItem[]>([]);

  useEffect(() => {
    fetchTickerData().then(setTickers);
  }, []);

  if (tickers.length === 0) {
    return (
      <div className="relative overflow-hidden border-y border-schmal-border/30 bg-schmal-darker/50 py-2">
        <div className="flex whitespace-nowrap px-6 text-xs font-mono text-schmal-muted animate-pulse">
          Loading live market data...
        </div>
      </div>
    );
  }

  const items = [...tickers, ...tickers];

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
                : item.price.toFixed(2)}
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
