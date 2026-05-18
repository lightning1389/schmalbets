'use client';

import { PortfolioMetrics } from '@/lib/types';
import { formatCompactCurrency, formatPercent } from '@/lib/utils';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { GlowCard } from '@/components/ui/GlowCard';

interface PerformanceMetricsProps {
  metrics: PortfolioMetrics;
}

export function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  const cards = [
    {
      label: 'PORTFOLIO VALUE',
      value: metrics.totalValue,
      prefix: '$',
      decimals: 0,
      color: 'text-white',
      sub: formatCompactCurrency(metrics.totalValue),
    },
    {
      label: 'TOTAL P&L',
      value: metrics.totalGain,
      prefix: metrics.totalGain >= 0 ? '+$' : '-$',
      decimals: 0,
      color: metrics.totalGain >= 0 ? 'text-schmal-profit' : 'text-schmal-loss',
      sub: formatPercent(metrics.totalGainPercent),
    },
    {
      label: 'WIN RATE',
      value: metrics.winRate,
      suffix: '%',
      decimals: 1,
      color: 'text-schmal-accent',
      sub: `${metrics.totalTrades} trades`,
    },
    {
      label: 'SHARPE RATIO',
      value: metrics.sharpeRatio,
      decimals: 2,
      color: 'text-schmal-cyan',
      sub: 'risk-adjusted',
    },
    {
      label: 'OPEN POSITIONS',
      value: metrics.openPositions,
      decimals: 0,
      color: 'text-schmal-warning',
      sub: 'active',
    },
    {
      label: 'AVG HOLDING',
      value: metrics.avgHoldingDays,
      suffix: 'd',
      decimals: 0,
      color: 'text-schmal-text',
      sub: 'days',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => (
        <GlowCard key={card.label} glowColor="accent" className="text-center p-4">
          <p className="text-[10px] font-mono text-schmal-muted tracking-widest mb-2">
            {card.label}
          </p>
          <p className={`text-xl md:text-2xl font-bold font-mono ${card.color}`}>
            <AnimatedCounter
              value={Math.abs(card.value)}
              prefix={card.prefix || ''}
              suffix={card.suffix || ''}
              decimals={card.decimals}
            />
          </p>
          <p className="text-[10px] font-mono text-schmal-muted mt-1">{card.sub}</p>
        </GlowCard>
      ))}
    </div>
  );
}
