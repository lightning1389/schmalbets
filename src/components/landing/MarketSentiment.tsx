'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlowCard } from '@/components/ui/GlowCard';
import { fetchFearGreed, fetchMarketOverview, FearGreedData, MarketOverview } from '@/lib/priceService';

function getFearGreedColor(value: number): string {
  if (value <= 25) return '#ff4444';
  if (value <= 45) return '#ff8844';
  if (value <= 55) return '#ffcc00';
  if (value <= 75) return '#88cc44';
  return '#00ff88';
}

export function MarketSentiment() {
  const [fg, setFg] = useState<FearGreedData | null>(null);
  const [market, setMarket] = useState<MarketOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchFearGreed(), fetchMarketOverview()]).then(([fgData, mktData]) => {
      setFg(fgData);
      setMarket(mktData);
      setLoading(false);
    });
  }, []);

  const fgColor = fg ? getFearGreedColor(fg.value) : '#555';
  const fgValue = fg?.value ?? 0;
  const fgLabel = fg?.label ?? '—';
  const vix = market?.vix ?? 0;
  const vixChange = market?.vixChange ?? 0;
  const spxChange = market?.spxChange ?? 0;
  const spxFromATH = market?.spxFromATH ?? 0;

  return (
    <section className="py-20 border-t border-schmal-border/30">
      <div className="container-schmal">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-schmal-warning animate-pulse" />
            <h2 className="text-xs font-mono text-schmal-muted tracking-[0.3em]">
              MARKET PULSE
            </h2>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold">Current Market Situation</h3>
          <p className="text-sm text-schmal-muted mt-1 font-mono">
            Sentiment indicators · Updated in real-time
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Fear & Greed Index */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <GlowCard glowColor="accent" className="text-center">
              <p className="text-[10px] font-mono text-schmal-muted tracking-widest mb-3">FEAR & GREED INDEX</p>
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#1b1f27" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke={fgColor}
                    strokeWidth="8"
                    strokeDasharray={`${fgValue * 2.64} 264`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold font-mono" style={{ color: fgColor }}>{loading ? '—' : fgValue}</span>
                </div>
              </div>
              <p className="text-xs font-mono font-bold" style={{ color: fgColor }}>{loading ? 'LOADING...' : fgLabel}</p>
            </GlowCard>
          </motion.div>

          {/* VIX / Volatility */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <GlowCard glowColor="accent">
              <p className="text-[10px] font-mono text-schmal-muted tracking-widest mb-3">VOLATILITY INDEX (VIX)</p>
              <div className="text-3xl font-bold font-mono text-white mb-1">{loading ? '—' : vix.toFixed(2)}</div>
              <div className={`text-xs font-mono font-bold ${vixChange < 0 ? 'text-schmal-profit' : 'text-schmal-loss'}`}>
                {loading ? '—' : `${vixChange > 0 ? '+' : ''}${vixChange.toFixed(2)}%`}
              </div>
              <div className="mt-4 pt-3 border-t border-schmal-border/30">
                <p className="text-[10px] font-mono text-schmal-muted">VOLATILITY LEVEL</p>
                <p className={`text-sm font-mono font-bold ${vix < 20 ? 'text-schmal-profit' : vix < 30 ? 'text-schmal-warning' : 'text-schmal-loss'}`}>
                  {loading ? '—' : vix < 15 ? 'LOW' : vix < 20 ? 'NORMAL' : vix < 30 ? 'ELEVATED' : 'HIGH'}
                </p>
              </div>
            </GlowCard>
          </motion.div>

          {/* S&P 500 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <GlowCard glowColor="accent">
              <p className="text-[10px] font-mono text-schmal-muted tracking-widest mb-3">S&P 500</p>
              <div className="text-3xl font-bold font-mono text-white mb-1">
                {loading ? '—' : market?.spxPrice?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className={`text-xs font-mono font-bold ${spxChange >= 0 ? 'text-schmal-profit' : 'text-schmal-loss'}`}>
                {loading ? '—' : `${spxChange >= 0 ? '+' : ''}${spxChange.toFixed(2)}%`}
              </div>
              <div className="mt-4 pt-3 border-t border-schmal-border/30">
                <p className="text-[10px] font-mono text-schmal-muted">FROM 52W HIGH</p>
                <p className={`text-sm font-mono font-bold ${spxFromATH < 0 ? 'text-schmal-loss' : 'text-schmal-profit'}`}>
                  {loading ? '—' : `${spxFromATH > 0 ? '+' : ''}${spxFromATH.toFixed(1)}%`}
                </p>
              </div>
            </GlowCard>
          </motion.div>

          {/* Market Mood */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <GlowCard glowColor="accent">
              <p className="text-[10px] font-mono text-schmal-muted tracking-widest mb-3">MARKET MOOD</p>
              {loading ? (
                <div className="text-3xl font-bold font-mono text-schmal-muted mb-1">—</div>
              ) : (
                <>
                  <div className={`text-2xl font-bold font-mono mb-1 ${
                    (fg?.value ?? 50) <= 25 ? 'text-schmal-loss' :
                    (fg?.value ?? 50) <= 45 ? 'text-schmal-warning' :
                    (fg?.value ?? 50) <= 55 ? 'text-white' :
                    'text-schmal-profit'
                  }`}>
                    {(fg?.value ?? 50) <= 25 ? '🔴 PANIC' :
                     (fg?.value ?? 50) <= 45 ? '🟡 CAUTIOUS' :
                     (fg?.value ?? 50) <= 55 ? '⚪ NEUTRAL' :
                     (fg?.value ?? 50) <= 75 ? '🟢 GREEDY' :
                     '🟢 EUPHORIC'}
                  </div>
                  <div className="w-full h-2 bg-schmal-surface rounded-full overflow-hidden mt-3 mb-2">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${fg?.value ?? 0}%`,
                        background: `linear-gradient(90deg, #ff4444, #ffcc00, #00ff88)`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] font-mono text-schmal-loss">FEAR</span>
                    <span className="text-[10px] font-mono text-schmal-profit">GREED</span>
                  </div>
                </>
              )}
            </GlowCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
