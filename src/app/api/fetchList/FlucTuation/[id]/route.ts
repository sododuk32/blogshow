import { NextResponse } from 'next/server';
import { getKey } from '@/util/cronFile/keyStore';
import { NextApiRequest, NextApiResponse } from 'next';
import getFlucTuationRank from '@/handler/http/gettingList/getFlucTuationRank';

export async function GET(
  req: NextApiRequest,
  { params }: { params: { id: string } },
  res: NextApiResponse
) {
  const key = getKey();

  if (key) {
    const response = await getFlucTuationRank(params?.id || '1');

    if (response?.message !== 'good') {
      return res.status(400).json({ message: response.message || 'error' });
    }
    return NextResponse.json(response);
  }

  return res.status(400).json({ message: 'no key to fetch' });
}
