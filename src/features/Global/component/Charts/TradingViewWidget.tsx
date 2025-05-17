/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React from 'react';

import useCandleChart from '../../hook/useCandleChart';
import { useRealtimeCandle } from '../../hook/useRealtimechart';
import { IntradayChartProps } from '@util/types/charts/TData';

export default function IntradayChart({ staticData = [], code }: IntradayChartProps) {
  const { containerRef, seriesRef } = useCandleChart(staticData);
  useRealtimeCandle(seriesRef, code);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
