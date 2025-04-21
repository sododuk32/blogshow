import { NextResponse } from 'next/server';
import { getKey } from '@/util/cronFile/keyStore';
import { NextApiRequest, NextApiResponse } from 'next';
import getStockAmountRankList from '@handler/http/gettingList/getStockAmountRankList';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const key = getKey();
  if (key) {
    const result = await getStockAmountRankList();
    return NextResponse.json({ result });
  }

  return res.status(400).json({ message: 'no key to fetch' });
}
