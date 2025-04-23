import { NextResponse } from 'next/server';
import { getKey } from '@/util/cronFile/keyStore';
import { NextApiRequest, NextApiResponse } from 'next';
import getStockMarketValueRankList from '@handler/http/gettingList/getStockMarketValueRankList';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const key = getKey();
  if (key) {
    const response = await getStockMarketValueRankList();

    if (response?.message !== 'good') {
      return res.status(400).json({ message: response.message || 'error' });
    }
    return NextResponse.json(response);
  }

  return res.status(400).json({ message: 'no key to fetch' });
}
