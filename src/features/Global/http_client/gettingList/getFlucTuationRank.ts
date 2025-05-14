import safeFetch from '../safeFetch';
import { HantHeadersMarketRank } from '@util/types/Hant/HTHeaderType';
import { getKey } from '@util/cronFile/keyStore';
import { StockListInfoRes } from '@util/types/Hant/StockListInfoRes';

/**
 * 급상승 급하락 순위
 * @param mode
 * @returns
 */
export default async function getFlucTuationRank(mode?: string) {
  const selectedMode = mode || '0';
  const key = getKey();
  const baseUrl: string | undefined = process.env.HantBaseRealUrl;

  if (!key.data) {
    throw new Error('키 데이터가 없습니다');
  }

  const token = key.data[2].value;

  const url = new URL(`${baseUrl}/uapi/domestic-stock/v1/ranking/fluctuation`);

  // 일반 필드
  const baseParams: Record<string, string> = {
    fid_cond_mrkt_div_code: 'J',
    fid_cond_scr_div_code: '20170',
    fid_input_iscd: '0000',
    fid_rank_sort_cls_code: selectedMode,
    fid_input_cnt_1: '0',
    fid_prc_cls_code: '1',
    fid_trgt_cls_code: '0',
    fid_trgt_exls_cls_code: '0',
    fid_div_cls_code: '0',
  };

  Object.entries(baseParams).forEach(([key, val]) => {
    url.searchParams.set(key, val);
  });

  // 쌍따옴표 포함 문자열 `"\"\""` 처리
  const quotedParams: Record<string, string> = {
    fid_input_price_1: '""',
    fid_input_price_2: '""',
    fid_vol_cnt: '""',
    fid_rsfl_rate1: '""',
    fid_rsfl_rate2: '""',
  };

  Object.entries(quotedParams).forEach(([key, val]) => {
    url.searchParams.set(key, val);
  });

  const headers: HantHeadersMarketRank = {
    authorization: `Bearer ${token}`,
    appkey: process.env.HanTKey || '',
    appsecret: process.env.HanTSecret || '',
    tr_id: 'FHPST01700000', // 트랜잭션 ID 확인됨
    custtype: 'P',
    'content-type': 'application/json',
    'Cache-Control': 'revalidate: 0',
  };

  const { data, error } = await safeFetch<StockListInfoRes>(url.toString(), 'GET', null, headers);

  if (error) {
    return { data: [], message: `${error.status}`, status: error.status };
  }
  const { output } = data;

  return {
    data: output,
    message: `good`,
    status: 200,
  };
}
