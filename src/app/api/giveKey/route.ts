/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { getKey, setKey } from '@/util/cronFile/keyStore';
import fetchingHTKey from '../../../handler/http/fetchGettingKey';
import { AccessTokenRes } from '../../../handler/http/fetchGettingKey';
export async function GET() {
  const key = getKey();

  console.log('key:   ' + key);
  if (!key) {
    console.log('no keys');
    const realKey: AccessTokenRes | undefined = await fetchingHTKey();
    console.log(realKey?.access_token);
    if (realKey?.access_token) {
      setKey(realKey?.access_token);

      //if (realKey?.HASH)
      return NextResponse.json({ message: 'get new hash' });
    }
    // if (!key)
    return NextResponse.json({ message: 'no' });
  }
  // yes key
  console.log('yes keys');
  return NextResponse.json({ message: 'have hash' });
}
