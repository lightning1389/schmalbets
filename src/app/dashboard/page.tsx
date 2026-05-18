'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TickerBar } from '@/components/landing/TickerBar';
import { PerformanceMetrics } from '@/components/dashboard/PerformanceMetrics';
import { ActivePositions } from '@/components/dashboard/ActivePositions';
import { StockCard } from '@/components/dashboard/StockCard';
import { Watchlist } from '@/components/dashboard/Watchlist';
import { useStore } from '@/lib/store';
import { STOCKS, SECTOR_PERFORMANCE } from '@/lib/mockData';
import { GlowCard } from '@/components/ui/GlowCard';
import { getTradeGain, getTradeGainValue } from '@/lib/utils';
import { PortfolioMetrics, Trade } from '@/lib/types';
import { fetchLivePrices } from '@/lib/priceService';

function computeMetrics(trades: Trade[]): PortfolioMetrics {
  if (trades.length === 0) {
    return { totalValue: 0, totalGain: 0, totalGainPercent: 0, winRate: 0, totalTrades: 0, openPositions: 0, bestTrade: { symbol: '-', gain: 0 }, worstTrade: { symbol: '-', gain: 0 }, avgHoldingDays: 0, sharpeRatio: 0 };
  }

  const totalValue = trades.reduce((sum, t) => sum + t.currentPrice * t.shares, 0);
  const totalCost = trades.reduce((sum, t) => sum + t.entryPrice * t.shares, 0);
  const totalGain = trades.reduce((sum, t) => sum + getTradeGainValue(t.entryPrice, t.currentPrice, t.shares, t.direction), 0);
  const totalGainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

  const winners = trades.filter((t) => getTradeGain(t.entryPrice, t.exitPrice ?? t.currentPrice, t.direction) > 0);
  const winRate = (winners.length / trades.length) * 100;

  const openPositions = trades.filter((t) => t.status === 'OPEN').length;

  let best = { symbol: trades[0].symbol, gain: getTradeGain(trades[0].entryPrice, trades[0].exitPrice ?? trades[0].currentPrice, trades[0].direction) };
  let worst = { ...best };
  trades.forEach((t) => {
    const gain = getTradeGain(t.entryPrice, t.exitPrice ?? t.currentPrice, t.direction);
    if (gain > best.gain) best = { symbol: t.symbol, gain };
    if (gain < worst.gain) worst = { symbol: t.symbol, gain };
  });

  const now = Date.now();
  const avgHoldingDays = Math.round(
    trades.reduce((sum, t) => {
      const end = t.exitDate ? new Date(t.exitDate).getTime() : now;
      return sum + (end - new Date(t.entryDate).getTime()) / (1000 * 60 * 60 * 24);
    }, 0) / trades.length
  );

  return { totalValue, totalGain, totalGainPercent, winRate, totalTrades: trades.length, openPositions, bestTrade: best, worstTrade: worst, avgHoldingDays, sharpeRatio: 0 };
}

export default function DashboardPage() {
  const { trades, watchlist } = useStore();
  const [liveTrades, setLiveTrades] = useState<Trade[]>(trades);

  useEffect(() => {
    setLiveTrades(trades);
  }, [trades]);

  useEffect(() => {
    const openSymbols = trades.filter((t) => t.status === 'OPEN').map((t) => t.symbol);
    if (openSymbols.length === 0) return;

    fetchLivePrices(openSymbols).then((prices) => {
      if (Object.keys(prices).length === 0) return;
      setLiveTrades((prev) =>
        prev.map((t) =>
          t.status === 'OPEN' && prices[t.symbol]
            ? { ...t, currentPrice: prices[t.symbol] }
            : t
        )
      );
    });
  }, [trades]);

  const metrics = computeMetrics(liveTrades);

  return (
    <div className="pt-16">
      <TickerBar />

      <div className="container-schmal py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-schmal-profit animate-pulse" />
            <h1 className="text-xs font-mono text-schmal-muted tracking-[0.3em]">
              SCHMALSTREETS LIST
            </h1>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">Dashboard</h2>
          <p className="text-sm text-schmal-muted mt-1 font-mono">
            Portfolio overview — The Schmal&apos;s active operations
          </p>
        </motion.div>

        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <PerformanceMetrics metrics={metrics} />
        </motion.div>

        {/* Active Positions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <ActivePositions trades={liveTrades} />
        </motion.div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Tracked Stocks */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <h3 className="text-xs font-mono font-bold text-schmal-muted tracking-widest mb-4">
              TRACKED STOCKS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {STOCKS.slice(0, 6).map((stock) => (
                <StockCard key={stock.symbol} stock={stock} />
              ))}
            </div>
          </motion.div>

          {/* Watchlist */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Watchlist items={watchlist} />
          </motion.div>
        </div>

        {/* Sector overview & recent activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sector Performance */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlowCard glowColor="accent">
              <h3 className="text-xs font-mono font-bold text-schmal-muted tracking-widest mb-6">
                SECTOR ALLOCATION
              </h3>
              <div className="space-y-3">
                {SECTOR_PERFORMANCE.map((sector) => (
                  <div key={sector.sector} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: sector.color }} />
                    <span className="text-xs font-mono text-schmal-text flex-1">{sector.sector}</span>
                    <span
                      className="text-xs font-mono font-bold"
                      style={{ color: sector.performance >= 0 ? '#00ff88' : '#ff4444' }}
                    >
                      {sector.performance >= 0 ? '+' : ''}{sector.performance}%
                    </span>
                  </div>
                ))}
              </div>
            </GlowCard>
          </motion.div>

          {/* Recent Activity Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlowCard glowColor="accent">
              <h3 className="text-xs font-mono font-bold text-schmal-muted tracking-widest mb-6">
                RECENT ACTIVITY
              </h3>
              <div className="space-y-4">
                {liveTrades.slice(0, 5).map((trade) => (
                  <div key={trade.id} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-2 h-2 rounded-full ${
                        trade.direction === 'BUY' ? 'bg-schmal-profit' : 'bg-schmal-loss'
                      }`} />
                      <div className="w-px h-8 bg-schmal-border" />
                    </div>
                    <div className="flex-1 -mt-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold ${
                          trade.direction === 'BUY' ? 'text-schmal-profit' : 'text-schmal-loss'
                        }`}>
                          {trade.direction}
                        </span>
                        <span className="text-xs font-mono font-bold text-white">{trade.symbol}</span>
                        <span className="text-[10px] font-mono text-schmal-muted">
                          @ ${trade.entryPrice.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-[10px] text-schmal-muted mt-0.5 truncate">
                        {trade.thesis.slice(0, 80)}...
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </GlowCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
