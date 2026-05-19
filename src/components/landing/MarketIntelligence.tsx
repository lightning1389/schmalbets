'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlowCard } from '@/components/ui/GlowCard';
import { fetchSectorPerformance, SectorData } from '@/lib/priceService';
import { useStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';

export function MarketIntelligence() {
  const [sectors, setSectors] = useState<SectorData[]>([]);
  const [loading, setLoading] = useState(true);
  const { trades } = useStore();

  useEffect(() => {
    fetchSectorPerformance().then((data) => {
      setSectors(data);
      setLoading(false);
    });
  }, []);
  return (
    <section className="py-24 relative border-t border-schmal-border/30">
      <div className="container-schmal">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-mono text-schmal-warning tracking-[0.3em] mb-4">
            MARKET INTELLIGENCE
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Sector Performance & Positions
          </h2>
          <p className="text-schmal-muted max-w-xl mx-auto">
            Live sector ETF data. Real positions. See what The Schmal sees.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sector Heatmap — LIVE */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <GlowCard glowColor="accent">
              <h3 className="text-xs font-mono font-bold text-schmal-muted tracking-widest mb-6">
                SECTOR PERFORMANCE — LIVE
              </h3>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-6 bg-schmal-surface rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {sectors.map((sector) => (
                    <div key={sector.etf} className="flex items-center gap-3">
                      <span className="text-xs font-mono text-schmal-text w-28 truncate">
                        {sector.sector}
                      </span>
                      <div className="flex-1 h-6 bg-schmal-surface rounded overflow-hidden">
                        <div
                          className="h-full rounded transition-all duration-1000 flex items-center justify-end px-2"
                          style={{
                            width: `${Math.min(Math.abs(sector.performance) * 5 + 20, 100)}%`,
                            backgroundColor: sector.performance >= 0
                              ? 'rgba(0, 255, 136, 0.2)'
                              : 'rgba(255, 68, 68, 0.2)',
                            borderRight: `2px solid ${sector.performance >= 0 ? '#00ff88' : '#ff4444'}`,
                          }}
                        >
                          <span
                            className="text-[10px] font-mono font-bold"
                            style={{ color: sector.performance >= 0 ? '#00ff88' : '#ff4444' }}
                          >
                            {sector.performance >= 0 ? '+' : ''}{sector.performance}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlowCard>
          </motion.div>

          {/* Recent Trades */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <GlowCard glowColor="warning">
              <h3 className="text-xs font-mono font-bold text-schmal-muted tracking-widest mb-6">
                SCHMAL&apos;S POSITIONS
              </h3>
              {trades.length === 0 ? (
                <p className="text-sm text-schmal-muted font-mono">No trades logged yet.</p>
              ) : (
                <div className="space-y-4">
                  {trades.slice(0, 5).map((trade) => (
                    <div
                      key={trade.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-schmal-surface/50 border border-schmal-border/30"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          trade.status === 'OPEN' ? 'bg-schmal-profit animate-pulse' : 'bg-schmal-muted'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-white truncate">
                            {trade.symbol}
                          </span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded flex-shrink-0 ${
                            trade.direction === 'BUY'
                              ? 'bg-schmal-profit/10 text-schmal-profit'
                              : 'bg-schmal-loss/10 text-schmal-loss'
                          }`}>
                            {trade.direction}
                          </span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded bg-schmal-border/50 flex-shrink-0 ${
                            trade.status === 'OPEN' ? 'text-schmal-accent' : 'text-schmal-muted'
                          }`}>
                            {trade.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-schmal-muted leading-relaxed truncate">
                          {trade.thesis || trade.company}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[10px] font-mono text-schmal-accent">
                            {formatDate(trade.entryDate)}
                          </span>
                          <span className="text-[10px] font-mono text-schmal-muted">
                            Entry: ${trade.entryPrice.toFixed(2)}
                          </span>
                          <span className="text-[10px] font-mono text-schmal-muted">
                            {trade.shares} shares
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlowCard>
          </motion.div>
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="glass-card gradient-border p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Follow The Schmal</h3>
            <p className="text-schmal-muted mb-8 max-w-lg mx-auto">
              Stay informed. Every trade logged. Every thesis documented. The market remembers — and so do we.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <input
                type="email"
                placeholder="enter your email..."
                className="w-full sm:w-72 px-4 py-3 bg-schmal-surface border border-schmal-border rounded-lg text-sm font-mono text-white placeholder:text-schmal-muted focus:outline-none focus:border-schmal-accent/50 transition-colors"
              />
              <button className="w-full sm:w-auto px-8 py-3 bg-schmal-accent text-schmal-darker font-mono font-bold text-sm tracking-wider rounded-lg hover:bg-schmal-accent/90 transition-all">
                SUBSCRIBE
              </button>
            </div>
            <p className="text-[10px] font-mono text-schmal-muted mt-4">
              SCHMAL ALERTS · TRADE NOTIFICATIONS · MARKET INTELLIGENCE
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
