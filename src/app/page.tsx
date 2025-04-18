import React from 'react';
import MainListMenu from '@ui/MainListMenu';
import { ExButton } from '@ui/ExampleButton/ExButton';

export default function Page() {
  return (
    <div className="bg-red-500 text-white p-4">
      <h1 className="text-4xl">Tailwind 1확인용</h1>
      <ExButton />
      <MainListMenu />
    </div>
  );
}
