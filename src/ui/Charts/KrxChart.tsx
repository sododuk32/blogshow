/* eslint-disable @typescript-eslint/no-explicit-any */
// app/components/KrxChart.tsx
'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

export default function KrxChart({ code }: { code: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).TradingView && containerRef.current) {
      new (window as any).TradingView.widget({
        container_id: containerRef.current.id,
        symbol: `KRX:${code}`,
        interval: '60',
        timezone: 'Asia/Seoul',
        theme: 'light',
        autosize: true,
      });
    }
  }, [code]);

  return (
    <>
      <Script src="https://s3.tradingview.com/tv.js" strategy="afterInteractive" />

      <div id="tv-krx-462860" ref={containerRef} style={{ width: '100%', height: '400px' }} />
    </>
  );
}
