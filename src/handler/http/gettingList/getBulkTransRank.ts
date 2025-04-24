import safeFetch from '../auth/safeFetch';
import { HantHeadersMarketRank } from '@util/types/HTHeaderType';
import { getKey } from '@util/cronFile/keyStore';
import { StockListInfoResOutput } from '@util/types/StockListInfoRes';

/**
 * 대량체결건수 순위
 * @param mode
 * @returns
 */
export default async function getBulkTransRank() {
  const key = getKey();
  const baseUrl: string | undefined = process.env.HantBaseRealUrl;

  if (!key.data) {
    throw new Error('키 데이터가 없습니다');
  }

  const token = key.data[2].value;

  // URL 생성
  const url = new URL(`${baseUrl}/uapi/domestic-stock/v1/ranking/bulk-trans-num`);

  // 🔹 key=value 형태로 들어가야 하는 필드
  const baseParams: Record<string, string> = {
    fid_cond_mrkt_div_code: 'J',
    fid_cond_scr_div_code: '11909',
    fid_input_iscd: '0001',
    fid_div_cls_code: '0',
    fid_rank_sort_cls_code: '0',
    fid_trgt_cls_code: '0',
    fid_trgt_exls_cls_code: '0',
  };

  Object.entries(baseParams).forEach(([key, val]) => {
    url.searchParams.set(key, val);
  });

  // 🔸 "" (쌍따옴표 포함 문자열)로 보내야 하는 필드
  const quotedParams: Record<string, string> = {
    fid_aply_rang_prc_1: '""',
    fid_aply_rang_prc_2: '""',
    fid_vol_cnt: '""',
  };

  Object.entries(quotedParams).forEach(([key, val]) => {
    url.searchParams.set(key, val);
  });

  // 🔹 빈값(key=) 으로 보내야 하는 필드
  url.searchParams.set('fid_input_price_1', '');
  url.searchParams.set('fid_input_iscd_2', '');

  const headers: HantHeadersMarketRank = {
    authorization: `Bearer ${token}`,
    appkey: process.env.HanTKey || '',
    appsecret: process.env.HanTSecret || '',
    tr_id: 'FHKST190900C0',
    custtype: 'P',
    'content-type': 'application/json',
  };

  const results = await safeFetch<StockListInfoResOutput>(url.toString(), 'GET', null, headers);

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
