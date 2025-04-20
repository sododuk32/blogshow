import { NextResponse } from 'next/server';
import { getKey } from '@/util/cronFile/keyStore';
import { NextApiRequest, NextApiResponse } from 'next';
import getStockRankList from '@handler/http/gettingList/getStockRankList';

const baseUrl: string | undefined = process.env.HantBaseUrl;

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const key = getKey();
  if (key) {
    const result = await getStockRankList();
    return NextResponse.json({ result });
  }

  return res.status(400).json({ message: 'no key to fetch' });
}
