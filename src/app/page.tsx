'use client';

import { Hero } from '@/components/landing/Hero';
import { TickerBar } from '@/components/landing/TickerBar';
import { MarketIntelligence } from '@/components/landing/MarketIntelligence';
import { MarketSentiment } from '@/components/landing/MarketSentiment';

export default function HomePage() {
  return (
    <>
      <Hero />
      <TickerBar />
      <MarketSentiment />
      <MarketIntelligence />
    </>
  );
}
