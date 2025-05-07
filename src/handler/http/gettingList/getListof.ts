/* eslint-disable @typescript-eslint/no-explicit-any */
import safeFetch from '../safeFetch';
import {
  StockListInfoResOutput,
  StockResOutput,
  KeyofMainMenu,
  MainMenuAlltype,
  mainMenuDataExtra,
} from '@util/types/Hant/StockListInfoRes';

export default async function getMainListData<T extends KeyofMainMenu>(
  menu: T
): Promise<MainMenuAlltype<T>[]> {
  const url = (() => {
    switch (menu) {
      case '거래량':
        return '/api/fetchList/amountRank';
      case '급상승':
        return '/api/fetchList/FlucTuation/0';
      case '급하락':
        return '/api/fetchList/FlucTuation/1';
      case '시가총액':
        return '/api/fetchList/marketValue';
      case '대량체결건수':
        return '/api/fetchList/bulkTransRank';
      default:
        return '/api/fetchList/amountBank';
    }
  })();

  const { data: raw, error } = await safeFetch<StockListInfoResOutput<T>>(url, 'GET', null, null);

  if (error) {
    // 여기서 에러를 던져야 useQuery가 isError/error 로 캐치
    const { status, message } = error;
    throw new Error(`Fetch failed${status ? ` (${status})` : ''}: ${message}`);
  }
  const mapper = extraMappers[menu] as (p: any) => mainMenuDataExtra[T];

  const mapped: MainMenuAlltype<T>[] = raw.data.slice(0, 15).map((props) => ({
    data_rank: props.data_rank,
    hts_kor_isnm: props.hts_kor_isnm,
    stck_prpr: props.stck_prpr,
    prdy_vrss_sign: props.prdy_vrss_sign,
    prdy_vrss: props.prdy_vrss,
    prdy_ctrt: props.prdy_ctrt,
    acml_vol: props.acml_vol,
    mksc_shrn_iscd: props?.mksc_shrn_iscd,
    stck_shrn_iscd: props?.stck_shrn_iscd,
    ...mapper(props), // T별 추가 필드 병합
  }));
  return mapped;
}

const extraMappers: {
  [K in KeyofMainMenu]: (props: any) => mainMenuDataExtra[K];
} = {
  거래량: (props) => ({
    vol_inrt: props.vol_inrt,
    vol_tnrt: props.vol_tnrt,
    acml_tr_pbmn: props.acml_tr_pbmn,
    avrg_vol: props.avrg_vol,
  }),
  시가총액: (props) => ({ stck_avls: props.stck_avls }),
  급상승: (props) => ({
    prd_rsfl: props.prd_rsfl,
    prd_rsfl_rate: props.prd_rsfl_rate,
  }),
  급하락: (props) => ({
    prd_rsfl: props.prd_rsfl,
    prd_rsfl_rate: props.prd_rsfl_rate,
  }),
  대량체결건수: (props) => ({
    shnu_cntg_csnu: props.shnu_cntg_csnu,
    seln_cntg_csnu: props.seln_cntg_csnu,
  }),
};
