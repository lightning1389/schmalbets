'use client';

import Link from 'next/link';
import { Trade } from '@/lib/types';
import { formatCurrency, formatPercent, getTradeGain, getTradeGainValue, getConvictionLabel, getConvictionColor, formatDate } from '@/lib/utils';
import { GlowCard } from '@/components/ui/GlowCard';

interface ActivePositionsProps {
  trades: Trade[];
}

export function ActivePositions({ trades }: ActivePositionsProps) {
  const openTrades = trades.filter((t) => t.status === 'OPEN');

  return (
    <GlowCard glowColor="accent" className="overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xs font-mono font-bold text-schmal-muted tracking-widest">
            ACTIVE POSITIONS
          </h3>
          <p className="text-[10px] text-schmal-muted mt-1">
            {openTrades.length} open positions
          </p>
        </div>
        <Link
          href="/trades/"
          className="text-[10px] font-mono text-schmal-accent hover:underline"
        >
          VIEW ALL →
        </Link>
      </div>

      <div className="overflow-x-auto -mx-6">
        <table className="data-table min-w-[800px]">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Direction</th>
              <th>Entry</th>
              <th>Current</th>
              <th>P&L</th>
              <th>P&L %</th>
              <th>Shares</th>
              <th>Conviction</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {openTrades.map((trade) => {
              const gain = getTradeGain(trade.entryPrice, trade.currentPrice, trade.direction);
              const gainValue = getTradeGainValue(trade.entryPrice, trade.currentPrice, trade.shares, trade.direction);
              const isProfit = gain >= 0;

              return (
                <tr key={trade.id} className="cursor-pointer">
                  <td>
                    <Link href={`/stock/${trade.symbol}/`} className="hover:text-schmal-accent transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{trade.symbol}</span>
                        <span className="text-[10px] text-schmal-muted">{trade.sector}</span>
                      </div>
                    </Link>
                  </td>
                  <td>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      trade.direction === 'BUY'
                        ? 'bg-schmal-profit/10 text-schmal-profit'
                        : 'bg-schmal-loss/10 text-schmal-loss'
                    }`}>
                      {trade.direction}
                    </span>
                  </td>
                  <td className="text-schmal-text">{formatCurrency(trade.entryPrice)}</td>
                  <td className="text-white font-bold">{formatCurrency(trade.currentPrice)}</td>
                  <td className={isProfit ? 'text-schmal-profit font-bold' : 'text-schmal-loss font-bold'}>
                    {isProfit ? '+' : ''}{formatCurrency(gainValue)}
                  </td>
                  <td className={isProfit ? 'text-schmal-profit font-bold' : 'text-schmal-loss font-bold'}>
                    {formatPercent(gain)}
                  </td>
                  <td className="text-schmal-text">{trade.shares}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="conviction-bar w-16">
                        <div
                          className="conviction-fill"
                          style={{
                            width: `${trade.conviction * 20}%`,
                            backgroundColor: getConvictionColor(trade.conviction),
                          }}
                        />
                      </div>
                      <span
                        className="text-[10px] font-bold"
                        style={{ color: getConvictionColor(trade.conviction) }}
                      >
                        {getConvictionLabel(trade.conviction)}
                      </span>
                    </div>
                  </td>
                  <td className="text-schmal-muted">{formatDate(trade.entryDate)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </GlowCard>
  );
}
