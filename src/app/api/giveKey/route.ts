import { NextResponse } from 'next/server';
import { getKey, setKey } from '@/util/cronFile/keyStore';

export async function GET() {
  const key = getKey();

  if (!key) {
    //   setKey()
  }
  return NextResponse.json({ message: key || 'no key' });
}
