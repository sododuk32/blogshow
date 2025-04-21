import { NextResponse } from 'next/server';
import { getKey } from '@/util/cronFile/keyStore';
import { NextApiRequest, NextApiResponse } from 'next';
import getBulkTransRank from '@handler/http/gettingList/getBulkTransRank';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const key = getKey();
  if (key) {
    const result = await getBulkTransRank();
    return NextResponse.json({ result });
  }

  return res.status(400).json({ message: 'no key to fetch' });
}
