import '../styles/globals.css';
import type { Metadata } from 'next';
import React from 'react';
import QueryProviders from '@features/Global/providers/tanstackQuery/QueryProviders';
import { SharedWorkerProvider } from '../features/Global/providers/SharedWorkerFileProvider/CustomSWClient';
export const metadata: Metadata = {
  title: 'MY WTS',
  description: 'WTS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <SharedWorkerProvider>
          <QueryProviders>{children}</QueryProviders>
        </SharedWorkerProvider>
      </body>
    </html>
  );
}
