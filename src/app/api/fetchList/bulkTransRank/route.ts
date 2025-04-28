import { NextRequest, NextResponse } from 'next/server';
import { getKey } from '@/util/cronFile/keyStore';
import getBulkTransRank from '@handler/http/gettingList/getBulkTransRank';

export async function GET(req: NextRequest) {
  const key = getKey();
  if (key) {
    const response = await getBulkTransRank();

    if (response?.message !== 'good') {
      return NextResponse.json({ message: response.message || 'error' }, { status: 400 });
    }
    return NextResponse.json(response);
  }

  return NextResponse.json({ message: 'no key to fetch' }, { status: 400 });
}
