'use client';

import { Hero } from '@/components/landing/Hero';
import { TickerBar } from '@/components/landing/TickerBar';
import { Features } from '@/components/landing/Features';
import { MarketIntelligence } from '@/components/landing/MarketIntelligence';

export default function HomePage() {
  return (
    <>
      <Hero />
      <TickerBar />
      <Features />
      <MarketIntelligence />
    </>
  );
}
