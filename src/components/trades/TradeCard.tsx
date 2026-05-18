'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Trade } from '@/lib/types';
import {
  formatCurrency,
  formatPercent,
  formatDate,
  formatDateTime,
  getTradeGain,
  getTradeGainValue,
  getConvictionLabel,
  getConvictionColor,
} from '@/lib/utils';

interface TradeCardProps {
  trade: Trade;
}

export function TradeCard({ trade }: TradeCardProps) {
  const [expanded, setExpanded] = useState(false);
  const gain = getTradeGain(trade.entryPrice, trade.exitPrice ?? trade.currentPrice, trade.direction);
  const gainValue = getTradeGainValue(trade.entryPrice, trade.exitPrice ?? trade.currentPrice, trade.shares, trade.direction);
  const isProfit = gain >= 0;

  const noteTypeColors: Record<string, string> = {
    analysis: 'text-schmal-cyan',
    update: 'text-schmal-accent',
    macro: 'text-schmal-warning',
    earnings: 'text-schmal-profit',
    psychology: 'text-purple-400',
    technical: 'text-blue-400',
  };

  return (
    <motion.div
      layout
      className="glass-card glass-card-hover overflow-hidden"
    >
      {/* Main row */}
      <div
        className="p-6 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Symbol & Direction */}
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              trade.direction === 'BUY'
                ? 'bg-schmal-profit/10 border border-schmal-profit/20'
                : 'bg-schmal-loss/10 border border-schmal-loss/20'
            }`}>
              <span className={`text-lg font-bold ${
                trade.direction === 'BUY' ? 'text-schmal-profit' : 'text-schmal-loss'
              }`}>
                {trade.direction === 'BUY' ? '▲' : '▼'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/stock/${trade.symbol}/`}
                  className="text-lg font-bold font-mono text-white hover:text-schmal-accent transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {trade.symbol}
                </Link>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  trade.direction === 'BUY'
                    ? 'bg-schmal-profit/10 text-schmal-profit'
                    : 'bg-schmal-loss/10 text-schmal-loss'
                }`}>
                  {trade.direction}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                  trade.status === 'OPEN'
                    ? 'bg-schmal-accent/10 text-schmal-accent'
                    : 'bg-schmal-muted/10 text-schmal-muted'
                }`}>
                  {trade.status}
                </span>
              </div>
              <p className="text-xs text-schmal-muted mt-1">{trade.company}</p>
            </div>
          </div>

          {/* Center: Price info */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-[10px] font-mono text-schmal-muted">ENTRY</p>
              <p className="text-sm font-mono text-white">{formatCurrency(trade.entryPrice)}</p>
            </div>
            <div className="text-schmal-muted">→</div>
            <div className="text-center">
              <p className="text-[10px] font-mono text-schmal-muted">
                {trade.exitPrice ? 'EXIT' : 'CURRENT'}
              </p>
              <p className="text-sm font-mono text-white">
                {formatCurrency(trade.exitPrice ?? trade.currentPrice)}
              </p>
            </div>
          </div>

          {/* Right: P&L & Conviction */}
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className={`text-lg font-bold font-mono ${isProfit ? 'text-schmal-profit' : 'text-schmal-loss'}`}>
                {formatPercent(gain)}
              </p>
              <p className={`text-xs font-mono ${isProfit ? 'text-schmal-profit' : 'text-schmal-loss'}`}>
                {isProfit ? '+' : ''}{formatCurrency(gainValue)}
              </p>
            </div>
            <div className="text-center">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <div
                    key={i}
                    className="w-2 h-6 rounded-sm"
                    style={{
                      backgroundColor: i < trade.conviction
                        ? getConvictionColor(trade.conviction)
                        : 'rgba(27, 31, 39, 0.8)',
                    }}
                  />
                ))}
              </div>
              <p className="text-[9px] font-mono mt-1" style={{ color: getConvictionColor(trade.conviction) }}>
                {getConvictionLabel(trade.conviction)}
              </p>
            </div>
            <div className="text-schmal-muted">
              <svg width="16" height="16" viewBox="0 0 16 16" className={`transition-transform ${expanded ? 'rotate-180' : ''}`}>
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tags & Date */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-schmal-border/30">
          <div className="flex items-center gap-2 flex-wrap">
            {trade.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[10px] font-mono text-schmal-muted bg-schmal-surface rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="text-[10px] font-mono text-schmal-muted">
            {formatDate(trade.entryDate)}
          </span>
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-schmal-border/30">
              {/* Thesis */}
              <div className="mt-4 mb-6">
                <h4 className="text-[10px] font-mono font-bold text-schmal-accent tracking-widest mb-2">
                  TRADE THESIS
                </h4>
                <p className="text-sm text-schmal-text leading-relaxed">{trade.thesis}</p>
              </div>

              {/* Targets & Stop Loss */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-3 rounded-lg bg-schmal-surface/50 border border-schmal-border/30">
                  <h5 className="text-[10px] font-mono font-bold text-schmal-muted tracking-widest mb-2">
                    TARGETS
                  </h5>
                  {trade.targets.map((target, i) => (
                    <div key={i} className="flex items-center justify-between py-1">
                      <span className="text-xs text-schmal-muted">{target.label}</span>
                      <span className="text-xs font-mono text-schmal-profit font-bold">
                        {formatCurrency(target.price)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-lg bg-schmal-surface/50 border border-schmal-border/30">
                  <h5 className="text-[10px] font-mono font-bold text-schmal-muted tracking-widest mb-2">
                    RISK MANAGEMENT
                  </h5>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs text-schmal-muted">Stop Loss</span>
                    <span className="text-xs font-mono text-schmal-loss font-bold">
                      {trade.stopLoss ? formatCurrency(trade.stopLoss) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs text-schmal-muted">Position Size</span>
                    <span className="text-xs font-mono text-white font-bold">
                      {trade.shares} shares
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs text-schmal-muted">Sentiment</span>
                    <span className={`text-xs font-mono font-bold ${
                      trade.sentiment === 'BULLISH'
                        ? 'text-schmal-profit'
                        : trade.sentiment === 'BEARISH'
                        ? 'text-schmal-loss'
                        : 'text-schmal-muted'
                    }`}>
                      {trade.sentiment}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes Timeline */}
              {trade.notes.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-mono font-bold text-schmal-accent tracking-widest mb-4">
                    INTELLIGENCE LOG ({trade.notes.length} entries)
                  </h4>
                  <div className="space-y-3">
                    {trade.notes.map((note) => (
                      <div
                        key={note.id}
                        className="flex gap-3 p-3 rounded-lg bg-schmal-surface/30 border border-schmal-border/20"
                      >
                        <div className="flex flex-col items-center pt-1">
                          <div className="w-2 h-2 rounded-full bg-schmal-accent" />
                          <div className="w-px flex-1 bg-schmal-border/50 mt-1" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-mono font-bold uppercase ${
                              noteTypeColors[note.type] || 'text-schmal-muted'
                            }`}>
                              {note.type}
                            </span>
                            <span className="text-[10px] font-mono text-schmal-muted">
                              {formatDateTime(note.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs text-schmal-text leading-relaxed">{note.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="mt-6 pt-4 border-t border-schmal-border/20 flex items-center justify-between">
                <span className="text-[10px] font-mono text-schmal-muted">
                  ID: {trade.id} · Created: {formatDateTime(trade.createdAt)}
                </span>
                <span className="text-[10px] font-mono text-schmal-muted">
                  Updated: {formatDateTime(trade.updatedAt)}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
