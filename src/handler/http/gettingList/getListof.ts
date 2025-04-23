/* eslint-disable @typescript-eslint/no-explicit-any */
import safeFetch from '../auth/safeFetch';
import { StockListInfoResOutput, StockResOutput, mainMenuData } from '@util/types/StockListInfoRes';
import { FetchResult } from '@util/types/ErrorTypes';

export default async function getMainListData(menu: string | null): Promise<StockResOutput> {
  let results: FetchResult<StockListInfoResOutput>;

  switch (menu) {
    case '거래량':
      results = await safeFetch('/api/fetchList/amountRank', 'GET', null, null);
      break;
    case '급상승':
      results = await safeFetch('/api/fetchList/FlucTuation/1', 'GET', null, null);
      break;
    case '급하락':
      results = await safeFetch('/api/fetchList/FlucTuation/2', 'GET', null, null);
      break;
    case '시가총액':
      results = await safeFetch('/api/fetchList/marketValue', 'GET', null, null);
      break;
    case '대량체결건수':
      results = await safeFetch('/api/fetchList/bulkTransRank', 'GET', null, null);
      break;

    default:
      results = await safeFetch('/api/fetchList/amountBank', 'GET', null, null);
  }
  if (results.error) {
    // 여기서 에러를 던져야 useQuery가 isError/error 분기로 잡아줍니다
    const { status, message } = results.error;
    throw new Error(`Fetch failed${status ? ` (${status})` : ''}: ${message}`);
  }

  const rere: any = results.data;
  console.log(rere);

  const mapped = rere.data.map((props: mainMenuData) => ({
    data_rank: props.data_rank,
    hts_kor_isnm: props.hts_kor_isnm,
    stck_prpr: props.stck_prpr,
    prdy_vrss_sign: props.prdy_vrss_sign,
    prdy_vrss: props.prdy_vrss,
    prdy_ctrt: props.prdy_ctrt,
    acml_vol: props.acml_vol,
  }));
  console.log(mapped);

  return mapped;
}
