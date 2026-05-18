'use client';

import { motion } from 'framer-motion';
import { GlowCard } from '@/components/ui/GlowCard';

const features = [
  {
    icon: '◉',
    title: 'TRADE LEDGER',
    description: 'Every position is permanently logged. Entries, exits, conviction scores, and detailed thesis — all timestamped and immutable.',
    accent: 'text-schmal-accent',
  },
  {
    icon: '◈',
    title: 'CHART MARKERS',
    description: 'BUY and SELL actions appear directly on stock charts as visible event markers with clickable intelligence panels.',
    accent: 'text-schmal-cyan',
  },
  {
    icon: '◆',
    title: 'MARKET INTEL',
    description: 'Sentiment analysis, unusual volume detection, earnings calendars, and macro events — institutional-grade intelligence.',
    accent: 'text-schmal-profit',
  },
  {
    icon: '◇',
    title: 'CONVICTION SYSTEM',
    description: 'Each trade carries a conviction score from 1-5. Track confidence levels and correlate with performance over time.',
    accent: 'text-schmal-warning',
  },
  {
    icon: '▣',
    title: 'AUDIT TRAIL',
    description: 'No trade disappears silently. Deletions require admin privileges, confirmation, and leave permanent audit logs.',
    accent: 'text-schmal-accent',
  },
  {
    icon: '▲',
    title: 'PERFORMANCE',
    description: 'Win rates, Sharpe ratios, sector analysis, and portfolio analytics — quantify every decision with precision.',
    accent: 'text-schmal-cyan',
  },
];

export function Features() {
  return (
    <section className="py-24 relative">
      <div className="container-schmal">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-mono text-schmal-accent tracking-[0.3em] mb-4">
            CAPABILITIES
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Intelligence Infrastructure
          </h2>
          <p className="text-schmal-muted max-w-xl mx-auto">
            Built for operators who believe every trade tells a story. Every data point matters.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <GlowCard glowColor="accent" className="h-full">
                <span className={`text-2xl ${feature.accent}`}>{feature.icon}</span>
                <h3 className="text-sm font-mono font-bold tracking-wider mt-4 mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-schmal-muted leading-relaxed">
                  {feature.description}
                </p>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
