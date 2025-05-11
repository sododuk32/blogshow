import '../styles/globals.css';
import type { Metadata } from 'next';
import React from 'react';
import QueryProviders from '@handler/providers/tanstackQuery/QueryProviders';
import { SharedWorkerProvider } from '../handler/providers/SharedWorkerFileProvider/CustomSWClient';
export const metadata: Metadata = {
  title: 'MY WTS',
  description: 'WTS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className=" text-white p-10">
        <SharedWorkerProvider>
          <QueryProviders>{children}</QueryProviders>
        </SharedWorkerProvider>
      </body>
    </html>
  );
}
