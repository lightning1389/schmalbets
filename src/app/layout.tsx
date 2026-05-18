import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DataProvider } from '@/components/DataProvider';

export const metadata: Metadata = {
  title: 'Schmalstreetbets — The Schmal',
  description: 'Elite Financial Intelligence Terminal. Every move leaves a trace.',
  keywords: 'trading, stocks, financial intelligence, market analysis',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-schmal-dark text-white noise-overlay">
        <DataProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </DataProvider>
      </body>
    </html>
  );
}
