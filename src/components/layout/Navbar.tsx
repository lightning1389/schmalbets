'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { admin } = useStore();

  const links = [
    { href: '/', label: 'HOME' },
    { href: '/dashboard/', label: 'DASHBOARD' },
    { href: '/admin/', label: admin.authenticated ? '◆ ADMIN' : 'ADMIN' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-schmal-border/50">
      <div className="absolute inset-0 bg-schmal-darker/80 backdrop-blur-xl" />
      <div className="relative container-schmal flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-schmal-accent to-schmal-cyan flex items-center justify-center font-mono font-bold text-sm text-schmal-darker">
            S
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-wider text-white group-hover:text-schmal-accent transition-colors">
              SCHMALSTREETBETS
            </span>
            <span className="text-[10px] font-mono text-schmal-muted tracking-widest">
              THE SCHMAL
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-xs font-mono font-medium text-schmal-muted hover:text-schmal-accent transition-colors tracking-wider"
            >
              {link.label}
            </Link>
          ))}
          <div className="ml-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-schmal-profit animate-pulse" />
            <span className="text-[10px] font-mono text-schmal-muted">LIVE</span>
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-schmal-muted hover:text-white"
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {mobileOpen ? (
              <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" />
            ) : (
              <>
                <path d="M3 6H17M3 10H17M3 14H17" stroke="currentColor" strokeWidth="1.5" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="relative md:hidden border-t border-schmal-border/50 bg-schmal-darker/95 backdrop-blur-xl"
          >
            <div className="container-schmal py-4 flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-xs font-mono font-medium text-schmal-muted hover:text-schmal-accent transition-colors tracking-wider"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
