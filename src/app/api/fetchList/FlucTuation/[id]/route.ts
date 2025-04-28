import { NextResponse, NextRequest } from 'next/server';
import { getKey } from '@/util/cronFile/keyStore';
import getFlucTuationRank from '@/handler/http/gettingList/getFlucTuationRank';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const key = getKey();

  if (key) {
    const response = await getFlucTuationRank(params?.id || '1');

    if (response?.message !== 'good') {
      return NextResponse.json({ message: response.message || 'error' }, { status: 400 });
    }
    console.log(response.data);
    return NextResponse.json(response);
  }

  return NextResponse.json({ message: 'no key to fetch' }, { status: 400 });
}
