import { NextResponse } from 'next/server';
import { getKey } from '@/util/cronFile/keyStore';

export async function GET() {
  const key = getKey();
  return NextResponse.json({ message: key || 'no key' });
}
