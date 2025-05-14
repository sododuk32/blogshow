import safeFetch from '../safeFetch';
import { chartData, CurrentDetailData } from '@util/types/charts/TData';

export default async function getStockDetail(
  code: string
): Promise<{ array: chartData[]; nameof: CurrentDetailData }> {
  const isBrowser = typeof window !== 'undefined';
  const base = isBrowser ? '' : (process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000');
  try {
    const response = await safeFetch<{ bars: chartData[]; nameof: CurrentDetailData }>(
      `${base}/api/testing/${code}`,
      'GET',
      null,
      {
        cache: 'no-store',
      }
    );
    if (!response.data) {
      return baseInfo;
    }

    const result = response.data.bars
      .slice()
      .sort((a, b) => a.time - b.time)
      .filter((bar, idx, arr) => idx === 0 || bar.time > arr[idx - 1].time);

    return { array: result, nameof: response.data.nameof };
  } catch (error) {
    console.log(error);
    return baseInfo;
  }
}

const baseInfo = {
  array: [],
  nameof: {
    hts_kor_isnm: 'string',
    acml_vol: 'string',
    stck_prpr: 'string',
    acml_tr_pbmn: 'string',
    stck_prdy_clpr: 'string',
    prdy_ctrt: 'string',
    prdy_vrss_sign: 'string',
    prdy_vrss: 'string',
  },
};
