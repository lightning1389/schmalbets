'use client';

import { motion } from 'framer-motion';
import { TradeLedger } from '@/components/trades/TradeLedger';
import { useStore } from '@/lib/store';

export default function TradesPage() {
  const { trades } = useStore();

  return (
    <div className="pt-16">
      <div className="container-schmal py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-schmal-accent animate-pulse" />
            <h1 className="text-xs font-mono text-schmal-muted tracking-[0.3em]">
              PERMANENT RECORD
            </h1>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">Trade Ledger</h2>
          <p className="text-sm text-schmal-muted mt-1 font-mono">
            Every trade is immutable. Every conviction is logged. The market remembers.
          </p>
        </motion.div>

        {/* Ledger */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <TradeLedger trades={trades} />
        </motion.div>
      </div>
    </div>
  );
}
