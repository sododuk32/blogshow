/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { getKey, setKey } from '@/util/cronFile/keyStore';
import fetchingHTKey, { HashKeyRes } from '@handler/http/auth/fetchGettingKey';

export async function GET() {
  console.log('getKey');

  const key = getKey();

  console.log('key:   ' + key);
  if (!key) {
    console.log('no keys');
    const realKey: HashKeyRes | undefined = await fetchingHTKey();

    if (realKey?.HASH) {
      setKey(realKey?.HASH);

      //if (realKey?.HASH)
      return NextResponse.json({ message: realKey });
    }
    // if (!key)
    return NextResponse.json({ message: 'no' });
  }
  // yes key
  console.log('yes keys');
  return NextResponse.json({ message: 'have hash' });
}
