/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';
import { getKey, setKey } from '@/util/cronFile/keyStore';
import fetchingHTKey, {
  fetchingHTSocketKey,
  fetchingHTAccessToken,
} from '@handler/http/auth/fetchGettingKey';
import { KeyPackage } from '@util/types/authWithHantoo';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const key = getKey();

  if (!key.valid) {
    console.log('키가 없거나 만료됨');

    console.log(' 키 없음 → fetch 시도');

    try {
      const [keyResult, socketResult, AcKey] = await Promise.allSettled([
        fetchingHTKey(),
        fetchingHTSocketKey(),
        fetchingHTAccessToken(),
      ]);

      const now = () => new Date().getTime();
      const packages: KeyPackage[] = [];

      console.log(keyResult);
      if (keyResult.status === 'fulfilled' && keyResult.value?.HASH) {
        packages.push({ value: keyResult.value.HASH, timestamp: now(), type: 'hash' });
      }

      if (socketResult.status === 'fulfilled' && socketResult.value?.approval_key) {
        packages.push({ value: socketResult.value.approval_key, timestamp: now(), type: 'socket' });
      }

      if (AcKey.status === 'fulfilled' && AcKey.value?.access_token) {
        packages.push({ value: AcKey.value.access_token, timestamp: now(), type: 'accessKey' });
      }

      if (packages.length > 0) {
        setKey(packages); // 🔐 저장
        return NextResponse.json({ message: 'get new keys' });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'server error' });
    }
  }

  return NextResponse.json({ message: 'have key' });
}
