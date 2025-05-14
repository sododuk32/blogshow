/* eslint-disable @typescript-eslint/no-explicit-any */
// /pages/api/hantoo/intraday-5min.ts
import { NextRequest, NextResponse } from 'next/server';
import { getKey } from '@util/cronFile/keyStore';
import { KeyPackage } from '@util/types/Hant/authWithHantoo';
import { guardKeyPackege } from '@util/typeguard/keyGuard';
import { getKSTDateTime } from '@util/format/getKst';

type Bar = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export async function GET(req: NextRequest, { params }: { params: { symbol: string } }) {
  const symbol = String(params?.symbol || '');

  try {
    const result = getKey();
    guardKeyPackege(result.data, 2);

    const bearer = result.data[2].value;
    const hashi = result.data[0].value;

    const url = new URL(
      'https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/quotations/inquire-time-dailychartprice'
    );

    const { inqrDate, inqrHour } = getKSTDateTime();

    url.searchParams.set('FID_COND_MRKT_DIV_CODE', 'J'); // KRX 주식
    url.searchParams.set('FID_INPUT_ISCD', symbol); // ex) "252670"
    url.searchParams.set('FID_INPUT_DATE_1', inqrDate); // HHMMSS 기준 시각
    url.searchParams.set('FID_INPUT_HOUR_1', inqrHour); // HHMMSS 기준 시각
    url.searchParams.set('FID_PW_DATA_INCU_YN', '""');
    url.searchParams.set('FID_FAKE_TICK_INCU_YN', '""');

    // url.searchParams.set('FID_CONT_LIST_MRKT_DIV_CODE', '20');

    const heads = {
      appkey: process.env.HanTKey || '',
      appsecret: process.env.HanTSecret || '',
      authorization: `Bearer ${bearer}`,
      'Content-Type': 'application/json',
      hashkey: hashi,
      custtype: 'P',
      tr_id: 'FHKST03010230',
      'Cache-Control': 'no-store',
    };

    console.log('server testing');
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: heads,
    });

    if (!response.ok) {
      const json = await response.json();
      throw new Error(`HTTP ${response.status}:`);
    }

    const json = await response.json();
    // 한투 OpenAPI는 output2 배열 안에 데이터가 들어있다고 가정

    const raw = json.output2 as any[];
    const raw2 = json.output1 as any;

    const bars: Bar[] = raw.map((item) => {
      const [yyyy, MM, dd] = item.stck_bsop_date.match(/(\d{4})(\d{2})(\d{2})/)!.slice(1);
      const hh = item.stck_cntg_hour.slice(0, 2);
      const mi = item.stck_cntg_hour.slice(2, 4);
      const ss = item.stck_cntg_hour.slice(4, 6);

      const ts = Date.UTC(
        +yyyy, // 년
        +MM - 1, // 월 (0-11)
        +dd, // 일
        +hh - 9, // UTC 로 맞추기(=KST−9h)
        +mi,
        +ss
      );
      return {
        time: ts / 1000,
        open: +item.stck_oprc,
        high: +item.stck_hgpr,
        low: +item.stck_lwpr,
        close: +item.stck_prpr,
        volume: +item.cntg_vol,
      };
    });

    return NextResponse.json({ bars, nameof: raw2 });
  } catch (err: any) {
    console.error(err);
    console.log('server testing');

    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
