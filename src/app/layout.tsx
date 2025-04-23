import '../styles/globals.css';
import type { Metadata } from 'next';
import React from 'react';
import QueryProviders from '@handler/providers/tanstackQuery/QueryProviders';

export const metadata: Metadata = {
  title: 'My App',
  description: 'Testing Tailwind',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className=" text-white p-10">
        <QueryProviders>{children}</QueryProviders>
      </body>
    </html>
  );
}
