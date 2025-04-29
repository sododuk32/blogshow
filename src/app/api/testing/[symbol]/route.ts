/* eslint-disable @typescript-eslint/no-explicit-any */
// /pages/api/hantoo/intraday-5min.ts
import { NextRequest, NextResponse } from 'next/server';

type Bar = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export async function GET(req: NextRequest, { params }: { params: { symbol: string } }) {
  console.log(params?.symbol);

  const symbol = String(params?.symbol || '');

  try {
    const url = new URL(
      'https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/quotations/inquire-time-itemchartprice'
    );
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const inqrHour = `${hh}${mm}${ss}`; // ex) "153000"

    url.searchParams.set('FID_COND_MRKT_DIV_CODE', 'J'); // KRX 주식
    url.searchParams.set('FID_INPUT_ISCD', symbol); // ex) "252670"
    url.searchParams.set('FID_INPUT_HOUR_1', inqrHour); // HHMMSS 기준 시각
    url.searchParams.set('FID_PW_DATA_INCU_YN', 'N'); // 당일만
    url.searchParams.set('FID_ETC_CLS_CODE', '0'); // 기본
    url.searchParams.set('FID_CONT_LIST_MRKT_DIV_CODE', '15');

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        appkey: 'PSH9EwA2K43t21Nxm0Zi2QjtcZTWMMnKJjMT',
        appsecret:
          'SXDW0o1z+cxOOOsdXjyGjKSpkH51w56ZTAAmz/yyjg9oHj/ODYkd2INunhIcEyWSkVZmL5HupgvBOLcU7f/mc6Bck9nTgitYD0s3YuIb18h+EMuchWuKonyfsxwbJMNwIZDfTkUQi0rQg9PnG46uxaqBOL5YYmhU3WFKTncUxX0Ztf4BBWA=',
        authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjQ0Yjg0NWQxLWZlYjctNDBiNy05NmYwLWRjMDc0NWFiMDE1YiIsInByZHRfY2QiOiIiLCJpc3MiOiJ1bm9ndyIsImV4cCI6MTc0NTk3ODY5MywiaWF0IjoxNzQ1ODkyMjkzLCJqdGkiOiJQU0g5RXdBMks0M3QyMU54bTBaaTJRanRjWlRXTU1uS0pqTVQifQ.fshKykdIq3giiChCtLT7MD9I0wPhRp1bSWtb6wLjVo_wihYbQeyLRZu4DNcqY0FPgV0tW9yGUvqolbmrEmrYSg`,
        'Content-Type': 'application/json',
        hashkey: '5f8665ec2e056a5dc39dcfcd47d61ec90a08e6121fc52e12c5f0d0ccdf0f3ef9',
        'content-type': 'application/json',
        custtype: 'P',
      },
    });

    console.log(response);
    if (!response.ok) {
      const errText = await response.text();
      console.log(errText);
      throw new Error(`HTTP ${response.status}: ${errText}`);
    }

    const json = await response.json();
    // 한투 OpenAPI는 output1 배열 안에 데이터가 들어있다고 가정
    const raw = json.output1 as any[];

    const bars: Bar[] = raw.map((item) => {
      // HHMMSS → UNIX timestamp (초)
      const hh = item.stck_cntg_hour.slice(0, 2);
      const mm = item.stck_cntg_hour.slice(2, 4);
      const ss = item.stck_cntg_hour.slice(4, 6);
      const d = new Date();
      d.setHours(+hh, +mm, +ss, 0);
      return {
        time: Math.floor(d.getTime() / 1000),
        open: +item.stck_oprc,
        high: +item.stck_hgpr,
        low: +item.stck_lwpr,
        close: +item.stck_clpr,
        volume: +item.cntg_vol,
      };
    });

    return NextResponse.json(bars);
  } catch (err: any) {
    // console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
