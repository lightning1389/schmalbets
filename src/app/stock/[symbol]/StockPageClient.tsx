'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { StockChart } from '@/components/charts/StockChart';
import { TradeCard } from '@/components/trades/TradeCard';
import { GlowCard } from '@/components/ui/GlowCard';
import { useStore } from '@/lib/store';
import { STOCKS, generateCandleData } from '@/lib/mockData';
import { formatCurrency, formatPercent, formatVolume } from '@/lib/utils';
import { Trade } from '@/lib/types';

interface StockPageClientProps {
  symbol: string;
}

export default function StockPageClient({ symbol: rawSymbol }: StockPageClientProps) {
  const symbol = rawSymbol?.toUpperCase() || '';
  const { trades } = useStore();
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

  const stock = STOCKS.find((s) => s.symbol === symbol);
  const stockTrades = trades.filter((t) => t.symbol === symbol);
  const basePrice = stock?.price ? stock.price * 0.7 : 100;
  const candleData = generateCandleData(symbol, 180, basePrice);

  if (!stock) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="glass-card p-12 text-center">
          <p className="text-2xl font-mono text-schmal-muted mb-2">SYMBOL NOT FOUND</p>
          <p className="text-sm text-schmal-muted font-mono">
            &quot;{symbol}&quot; is not in The Schmal&apos;s tracking universe.
          </p>
        </div>
      </div>
    );
  }

  const isPositive = stock.change >= 0;

  return (
    <div className="pt-16">
      <div className="container-schmal py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-mono text-schmal-muted px-2 py-0.5 rounded bg-schmal-surface">
                  {stock.sector}
                </span>
                <span className="text-xs font-mono text-schmal-muted">
                  MCap: {stock.marketCap}
                </span>
              </div>
              <div className="flex items-baseline gap-4">
                <h1 className="text-3xl md:text-4xl font-bold font-mono">{stock.symbol}</h1>
                <span className="text-lg text-schmal-muted">{stock.company}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold font-mono text-white">
                {formatCurrency(stock.price)}
              </p>
              <div className="flex items-center gap-2 justify-end">
                <span className={`text-lg font-mono font-bold ${isPositive ? 'text-schmal-profit' : 'text-schmal-loss'}`}>
                  {isPositive ? '+' : ''}{stock.change.toFixed(2)}
                </span>
                <span className={`px-2 py-0.5 rounded text-sm font-mono font-bold ${
                  isPositive ? 'bg-schmal-profit/10 text-schmal-profit' : 'bg-schmal-loss/10 text-schmal-loss'
                }`}>
                  {formatPercent(stock.changePercent)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <GlowCard glowColor="accent" className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-mono font-bold text-schmal-muted tracking-widest">
                PRICE CHART — {symbol}
              </h3>
              <div className="flex items-center gap-2">
                {stockTrades.length > 0 && (
                  <span className="text-[10px] font-mono text-schmal-accent px-2 py-0.5 rounded bg-schmal-accent/10">
                    {stockTrades.length} SCHMAL TRADE{stockTrades.length > 1 ? 'S' : ''} MARKED
                  </span>
                )}
              </div>
            </div>
            <StockChart
              data={candleData}
              trades={trades}
              symbol={symbol}
              onMarkerClick={setSelectedTrade}
            />
          </GlowCard>
        </motion.div>

        {/* Stock info grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'VOLUME', value: formatVolume(stock.volume) },
            { label: 'MARKET CAP', value: stock.marketCap },
            { label: '52W HIGH', value: formatCurrency(stock.high52w) },
            { label: '52W LOW', value: formatCurrency(stock.low52w) },
          ].map((item) => (
            <GlowCard key={item.label} glowColor="accent" className="text-center p-4">
              <p className="text-[10px] font-mono text-schmal-muted tracking-widest mb-1">
                {item.label}
              </p>
              <p className="text-lg font-bold font-mono text-white">{item.value}</p>
            </GlowCard>
          ))}
        </motion.div>

        {/* Schmal's trades for this stock */}
        {stockTrades.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-schmal-accent" />
              <h3 className="text-xs font-mono font-bold text-schmal-muted tracking-widest">
                THE SCHMAL&apos;S POSITIONS — {symbol}
              </h3>
            </div>
            <div className="space-y-4">
              {stockTrades.map((trade) => (
                <TradeCard key={trade.id} trade={trade} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Selected trade detail panel */}
        {selectedTrade && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedTrade(null)}
          >
            <div className="max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
              <TradeCard trade={selectedTrade} />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
