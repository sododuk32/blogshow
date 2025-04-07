/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

type Props = {
  params: { code: string };
};

async function getDogs(number: string) {
  const res = fetch(`https://dragonball-api.com/api/characters/${number}`, {
    headers: { accept: 'application/json' },
    next: { revalidate: 3600 },
  });
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
      <div>
        <ul>
          <li key={dogs.id}>{dogs?.name}</li>
          {/* this part for server components , and props go throght out data is change every time  */}
        </ul>
      </div>
    </div>
  );
}
