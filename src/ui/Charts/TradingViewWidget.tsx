'use client';

import React, { useEffect, useRef } from 'react';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
  CandlestickSeries, // ← 추가
} from 'lightweight-charts';
type Bar = {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export default function Intraday5MinChart({ symbol }: { symbol: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const chart: IChartApi = createChart(ref.current, {
      width: ref.current.clientWidth,
      height: 300,
    });
    const series: ISeriesApi<'Candlestick'> = chart.addSeries(CandlestickSeries, {
      upColor: 'rgba(0,150,136,0.6)',
      downColor: 'rgba(255,82,82,0.6)',
      borderVisible: false,
      wickUpColor: 'rgba(0,150,136,1)',
      wickDownColor: 'rgba(255,82,82,1)',
    });
    fetch(`/api/testing/${symbol}`)
      .then((res) => res.json())
      .then((bars: Bar[]) => {
        series.setData(bars);
      })
      .catch(console.error);

    // 리사이즈 대응
    const handleResize = () => chart.applyOptions({ width: ref.current!.clientWidth });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [symbol]);

  return <div ref={ref} style={{ width: '100%', height: '300px' }} />;
}
