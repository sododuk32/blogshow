'use client';

import React, { useEffect, useRef } from 'react';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
  CandlestickSeries,
} from 'lightweight-charts';

type Bar = {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export default function Intraday1MinChart({ symbol }: { symbol: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // 1) 차트 생성
    const chart: IChartApi = createChart(ref.current, {
      width: ref.current.clientWidth,
      height: 300,
      localization: {
        locale: 'ko-KR',
        // v3에서 X축 틱과 크로스헤어 시간 모두 이 포맷터로 처리합니다.
        timeFormatter: (time: UTCTimestamp) => {
          return new Date(time * 1000).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'Asia/Seoul',
          });
        },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      autoSize: true,
    });

    // 2) 캔들 시리즈 추가
    const series: ISeriesApi<'Candlestick'> = chart.addSeries(CandlestickSeries, {
      upColor: 'rgba(255, 17, 0, 0.6)',
      downColor: 'rgba(93, 0, 255, 0.6)',
      borderVisible: false,
      wickUpColor: '#ff0000',
      wickDownColor: '#4000ff',
    });

    // 3) 데이터 Fetch & 세팅
    fetch(`/api/testing/${symbol}`)
      .then((res) => res.json())
      .then((bars: Bar[]) => {
        // (a) 시간 오름차순 정렬
        const sorted = bars.slice().sort((a, b) => a.time - b.time);
        // (b) strict ascending 위한 중복 제거
        const unique = sorted.filter((bar, idx, arr) => idx === 0 || bar.time > arr[idx - 1].time);
        series.setData(unique);
      })
      .catch(console.error);

    // 4) 리사이즈 대응
    const handleResize = () => {
      chart.applyOptions({ width: ref.current!.clientWidth });
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [symbol]);

  return <div ref={ref} style={{ width: '100%', height: '300px' }} />;
}
