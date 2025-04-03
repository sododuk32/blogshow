import React from 'react';

// async function getData(code: string | undefined) {
//   // 서버에서 호출해야 하는 로직을 여기서 직접 처리
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
  return [{ code: 'apple' }, { code: 'samsung' }, { code: 'tesla' }];
}

type Props = {
  params: { code: string };
};

export default function StockDetailPage({ params }: Props) {
  return <div>상세 페이지: {params.code}</div>;
}
