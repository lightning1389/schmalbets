'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'accent' | 'profit' | 'loss' | 'warning' | 'none';
  hover?: boolean;
}

export function GlowCard({ children, className, glowColor = 'none', hover = true }: GlowCardProps) {
  const glowStyles = {
    accent: 'hover:border-schmal-accent/20 hover:shadow-[0_0_30px_rgba(0,212,170,0.05)]',
    profit: 'hover:border-schmal-profit/20 hover:shadow-[0_0_30px_rgba(0,255,136,0.05)]',
    loss: 'hover:border-schmal-loss/20 hover:shadow-[0_0_30px_rgba(255,68,68,0.05)]',
    warning: 'hover:border-schmal-warning/20 hover:shadow-[0_0_30px_rgba(255,136,0,0.05)]',
    none: '',
  };

  return (
    <div
      className={cn(
        'glass-card p-6 transition-all duration-300',
        hover && glowStyles[glowColor],
        className
      )}
    >
      {children}
    </div>
  );
}
