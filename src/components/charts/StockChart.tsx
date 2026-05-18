'use client';

import { useEffect, useRef, useState } from 'react';
import { CandleData, Trade } from '@/lib/types';

interface StockChartProps {
  data: CandleData[];
  trades?: Trade[];
  symbol: string;
  onMarkerClick?: (trade: Trade) => void;
}

export function StockChart({ data, trades = [], symbol, onMarkerClick }: StockChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof import('lightweight-charts').createChart> | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function initChart() {
      if (!containerRef.current || !mounted) return;

      const { createChart, ColorType, CrosshairMode } = await import('lightweight-charts');

      if (!mounted || !containerRef.current) return;

      // Clear previous chart
      if (chartRef.current) {
        chartRef.current.remove();
      }

      const chart = createChart(containerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: '#8b949e',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 11,
        },
        grid: {
          vertLines: { color: 'rgba(27, 31, 39, 0.5)' },
          horzLines: { color: 'rgba(27, 31, 39, 0.5)' },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
          vertLine: { color: 'rgba(0, 212, 170, 0.3)', labelBackgroundColor: '#0d1117' },
          horzLine: { color: 'rgba(0, 212, 170, 0.3)', labelBackgroundColor: '#0d1117' },
        },
        rightPriceScale: {
          borderColor: 'rgba(27, 31, 39, 0.5)',
        },
        timeScale: {
          borderColor: 'rgba(27, 31, 39, 0.5)',
          timeVisible: false,
        },
        handleScroll: { vertTouchDrag: false },
      });

      const candleSeries = chart.addCandlestickSeries({
        upColor: '#00ff88',
        downColor: '#ff4444',
        borderUpColor: '#00ff88',
        borderDownColor: '#ff4444',
        wickUpColor: '#00ff88',
        wickDownColor: '#ff4444',
      });

      candleSeries.setData(data as Parameters<typeof candleSeries.setData>[0]);

      // Add volume
      const volumeSeries = chart.addHistogramSeries({
        color: 'rgba(0, 212, 170, 0.15)',
        priceFormat: { type: 'volume' },
        priceScaleId: 'volume',
      });

      chart.priceScale('volume').applyOptions({
        scaleMargins: { top: 0.8, bottom: 0 },
      });

      if (data[0]?.volume !== undefined) {
        volumeSeries.setData(
          data.map((d) => ({
            time: d.time,
            value: d.volume || 0,
            color: d.close >= d.open ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255, 68, 68, 0.15)',
          })) as Parameters<typeof volumeSeries.setData>[0]
        );
      }

      // Add trade markers
      const relevantTrades = trades.filter((t) => t.symbol === symbol);
      if (relevantTrades.length > 0) {
        const markers = relevantTrades.map((trade) => ({
          time: trade.entryDate,
          position: trade.direction === 'BUY' ? 'belowBar' as const : 'aboveBar' as const,
          color: trade.direction === 'BUY' ? '#00ff88' : '#ff4444',
          shape: trade.direction === 'BUY' ? 'arrowUp' as const : 'arrowDown' as const,
          text: `${trade.direction} @ $${trade.entryPrice}`,
        }));

        // Sort markers by time
        markers.sort((a, b) => a.time.localeCompare(b.time));
        candleSeries.setMarkers(markers as Parameters<typeof candleSeries.setMarkers>[0]);
      }

      chart.timeScale().fitContent();

      // Handle resize
      const resizeObserver = new ResizeObserver(() => {
        if (containerRef.current && mounted) {
          chart.applyOptions({
            width: containerRef.current.clientWidth,
            height: containerRef.current.clientHeight,
          });
        }
      });
      resizeObserver.observe(containerRef.current);

      // Click handler for markers
      if (onMarkerClick) {
        chart.subscribeCrosshairMove((param) => {
          // Marker click handling would go here
        });
      }

      chartRef.current = chart;
      setLoaded(true);

      return () => {
        resizeObserver.disconnect();
      };
    }

    initChart();

    return () => {
      mounted = false;
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data, trades, symbol, onMarkerClick]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="w-full h-[500px] rounded-lg overflow-hidden"
        style={{ minHeight: '400px' }}
      />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-schmal-card rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-schmal-accent border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono text-schmal-muted">Loading chart...</span>
          </div>
        </div>
      )}
    </div>
  );
}
