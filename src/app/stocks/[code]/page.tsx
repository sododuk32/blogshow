/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Intraday5MinChart from '@ui/Charts/TradingViewWidget';
import { chartData } from '@util/types/charts/TData';
import getStockDetail from '@handler/http/getStockDetail/getStockDetail';

export const dynamic = 'force-dynamic';

type Props = {
  params: { code: string };
};

export async function generateMetadata({ params }: { params: { code: string } }) {
  const stock = (await getStockDetail(params.code)).nameof;

  return {
    title: `${stock?.hts_kor_isnm}`,
    description: `[${params}] ${stock?.hts_kor_isnm} 주식 정보 `,
    openGraph: {
      title: `${stock?.hts_kor_isnm} 상세 페이지`,
      description: `[${params}] ${stock?.hts_kor_isnm}`,
      images: '',
    },
  };
}

export default async function Page({ params }: Props) {
  const dogs = await getStockDetail(params.code);

  const chartdata = dogs.array;
  console.log(chartdata);
  return (
    <div>
      {params.code.length > 0 && <h1>{params.code}</h1>}
      <Intraday5MinChart code={params.code} staticData={chartdata && chartdata} />
    </div>
  );
}
