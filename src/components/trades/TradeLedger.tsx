'use client';

import { useState } from 'react';
import { Trade, TradeDirection, TradeStatus, Sentiment } from '@/lib/types';
import { TradeCard } from './TradeCard';

interface TradeLedgerProps {
  trades: Trade[];
}

export function TradeLedger({ trades }: TradeLedgerProps) {
  const [filterDirection, setFilterDirection] = useState<TradeDirection | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<TradeStatus | 'ALL'>('ALL');
  const [filterSentiment, setFilterSentiment] = useState<Sentiment | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'gain' | 'conviction'>('date');

  const filteredTrades = trades
    .filter((t) => {
      if (filterDirection !== 'ALL' && t.direction !== filterDirection) return false;
      if (filterStatus !== 'ALL' && t.status !== filterStatus) return false;
      if (filterSentiment !== 'ALL' && t.sentiment !== filterSentiment) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          t.symbol.toLowerCase().includes(q) ||
          t.company.toLowerCase().includes(q) ||
          t.thesis.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'conviction') return b.conviction - a.conviction;
      // gain
      const gainA = a.direction === 'BUY'
        ? ((a.exitPrice ?? a.currentPrice) - a.entryPrice) / a.entryPrice
        : (a.entryPrice - (a.exitPrice ?? a.currentPrice)) / a.entryPrice;
      const gainB = b.direction === 'BUY'
        ? ((b.exitPrice ?? b.currentPrice) - b.entryPrice) / b.entryPrice
        : (b.entryPrice - (b.exitPrice ?? b.currentPrice)) / b.entryPrice;
      return gainB - gainA;
    });

  return (
    <div>
      {/* Filters */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search symbols, companies, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-schmal-surface border border-schmal-border rounded-lg text-sm font-mono text-white placeholder:text-schmal-muted focus:outline-none focus:border-schmal-accent/50 transition-colors"
            />
          </div>

          {/* Filter buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Direction */}
            <div className="flex rounded-lg overflow-hidden border border-schmal-border">
              {(['ALL', 'BUY', 'SELL'] as const).map((dir) => (
                <button
                  key={dir}
                  onClick={() => setFilterDirection(dir)}
                  className={`px-3 py-1.5 text-[10px] font-mono font-bold transition-colors ${
                    filterDirection === dir
                      ? 'bg-schmal-accent text-schmal-darker'
                      : 'text-schmal-muted hover:text-white'
                  }`}
                >
                  {dir}
                </button>
              ))}
            </div>

            {/* Status */}
            <div className="flex rounded-lg overflow-hidden border border-schmal-border">
              {(['ALL', 'OPEN', 'CLOSED'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 text-[10px] font-mono font-bold transition-colors ${
                    filterStatus === status
                      ? 'bg-schmal-accent text-schmal-darker'
                      : 'text-schmal-muted hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'gain' | 'conviction')}
              className="px-3 py-1.5 bg-schmal-surface border border-schmal-border rounded-lg text-[10px] font-mono text-schmal-muted focus:outline-none"
            >
              <option value="date">SORT: DATE</option>
              <option value="gain">SORT: P&L</option>
              <option value="conviction">SORT: CONVICTION</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-mono text-schmal-muted">
          {filteredTrades.length} of {trades.length} trades
        </p>
        <div className="flex items-center gap-4 text-[10px] font-mono text-schmal-muted">
          <span>
            ● {trades.filter((t) => t.status === 'OPEN').length} OPEN
          </span>
          <span>
            ○ {trades.filter((t) => t.status === 'CLOSED').length} CLOSED
          </span>
        </div>
      </div>

      {/* Trade cards */}
      <div className="space-y-4">
        {filteredTrades.map((trade) => (
          <TradeCard key={trade.id} trade={trade} />
        ))}
      </div>

      {filteredTrades.length === 0 && (
        <div className="glass-card p-12 text-center">
          <p className="text-schmal-muted font-mono text-sm">No trades match your filters.</p>
        </div>
      )}
    </div>
  );
}
