/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import MainListMenu from '@ui/MainListMenu/MainList';
import KrxChart from '@ui/Charts/KrxChart';
import Intraday5MinChart from '../../../ui/Charts/TradingViewWidget';

type Props = {
  params: { code: string };
};

async function getDogs(number: string) {
  const res = fetch(`https://dragonball-api.com/api/characters/${number}`, {
    headers: { accept: 'application/json' },
    next: { revalidate: 3600 },
  });
  if (!(await res).ok) {
  }
  const json = await (await res).json();

  return json;
}
export async function generateMetadata({ params }: { params: { code: string } }) {
  const stock = await getDogs(params.code); // ✅ 여기서 바로 await

  return {
    title: `${stock?.name}`,
    description: `${stock?.description}`,
    openGraph: {
      title: `${stock?.name}`,
      description: `${stock?.description}`,
      images: [stock?.image],
    },
  };
}

export default async function Page({ params }: Props) {
  const dogs = await getDogs(params.code);

  return (
    <div>
      {params.code.length > 0 && <h1>{params.code}</h1>}
      <Intraday5MinChart symbol={params.code} />
    </div>
  );
}
