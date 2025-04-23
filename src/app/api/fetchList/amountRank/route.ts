import { NextResponse } from 'next/server';
import { getKey } from '@/util/cronFile/keyStore';
import { NextApiRequest, NextApiResponse } from 'next';
import getStockAmountRankList from '@handler/http/gettingList/getStockAmountRankList';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const key = getKey();
  if (key) {
    const response = await getStockAmountRankList();

    if (response?.message !== 'good') {
      return res.status(400).json({ message: response.message || 'error' });
    }
    return NextResponse.json(response);
  }

  return res.status(400).json({ message: 'no key to fetch' });
}
