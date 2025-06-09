'use client';
import React, { useEffect, useRef } from 'react';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
  CandlestickSeries,
  TickMarkType,
} from 'lightweight-charts';
import { chartData, IntradayChartProps } from '@util/types/charts/TData';

/**
 * 차트생성,차트 리사이즈 이벤트 핸들러 생성, 차트에 사용될 값,최신가격 관리.
 * @param staticData 현재 사용중인 고정된 데이터.
 * @returns
 */
function useCandleChart(staticData: chartData[]) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi>();
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const lastBucketRef = useRef<UTCTimestamp>(0 as UTCTimestamp);

  /**차트 리사이즈핸들러,설정 주입 */
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const chart = createChart(node, {
      width: node.clientWidth,
      height: 300,
      localization: {
        locale: 'ko-KR',
        timeFormatter: (time: UTCTimestamp) =>
          new Date(time * 1000).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'Asia/Seoul',
          }),
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time: UTCTimestamp, tickMarkType: TickMarkType, locale: string) => {
          const d = new Date(time * 1000);
          return d.toLocaleTimeString(locale, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'Asia/Seoul',
          });
        },
      },
      autoSize: true,
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: 'rgba(255,17,0,0.6)',
      downColor: 'rgba(93,0,255,0.6)',
      borderVisible: false,
      wickUpColor: '#ff0000',
      wickDownColor: '#4000ff',
    });

    series.setData(staticData);
    chartRef.current = chart;
    seriesRef.current = series;

    const handleResize = () => {
      chart.applyOptions({ width: node.clientWidth });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  });

  /** 최신 시간 업데이트 */
  useEffect(() => {
    if (staticData.length && seriesRef.current) {
      const lastTime = staticData[staticData.length - 1].time as UTCTimestamp;
      lastBucketRef.current = lastTime;
    }
  }, [staticData]);
  return { containerRef, seriesRef };
}

export default useCandleChart;
