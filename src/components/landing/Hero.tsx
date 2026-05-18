'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { TerminalText } from '@/components/ui/TerminalText';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 grid-bg" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-schmal-accent/5 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-schmal-cyan/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-schmal-profit/3 rounded-full blur-[80px] animate-float" style={{ animationDelay: '4s' }} />

      {/* Floating candle elements */}
      <FloatingCandles />

      {/* Main content */}
      <div className="relative z-10 container-schmal text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Terminal prefix */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-schmal-border/50 bg-schmal-card/50 mb-8">
            <div className="w-2 h-2 rounded-full bg-schmal-profit animate-pulse" />
            <span className="text-xs font-mono text-schmal-muted tracking-wider">
              INTELLIGENCE TERMINAL v2.0 — SYSTEMS ONLINE
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6"
        >
          <span className="text-white">SCHMAL</span>
          <span className="text-schmal-accent text-glow-accent">STREET</span>
          <span className="text-white">BETS</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-8"
        >
          <p className="text-lg md:text-xl text-schmal-muted font-light max-w-2xl mx-auto">
            <TerminalText
              text="Every move leaves a trace. Every conviction is logged. The market remembers."
              speed={30}
              delay={800}
            />
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href="/dashboard/"
            className="px-8 py-3 bg-schmal-accent text-schmal-darker font-mono font-bold text-sm tracking-wider rounded-lg hover:bg-schmal-accent/90 transition-all glow-accent"
          >
            ENTER TERMINAL
          </Link>
          <Link
            href="/dashboard/"
            className="px-8 py-3 border border-schmal-border text-schmal-text font-mono font-medium text-sm tracking-wider rounded-lg hover:border-schmal-accent/50 hover:text-schmal-accent transition-all"
          >
            VIEW LEDGER
          </Link>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {[
            { label: 'TOTAL TRADES', value: '8', sub: 'logged' },
            { label: 'WIN RATE', value: '75%', sub: 'accuracy' },
            { label: 'AVG RETURN', value: '+36%', sub: 'per position' },
            { label: 'SHARPE', value: '2.14', sub: 'ratio' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4 text-center">
              <p className="text-2xl md:text-3xl font-bold font-mono text-schmal-accent">
                {stat.value}
              </p>
              <p className="text-[10px] font-mono text-schmal-muted tracking-widest mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-schmal-dark to-transparent" />
    </section>
  );
}

function FloatingCandles() {
  const candles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${8 + (i * 7.5)}%`,
    height: 30 + Math.random() * 60,
    wickTop: 8 + Math.random() * 15,
    wickBottom: 8 + Math.random() * 15,
    isGreen: Math.random() > 0.45,
    delay: i * 0.3,
    duration: 3 + Math.random() * 4,
    opacity: 0.04 + Math.random() * 0.06,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {candles.map((c) => (
        <motion.div
          key={c.id}
          className="absolute bottom-0"
          style={{ left: c.left }}
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: c.opacity,
            y: [0, -10, 0],
          }}
          transition={{
            opacity: { duration: 1, delay: c.delay },
            y: { duration: c.duration, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          {/* Wick top */}
          <div
            className="w-px mx-auto"
            style={{
              height: c.wickTop,
              backgroundColor: c.isGreen ? '#00ff88' : '#ff4444',
            }}
          />
          {/* Body */}
          <div
            className="w-3 rounded-sm"
            style={{
              height: c.height,
              backgroundColor: c.isGreen ? '#00ff88' : '#ff4444',
            }}
          />
          {/* Wick bottom */}
          <div
            className="w-px mx-auto"
            style={{
              height: c.wickBottom,
              backgroundColor: c.isGreen ? '#00ff88' : '#ff4444',
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
