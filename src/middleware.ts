// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  console.log('▶ middleware start');
  console.log('cookies before:', req.cookies.get('uuid'));
  const res = NextResponse.next();

  if (!req.cookies.get('uuid')) {
    const anonId = crypto.randomUUID();
    console.log('▶ setting uuid:', anonId);
    res.cookies.set('uuid', anonId, {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });
  }

  return res;
}

export const config = {
  matcher: ['/', '/api/init'],
};
