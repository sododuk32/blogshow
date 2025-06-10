import { UTCTimestamp } from 'lightweight-charts';

export type chartData = {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type CurrentDetailData = {
  hts_kor_isnm: string;
  acml_vol: string;
  stck_prpr: string;
  acml_tr_pbmn: string;
  stck_prdy_clpr: string;
  prdy_ctrt: string;
  prdy_vrss_sign: string;
  prdy_vrss: string;
};
export interface SubscriptionPaper {
  meta: {
    type: string;
    topic: string;
    detail: string;
    isStock?: boolean;
  };
}
export interface IntradayChartProps {
  staticData?: chartData[];
  code: string;
  stockName: string;
}
