import { NextResponse, NextRequest } from 'next/server';
import { getKey } from '@/util/cronFile/keyStore';
import getStockMarketValueRankList from '@features/Global/http_client/gettingList/getStockMarketValueRankList';

export async function GET(req: NextRequest) {
  const key = getKey();
  if (key) {
    const response = await getStockMarketValueRankList();

    if (response?.message !== 'good') {
      return NextResponse.json({ message: response.message || 'error' }, { status: 400 });
    }
    return NextResponse.json(response);
  }

  return NextResponse.json({ message: 'no key to fetch' }, { status: 400 });
}
