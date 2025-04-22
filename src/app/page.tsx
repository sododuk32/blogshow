import React from 'react';
import { ExButton } from '@ui/ExampleButton/ExButton';
import MainListMenu from '@ui/MainListMenu/MainList';
export default function Page() {
  return (
    <div className="bg-red-500 text-white p-4">
      <h1 className="text-4xl">Tailwind 1확인용</h1>
      <ExButton />
      <MainListMenu />
    </div>
  );
}
