import safeFetch from '../auth/safeFetch';
import { HantHeadersMarketRank } from '@util/types/HTHeaderType';
import { getKey } from '@util/cronFile/keyStore';
import { FetchResult } from '@util/types/ErrorTypes';
import { StockListInfoResOutput } from '@util/types/StockListInfoRes';
import { Console } from 'console';

/**
 * 거래량 순위
 * @param mode
 * @returns
 */
export default async function getStockAmountRankList() {
  // 널 가드
  const key = getKey();
  const baseUrl: string | undefined = process.env.HantBaseRealUrl;
  if (!key.data) {
    throw new Error('키 데이터가 없습니다');
  }
  const token = key.data[2].value;

  const queryParams = {
    FID_COND_MRKT_DIV_CODE: 'J',
    FID_COND_SCR_DIV_CODE: '20171',
    FID_INPUT_ISCD: '0000',
    FID_DIV_CLS_CODE: '0',
    FID_BLNG_CLS_CODE: '0',
    FID_TRGT_CLS_CODE: '111111111',
    FID_TRGT_EXLS_CLS_CODE: '0000000000',
    // FID_INPUT_PRICE_1: '""',
    // FID_INPUT_PRICE_2: '""',
    // FID_VOL_CNT: '""',
    // FID_INPUT_DATE_1: '""',
  };

  const headers: HantHeadersMarketRank = {
    authorization: `Bearer ${token}`,
    appkey: process.env.HanTKey || '',
    appsecret: process.env.HanTSecret || '',
    tr_id: 'FHPST01710000',
    custtype: 'P',
    'content-type': 'application/json',
  };

  const before = `${baseUrl}/uapi/domestic-stock/v1/quotations/volume-rank`;

  const after = new URL(before);
  Object.entries(queryParams).forEach(([key, val]) => {
    after.searchParams.set(key, val);
  });

  const rawAppend = [
    'FID_INPUT_PRICE_1=""',
    'FID_INPUT_PRICE_2=""',
    'FID_VOL_CNT=""',
    'FID_INPUT_DATE_1=""',
  ].join('&');

  const finalUrl = `${after.toString()}&${rawAppend}`;

  const results = await safeFetch<StockListInfoResOutput>(finalUrl, 'GET', null, headers);

  if (results.error) {
    return { data: [], message: `${results.error.status}`, status: results.error.status };
  }
  const { output } = results.data;

  return {
    data: output,
    message: `good`,
    status: 200,
  };
}
