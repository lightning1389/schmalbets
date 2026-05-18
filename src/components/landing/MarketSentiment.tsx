'use client';

import { motion } from 'framer-motion';
import { GlowCard } from '@/components/ui/GlowCard';

// These would ideally come from an API — for now static display that can be updated via Firebase later
const MARKET_SENTIMENT = {
  fearGreed: 62,
  fearGreedLabel: 'GREED',
  vix: 14.25,
  vixChange: -3.2,
  putCallRatio: 0.72,
  longShort: { long: 64, short: 36 },
  marketBreadth: 68,
  spxFromATH: -2.4,
};

function getFearGreedColor(value: number): string {
  if (value <= 25) return '#ff4444';
  if (value <= 45) return '#ff8844';
  if (value <= 55) return '#ffcc00';
  if (value <= 75) return '#88cc44';
  return '#00ff88';
}

export function MarketSentiment() {
  const { fearGreed, fearGreedLabel, vix, vixChange, putCallRatio, longShort, marketBreadth, spxFromATH } = MARKET_SENTIMENT;
  const fgColor = getFearGreedColor(fearGreed);

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
                    strokeDasharray={`${fearGreed * 2.64} 264`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold font-mono" style={{ color: fgColor }}>{fearGreed}</span>
                </div>
              </div>
              <p className="text-xs font-mono font-bold" style={{ color: fgColor }}>{fearGreedLabel}</p>
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
              <div className="text-3xl font-bold font-mono text-white mb-1">{vix.toFixed(2)}</div>
              <div className={`text-xs font-mono font-bold ${vixChange < 0 ? 'text-schmal-profit' : 'text-schmal-loss'}`}>
                {vixChange > 0 ? '+' : ''}{vixChange.toFixed(2)}%
              </div>
              <div className="mt-4 pt-3 border-t border-schmal-border/30">
                <p className="text-[10px] font-mono text-schmal-muted">PUT/CALL RATIO</p>
                <p className="text-sm font-mono font-bold text-schmal-accent">{putCallRatio.toFixed(2)}</p>
              </div>
            </GlowCard>
          </motion.div>

          {/* Long vs Short */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <GlowCard glowColor="accent">
              <p className="text-[10px] font-mono text-schmal-muted tracking-widest mb-3">LONG VS SHORT</p>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl font-bold font-mono text-schmal-profit">{longShort.long}%</span>
                <span className="text-xs font-mono text-schmal-muted">vs</span>
                <span className="text-2xl font-bold font-mono text-schmal-loss">{longShort.short}%</span>
              </div>
              <div className="w-full h-3 bg-schmal-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-schmal-profit to-schmal-profit/60 rounded-full transition-all"
                  style={{ width: `${longShort.long}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[10px] font-mono text-schmal-profit">LONGS</span>
                <span className="text-[10px] font-mono text-schmal-loss">SHORTS</span>
              </div>
            </GlowCard>
          </motion.div>

          {/* Market Breadth */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <GlowCard glowColor="accent">
              <p className="text-[10px] font-mono text-schmal-muted tracking-widest mb-3">MARKET BREADTH</p>
              <div className="text-3xl font-bold font-mono text-schmal-accent mb-1">{marketBreadth}%</div>
              <p className="text-[10px] font-mono text-schmal-muted">stocks above 200 DMA</p>
              <div className="mt-4 pt-3 border-t border-schmal-border/30">
                <p className="text-[10px] font-mono text-schmal-muted">SPX FROM ATH</p>
                <p className={`text-sm font-mono font-bold ${spxFromATH < 0 ? 'text-schmal-loss' : 'text-schmal-profit'}`}>
                  {spxFromATH > 0 ? '+' : ''}{spxFromATH.toFixed(1)}%
                </p>
              </div>
            </GlowCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
