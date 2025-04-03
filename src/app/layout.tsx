import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My App',
  description: 'Testing Tailwind',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-black text-white p-10">
        <h1 className="text-4xl font-bold">Tailwind 작동 테스트 🎯 gd</h1>
        {children}
      </body>
    </html>
  );
}
