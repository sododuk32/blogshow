/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { getKey, setKey } from '@/util/cronFile/keyStore';
import fetchingHTKey, { fetchingHTSocketKey } from '@handler/http/auth/fetchGettingKey';
import { KeyPackage } from '@util/types/authWithHantoo';

export async function GET() {
  const key = getKey();
  if (key) {
    console.log('✅ 캐시된 키 있음');
    return NextResponse.json({ message: 'have hash' });
  }

  console.log('🚀 키 없음 → fetch 시도');
  const [keyResult, socketResult] = await Promise.allSettled([
    fetchingHTKey(),
    fetchingHTSocketKey(),
  ]);

  const now = () => new Date().getTime();
  const packages: KeyPackage[] = [];

  if (keyResult.status === 'fulfilled' && keyResult.value?.HASH) {
    packages.push({ value: keyResult.value.HASH, timestamp: now() });
  }

  if (socketResult.status === 'fulfilled' && socketResult.value?.approval_key) {
    packages.push({ value: socketResult.value.approval_key, timestamp: now() });
  }

  if (packages.length > 0) {
    setKey(packages); // 🔐 저장
    return NextResponse.json({ message: 'get new keys' });
  }

  return NextResponse.json({ message: 'no' });
}
