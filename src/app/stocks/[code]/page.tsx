import React from 'react';

async function getData(code: string | undefined) {
  // 서버에서 호출해야 하는 로직을 여기서 직접 처리
  return code ?? 'noData';
}

type Props = {
  searchParams: { code?: string };
};

export default async function StocksPage({ searchParams }: Props) {
  const data = await getData(searchParams.code);

  return <div>{data}</div>;
}
