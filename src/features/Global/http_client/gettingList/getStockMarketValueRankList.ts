import safeFetch from '../safeFetch';
import { HantHeadersMarketRank } from '@util/types/Hant/HTHeaderType';
import { getKey } from '@util/cronFile/keyStore';
import { StockListInfoRes } from '@util/types/Hant/StockListInfoRes';

/**
 * 시가총액 순위
 * @param mode
 * @returns
 */

export default async function getStockMarketValueRankList() {
  const key = getKey();
  const baseUrl: string | undefined = process.env.HantBaseRealUrl;

  if (!key.data) {
    throw new Error('키 데이터가 없습니다');
  }

  const token = key.data[2].value;

  // 실제 API 명세에 따른 쿼리스트링 구성 (정렬 포함)
  const baseParams: Record<string, string> = {
    fid_blng_cls_code: '0',
    fid_cond_mrkt_div_code: 'J',
    fid_cond_scr_div_code: '20174',
    fid_div_cls_code: '0',
    fid_input_iscd: '0001',
    fid_input_option_1: '2023',
    fid_input_option_2: '3',
    fid_rank_sort_cls_code: '23',
    fid_trgt_cls_code: '0',
    fid_trgt_exls_cls_code: '0',
  };

  const after = new URL(`${baseUrl}/uapi/domestic-stock/v1/ranking/market-cap`);
  Object.entries(baseParams).forEach(([key, val]) => {
    after.searchParams.set(key, val);
  });

  // "" 쿼리 문자열은 수동 추가
  const manualAppend = ['fid_input_price_1=""', 'fid_input_price_2=""', 'fid_vol_cnt=""'].join('&');

  const finalUrl = `${after.toString()}&${manualAppend}`;

  const headers: HantHeadersMarketRank = {
    authorization: `Bearer ${token}`,
    appkey: process.env.HanTKey || '',
    appsecret: process.env.HanTSecret || '',
    tr_id: 'FHPST01740000',
    custtype: 'P',
    'content-type': 'application/json',
    'Cache-Control': 'revalidate: 0',
  };

  const { data, error } = await safeFetch<StockListInfoRes>(finalUrl, 'GET', null, headers);

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
