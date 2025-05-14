import { NextResponse, NextRequest } from 'next/server';
import { getKey } from '@/util/cronFile/keyStore';
import getFlucTuationRank from '@features/Global/http_client/gettingList/getFlucTuationRank';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const key = getKey();

  if (key) {
    const response = await getFlucTuationRank(params?.id || '0');

    if (response?.message !== 'good') {
      return NextResponse.json({ message: response.message || 'error' }, { status: 400 });
    }
    return NextResponse.json(response);
  }

  return NextResponse.json({ message: 'no key to fetch' }, { status: 400 });
}
