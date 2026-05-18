import { STOCKS } from '@/lib/mockData';
import StockPageClient from './StockPageClient';

export function generateStaticParams() {
  return STOCKS.map((stock) => ({
    symbol: stock.symbol,
  }));
}

export default function StockPage({ params }: { params: { symbol: string } }) {
  return <StockPageClient symbol={params.symbol} />;
}
