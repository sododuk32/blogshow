/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, MutableRefObject, useState } from 'react';
import { hhmmssToEpochSeconds } from '@util/format/time';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
  CandlestickSeries,
  TickMarkType,
} from 'lightweight-charts';
import { useSharedWorkerContext } from '../providers/SharedWorkerFileProvider/CustomSWClient';

interface Candle {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
}

/**
 *
 * @param seriesRef createChart로만든 chart.addSeries 내부의 최신가격을 업데이트 하기위해 받음.
 * @param code worker의 handler에 전달하기위해 종목 코드를 받음.
 * @returns shared worker 구독 및 최신데이터 업데이트를 실행.
 */
export function useRealtimeCandle(
  seriesRef: React.MutableRefObject<ISeriesApi<'Candlestick'> | null>,
  code: string
) {
  const { port, postMessage } = useSharedWorkerContext();
  const currentRef = useRef<Candle | null>(null);

  /**
   * candle.time 이라는 현재 시간 범위와 bucket이라는 실시간 시간 값을 비교해 차트의 최고,최저,현재 값 업데이트.
   *
   */
  useEffect(() => {
    if (!port || !seriesRef.current) return;

    const handler = (e: MessageEvent) => {
      const data = e.data.payload?.[0]?.data;
      if (!data) return;

      const epoch = hhmmssToEpochSeconds(Number(data.STCK_CNTG_HOUR));
      const bucket = (Math.floor(epoch / 60) * 60) as UTCTimestamp;
      const price = Number(data.STCK_PRPR) || 0;

      let candle = currentRef.current;

      if (!candle) {
        candle = { time: bucket, open: price, high: price, low: price, close: price };
        currentRef.current = candle;
        seriesRef.current?.update(candle);
        return;
      }

      if (candle.time === bucket) {
        candle.high = Math.max(candle.high, price);
        candle.low = Math.min(candle.low, price);
        candle.close = price;
        seriesRef.current?.update(candle);
      } else if (bucket > candle.time) {
        const newCandle: Candle = {
          time: bucket,
          open: price,
          high: price,
          low: price,
          close: price,
        };
        currentRef.current = newCandle;
        seriesRef.current?.update(candle);
      }
    };

    port.addEventListener('message', handler);
    postMessage({ type: 'subscribe', topic: 'realtime', detail: code, isStock: true });
    return () => port.removeEventListener('message', handler);
  }, [port, code]);
}
