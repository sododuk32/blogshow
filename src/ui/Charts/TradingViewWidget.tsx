/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect, useRef, MutableRefObject, useState } from 'react';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
  CandlestickSeries,
} from 'lightweight-charts';
import { chartData } from '@util/types/charts/TData';
import { useSharedWorkerContext } from '@handler/providers/SharedWorkerFileProvider/CustomSWClient';
import { hhmmssToEpochSeconds } from '@util/format/time';

interface IntradayChartProps {
  staticData?: chartData[];
  code: string;
}
interface Candle {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
}

export default function IntradayChart({ staticData = [], code }: IntradayChartProps) {
  const [isopen, setOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi>();
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const { port, postMessage } = useSharedWorkerContext();
  const lastBucketRef = useRef<UTCTimestamp>(0 as UTCTimestamp);
  const currentCandleRef = useRef<Candle | null>(null);

  //  차트 초기화 및 staticData 세팅
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
      timeScale: { timeVisible: true, secondsVisible: false },
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
  }, []);

  useEffect(() => {
    if (staticData.length && seriesRef.current) {
      const lastTime = staticData[staticData.length - 1].time as UTCTimestamp;
      lastBucketRef.current = lastTime;
    }
  }, [staticData]);

  //  실시간 구독 & 업데이트
  useEffect(() => {
    if (!port || !seriesRef.current) return;

    const handler = (e: MessageEvent) => {
      const data = e.data.payload?.[0]?.data;
      if (!data) return;

      // 1) HHmmss → epoch 초
      const epochSec = hhmmssToEpochSeconds(Number(data.STCK_CNTG_HOUR));
      // 2) 분 버킷
      const bucket = (Math.floor(epochSec / 60) * 60) as UTCTimestamp;
      // 3) 틱 가격(혹은 필요한 가격 필드)
      const price = Number(data.STCK_PRPR) || 0;

      let candle = currentCandleRef.current;

      // 아직 candle 이 없다면, staticData 도 없었다는 뜻이므로 새 캔들 생성
      if (!candle) {
        candle = { time: bucket, open: price, high: price, low: price, close: price };
        currentCandleRef.current = candle;
        seriesRef.current?.update(candle);
        return;
      }

      // 같은 분
      if (candle.time === bucket) {
        // high/low 갱신
        candle.high = Math.max(candle.high, price);
        candle.low = Math.min(candle.low, price);
        candle.close = price;
        // update 호출하면 replace 동작
        seriesRef.current?.update(candle);
      }
      // 다음 분
      else if (bucket > candle.time) {
        // 분봉이 없는 경우 staticData 마지막값 참고
        // (만약 전 분 리턴이 없었다면 이 지점에서 마지막 candle 이 staticData 이므로 자연스럽게 이어짐)

        // 1) 새 candle 객체 생성
        const newCandle: Candle = {
          time: bucket,
          open: price,
          high: price,
          low: price,
          close: price,
        };
        currentCandleRef.current = newCandle;
        // append 동작
        seriesRef.current?.update(candle);
      }
      // 이전 분 틱이 들어온 경우(시간 왜곡) 무시
    };

    port.addEventListener('message', handler);
    postMessage({ type: 'subscribe', topic: 'realtime', detail: code, isStock: true });
    return () => port.removeEventListener('message', handler);
  }, [port, code]);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
