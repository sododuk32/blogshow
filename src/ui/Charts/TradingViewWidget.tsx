/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect, useRef } from 'react';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
  CandlestickSeries,
} from 'lightweight-charts';
import { chartData } from '@util/types/charts/TData';
import { useRTStore } from '@handler/store/sharedStore/createRTGenericStore';
import { useSharedWorkerContext } from '../../handler/providers/SharedWorkerFileProvider/CustomSWClient';

export default function Intraday1MinChart({
  staticData,
  code,
}: {
  staticData: chartData[] | undefined;
  code: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const addPaper = useRTStore((s) => s.addPaper);
  const hasStock = useRTStore((s) => s.hasStock);
  const { port, postMessage } = useSharedWorkerContext();

  useEffect(() => {
    if (!port) return;
    const handler = (e: MessageEvent) => console.log(e.data);
    port.addEventListener('message', handler);
    postMessage({ type: 'subscribe', topick: 'realtime', detail: code, isStock: true });
    return () => {
      port.removeEventListener('message', handler);
    };
  }, [port]);

  useEffect(() => {
    if (!ref.current) return;
    // viewport 기준 실행 유무 갈라야함.

    const papers = { meta: { type: 'subscribe', topick: 'realtime', detail: code, isStock: true } };
    addPaper(papers);

    // viewport 기준 실행 유무 갈라야함.

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
    series.setData(staticData || []);

    // 4) 리사이즈 대응
    const handleResize = () => {
      chart.applyOptions({ width: ref.current!.clientWidth });
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [staticData, code]);

  return <div ref={ref} style={{ width: '100%', height: '300px' }} />;
}
