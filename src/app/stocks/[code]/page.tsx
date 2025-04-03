import React from 'react';

// async function getData(code: string | undefined) {
//
//   return code ?? 'noData';
// }

// type Props = {
//   searchParams: { code?: string };
// };

// export default async function StocksPage({ searchParams }: Props) {
//   const data = await getData(searchParams.code);

//   return <div>{data}</div>;
// }
// app/stocks/[code]/page.tsx

export async function generateStaticParams() {
  return [{ code: 'apple' }, { code: 'samsung' }, { code: 'tsla' }, { code: 'Alphabet' }];
}

type Props = {
  params: { code: string };
};

export default function StockDetailPage({ params }: Props) {
  return <div>상세 페이지g: {params.code}</div>;
}
