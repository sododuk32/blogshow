/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Intraday5MinChart from '@features/Global/component/Charts/TradingViewWidget';
import { chartData } from '@util/types/charts/TData';
import getStockDetail from '@features/Global/http_client/getStockDetail/getStockDetail';
import NewsLine from '../../../features/News/component/NewsLine/NewsLine';
import NewsLoader from '../../../features/News/component/NewsLoader/NewsLoader';
export const dynamic = 'force-dynamic';

type Props = {
  params: { code: string; korName?: string };
};

export async function generateMetadata({ params }: { params: { code: string } }) {
  const stock = (await getStockDetail(params.code)).nameof;

  return {
    title: `${stock?.hts_kor_isnm}`,
    description: `[${params}] ${stock?.hts_kor_isnm} 주식 정보 `,
    openGraph: {
      title: `${stock?.hts_kor_isnm || 'my wts'} 상세 페이지`,
      description: `[${params}] ${stock?.hts_kor_isnm} 주식 정보`,
      images: '',
    },
  };
}

export default async function Page({ params }: Props) {
  const dogs = await getStockDetail(params.code);

  const chartdata = dogs.array;
  return (
    <div>
      <Intraday5MinChart
        code={params.code}
        staticData={chartdata && chartdata}
        stockName={dogs.nameof?.hts_kor_isnm}
      />

      <NewsLoader keywords={dogs.nameof?.hts_kor_isnm} />
    </div>
  );
}
