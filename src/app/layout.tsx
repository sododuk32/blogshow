import '../styles/globals.css';
import type { Metadata } from 'next';
import React from 'react';
import QueryProviders from '@handler/providers/tanstackQuery/QueryProviders';
import { RealTimeConnector } from '@handler/hook/useSharedWorker';
export const metadata: Metadata = {
  title: 'MY WTS',
  description: 'WTS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className=" text-white p-10">
        <RealTimeConnector />
        <QueryProviders>{children}</QueryProviders>
      </body>
    </html>
  );
}
