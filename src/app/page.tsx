'use client';

import { Hero } from '@/components/landing/Hero';
import { TickerBar } from '@/components/landing/TickerBar';
import { Features } from '@/components/landing/Features';
import { MarketIntelligence } from '@/components/landing/MarketIntelligence';
import { MarketSentiment } from '@/components/landing/MarketSentiment';

export default function HomePage() {
  return (
    <>
      <Hero />
      <TickerBar />
      <MarketSentiment />
      <Features />
      <MarketIntelligence />
    </>
  );
}
