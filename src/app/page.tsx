import React from 'react';
import MainListMenu from '@ui/MainListMenu/MainList';
import Script from 'next/script';
import WebSocketDemo from '../ui/STest/STesxt';

export default function Page() {
  return (
    <div className="text-white p-4">
      {/* <MainListMenu /> */}
      <WebSocketDemo />
    </div>
  );
}
