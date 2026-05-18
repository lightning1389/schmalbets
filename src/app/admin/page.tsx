'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { GlowCard } from '@/components/ui/GlowCard';
import { Trade, TradeDirection, Conviction, Sentiment, Sector } from '@/lib/types';
import { formatCurrency, formatDate, getConvictionLabel, getConvictionColor } from '@/lib/utils';

export default function AdminPage() {
  const { admin, trades, login, logout, addTrade, removeTrade, seedData } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showNewTrade, setShowNewTrade] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    const result = await login(email, password);
    if (!result.success) {
      setLoginError(result.error || 'ACCESS DENIED — Invalid credentials');
    } else {
      setPassword('');
    }
    setLoginLoading(false);
  };

  const handleDelete = async (tradeId: string) => {
    if (deleteConfirm === tradeId) {
      setActionStatus('Deleting...');
      const success = await removeTrade(tradeId);
      setActionStatus(success ? 'Trade deleted' : 'Failed to delete');
      setDeleteConfirm(null);
      setTimeout(() => setActionStatus(null), 2000);
    } else {
      setDeleteConfirm(tradeId);
    }
  };

  const handleSeedData = async () => {
    setSeeding(true);
    setActionStatus('Seeding database...');
    const success = await seedData();
    setActionStatus(success ? 'Database seeded successfully!' : 'Failed to seed database');
    setSeeding(false);
    setTimeout(() => setActionStatus(null), 3000);
  };

  // Check session expiry
  if (admin.authenticated && admin.sessionExpiry < Date.now()) {
    logout();
  }

  if (!admin.authenticated) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <GlowCard glowColor="accent" className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-schmal-accent to-schmal-cyan flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-schmal-darker">S</span>
              </div>
              <h1 className="text-xl font-bold mb-2">ADMIN ACCESS</h1>
              <p className="text-xs font-mono text-schmal-muted tracking-wider">
                RESTRICTED — AUTHORIZED PERSONNEL ONLY
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-schmal-muted tracking-widest block mb-2">
                  EMAIL
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@schmalstreetbets.com"
                  className="w-full px-4 py-3 bg-schmal-surface border border-schmal-border rounded-lg text-sm font-mono text-white placeholder:text-schmal-muted focus:outline-none focus:border-schmal-accent/50 transition-colors"
                  autoComplete="email"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-schmal-muted tracking-widest block mb-2">
                  ACCESS CODE
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password..."
                  className="w-full px-4 py-3 bg-schmal-surface border border-schmal-border rounded-lg text-sm font-mono text-white placeholder:text-schmal-muted focus:outline-none focus:border-schmal-accent/50 transition-colors"
                  autoComplete="current-password"
                  required
                />
              </div>

              {loginError && (
                <p className="text-xs font-mono text-schmal-loss">{loginError}</p>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full px-6 py-3 bg-schmal-accent text-schmal-darker font-mono font-bold text-sm tracking-wider rounded-lg hover:bg-schmal-accent/90 transition-all disabled:opacity-50"
              >
                {loginLoading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
              </button>
            </form>

            <p className="text-[10px] font-mono text-schmal-muted text-center mt-6">
              Session expires after 30 minutes of inactivity.
              <br />
              All actions are logged.
            </p>
          </GlowCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <div className="container-schmal py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-schmal-profit animate-pulse" />
                <h1 className="text-xs font-mono text-schmal-muted tracking-[0.3em]">
                  ADMIN CONSOLE
                </h1>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Trade Management</h2>
              <p className="text-sm text-schmal-muted mt-1 font-mono">
                Authenticated as The Schmal · Session active
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleSeedData}
                disabled={seeding}
                className="px-6 py-2.5 border border-schmal-cyan/50 text-schmal-cyan font-mono font-bold text-xs tracking-wider rounded-lg hover:bg-schmal-cyan/10 transition-all disabled:opacity-50"
              >
                {seeding ? 'SEEDING...' : 'SEED DB'}
              </button>
              <button
                onClick={() => setShowNewTrade(!showNewTrade)}
                className="px-6 py-2.5 bg-schmal-accent text-schmal-darker font-mono font-bold text-xs tracking-wider rounded-lg hover:bg-schmal-accent/90 transition-all"
              >
                + NEW TRADE
              </button>
              <button
                onClick={logout}
                className="px-6 py-2.5 border border-schmal-loss/50 text-schmal-loss font-mono font-bold text-xs tracking-wider rounded-lg hover:bg-schmal-loss/10 transition-all"
              >
                LOGOUT
              </button>
            </div>
          </div>
          {actionStatus && (
            <div className="mt-4 px-4 py-2 bg-schmal-surface border border-schmal-border rounded-lg">
              <p className="text-xs font-mono text-schmal-accent">{actionStatus}</p>
            </div>
          )}
        </motion.div>

        {/* New Trade Form */}
        {showNewTrade && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-8"
          >
            <NewTradeForm
              onSubmit={async (trade) => {
                setActionStatus('Saving trade to Firebase...');
                const success = await addTrade(trade);
                setActionStatus(success ? 'Trade saved!' : 'Failed to save trade');
                if (success) setShowNewTrade(false);
                setTimeout(() => setActionStatus(null), 2000);
              }}
              onCancel={() => setShowNewTrade(false)}
            />
          </motion.div>
        )}

        {/* Trade list */}
        <GlowCard glowColor="accent">
          <h3 className="text-xs font-mono font-bold text-schmal-muted tracking-widest mb-6">
            ALL TRADES ({trades.length})
          </h3>
          <div className="overflow-x-auto -mx-6">
            <table className="data-table min-w-[900px]">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Symbol</th>
                  <th>Direction</th>
                  <th>Status</th>
                  <th>Entry</th>
                  <th>Current/Exit</th>
                  <th>Conviction</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade) => (
                  <tr key={trade.id}>
                    <td className="text-schmal-muted">{trade.id}</td>
                    <td className="font-bold text-white">{trade.symbol}</td>
                    <td>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        trade.direction === 'BUY'
                          ? 'bg-schmal-profit/10 text-schmal-profit'
                          : 'bg-schmal-loss/10 text-schmal-loss'
                      }`}>
                        {trade.direction}
                      </span>
                    </td>
                    <td>
                      <span className={trade.status === 'OPEN' ? 'text-schmal-accent' : 'text-schmal-muted'}>
                        {trade.status}
                      </span>
                    </td>
                    <td>{formatCurrency(trade.entryPrice)}</td>
                    <td>{formatCurrency(trade.exitPrice ?? trade.currentPrice)}</td>
                    <td>
                      <span style={{ color: getConvictionColor(trade.conviction) }}>
                        {getConvictionLabel(trade.conviction)}
                      </span>
                    </td>
                    <td className="text-schmal-muted">{formatDate(trade.entryDate)}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(trade.id)}
                        className={`px-3 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                          deleteConfirm === trade.id
                            ? 'bg-schmal-loss text-white'
                            : 'border border-schmal-loss/30 text-schmal-loss hover:bg-schmal-loss/10'
                        }`}
                      >
                        {deleteConfirm === trade.id ? 'CONFIRM DELETE' : 'DELETE'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlowCard>
      </div>
    </div>
  );
}

function NewTradeForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (trade: Trade) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    symbol: '',
    company: '',
    direction: 'BUY' as TradeDirection,
    entryPrice: '',
    shares: '',
    buyDate: new Date().toISOString().split('T')[0],
    conviction: 3 as Conviction,
    sentiment: 'BULLISH' as Sentiment,
    sector: 'Technology' as Sector,
    thesis: '',
    tags: '',
    stopLoss: '',
    target1: '',
    target1Label: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const trade: Trade = {
      id: `trade-${Date.now()}`,
      symbol: form.symbol.toUpperCase(),
      company: form.company,
      direction: form.direction,
      status: 'OPEN',
      entryPrice: parseFloat(form.entryPrice),
      currentPrice: parseFloat(form.entryPrice),
      shares: parseInt(form.shares),
      conviction: form.conviction,
      sentiment: form.sentiment,
      sector: form.sector,
      entryDate: form.buyDate,
      createdAt: now,
      updatedAt: now,
      thesis: form.thesis,
      notes: [],
      targets: form.target1
        ? [{ price: parseFloat(form.target1), label: form.target1Label || 'Target 1' }]
        : [],
      stopLoss: form.stopLoss ? parseFloat(form.stopLoss) : undefined,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    onSubmit(trade);
  };

  return (
    <GlowCard glowColor="accent">
      <h3 className="text-xs font-mono font-bold text-schmal-accent tracking-widest mb-6">
        NEW TRADE ENTRY
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="SYMBOL" required>
            <input
              type="text"
              required
              value={form.symbol}
              onChange={(e) => setForm({ ...form, symbol: e.target.value })}
              placeholder="NVDA"
              className="form-input"
            />
          </FormField>
          <FormField label="COMPANY" required>
            <input
              type="text"
              required
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="NVIDIA Corporation"
              className="form-input"
            />
          </FormField>
          <FormField label="DIRECTION">
            <select
              value={form.direction}
              onChange={(e) => setForm({ ...form, direction: e.target.value as TradeDirection })}
              className="form-input"
            >
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <FormField label="ENTRY PRICE" required>
            <input
              type="number"
              step="0.01"
              required
              value={form.entryPrice}
              onChange={(e) => setForm({ ...form, entryPrice: e.target.value })}
              placeholder="0.00"
              className="form-input"
            />
          </FormField>
          <FormField label="SHARES" required>
            <input
              type="number"
              required
              value={form.shares}
              onChange={(e) => setForm({ ...form, shares: e.target.value })}
              placeholder="100"
              className="form-input"
            />
          </FormField>
          <FormField label="BUY DATE" required>
            <input
              type="date"
              required
              value={form.buyDate}
              onChange={(e) => setForm({ ...form, buyDate: e.target.value })}
              className="form-input"
            />
          </FormField>
          <FormField label="CONVICTION">
            <select
              value={form.conviction}
              onChange={(e) => setForm({ ...form, conviction: parseInt(e.target.value) as Conviction })}
              className="form-input"
            >
              {[1, 2, 3, 4, 5].map((v) => (
                <option key={v} value={v}>{v} — {getConvictionLabel(v)}</option>
              ))}
            </select>
          </FormField>
          <FormField label="SENTIMENT">
            <select
              value={form.sentiment}
              onChange={(e) => setForm({ ...form, sentiment: e.target.value as Sentiment })}
              className="form-input"
            >
              <option value="BULLISH">BULLISH</option>
              <option value="BEARISH">BEARISH</option>
              <option value="NEUTRAL">NEUTRAL</option>
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="SECTOR">
            <select
              value={form.sector}
              onChange={(e) => setForm({ ...form, sector: e.target.value as Sector })}
              className="form-input"
            >
              {['Technology', 'Healthcare', 'Finance', 'Energy', 'Consumer', 'Industrial', 'Real Estate', 'Utilities', 'Materials', 'Telecom'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </FormField>
          <FormField label="STOP LOSS">
            <input
              type="number"
              step="0.01"
              value={form.stopLoss}
              onChange={(e) => setForm({ ...form, stopLoss: e.target.value })}
              placeholder="Optional"
              className="form-input"
            />
          </FormField>
          <FormField label="TAGS">
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="AI, momentum, growth"
              className="form-input"
            />
          </FormField>
        </div>

        <FormField label="TRADE THESIS" required>
          <textarea
            required
            value={form.thesis}
            onChange={(e) => setForm({ ...form, thesis: e.target.value })}
            placeholder="Detail your reasoning, market context, and conviction..."
            rows={4}
            className="form-input resize-none"
          />
        </FormField>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-schmal-border/30">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 border border-schmal-border text-schmal-muted font-mono font-bold text-xs tracking-wider rounded-lg hover:text-white transition-all"
          >
            CANCEL
          </button>
          <button
            type="submit"
            className="px-8 py-2.5 bg-schmal-accent text-schmal-darker font-mono font-bold text-xs tracking-wider rounded-lg hover:bg-schmal-accent/90 transition-all"
          >
            LOG TRADE
          </button>
        </div>
      </form>

      <style jsx>{`
        .form-input {
          width: 100%;
          padding: 8px 12px;
          background: #161b22;
          border: 1px solid #1b1f27;
          border-radius: 8px;
          font-size: 13px;
          font-family: 'JetBrains Mono', monospace;
          color: white;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-input:focus {
          border-color: rgba(0, 212, 170, 0.5);
        }
        .form-input::placeholder {
          color: #8b949e;
        }
      `}</style>
    </GlowCard>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-[10px] font-mono text-schmal-muted tracking-widest block mb-2">
        {label}
        {required && <span className="text-schmal-loss ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
