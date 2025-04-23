/* eslint-disable @typescript-eslint/no-explicit-any */
import safeFetch from '../auth/safeFetch';
import { StockListInfoResOutput, StockResOutput, mainMenuData } from '@util/types/StockListInfoRes';
import { FetchResult } from '@util/types/ErrorTypes';

export default async function getMainListData(menu: string | null): Promise<StockResOutput> {
  const url = (() => {
    switch (menu) {
      case '거래량':
        return '/api/fetchList/amountRank';
      case '급상승':
        return '/api/fetchList/FlucTuation/1';
      case '급하락':
        return '/api/fetchList/FlucTuation/2';
      case '시가총액':
        return '/api/fetchList/marketValue';
      case '대량체결건수':
        return '/api/fetchList/bulkTransRank';
      default:
        return '/api/fetchList/amountBank';
    }
  })();

  const results = await safeFetch<StockListInfoResOutput>(url, 'GET', null, null);

  if (results.error) {
    // 여기서 에러를 던져야 useQuery가 isError/error 로 캐치
    const { status, message } = results.error;
    throw new Error(`Fetch failed${status ? ` (${status})` : ''}: ${message}`);
  }

  const raw = results.data!;

  const data = raw.data?.map((props) => {
    return {
      data_rank: props.data_rank,
      hts_kor_isnm: props.hts_kor_isnm,
      stck_prpr: props.stck_prpr,
      prdy_vrss_sign: props.prdy_vrss_sign,
      prdy_vrss: props.prdy_vrss,
      prdy_ctrt: props.prdy_ctrt,
      acml_vol: props.acml_vol,
    };
  });

  console.log(data);
  return {
    data: data,
    rt_cd: raw.rt_cd,
    msg_cd: raw.msg_cd,
    msg1: raw.msg1,
  };
}
