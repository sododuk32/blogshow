/* eslint-disable @typescript-eslint/no-unused-vars */
const stockKeys: string[] = [
  'hts_kor_isnm',
  'mksc_shrn_iscd',
  'data_rank',
  'stck_prpr',
  'prdy_vrss_sign',
  'prdy_vrss',
  'prdy_ctrt',
  'acml_vol',
  'prdy_vol',
  'lstn_stcn',
  'avrg_vol',
  'n_befr_clpr_vrss_prpr_rate',
  'vol_inrt',
  'vol_tnrt',
  'nday_vol_tnrt',
  'avrg_tr_pbmn',
  'tr_pbmn_tnrt',
  'nday_tr_pbmn_tnrt',
  'acml_tr_pbmn',
] as const;

// Record를 써서 모든 필드를 string으로 매핑
export type StockListInfoRes = Record<(typeof stockKeys)[number], string>;

export type StockListInfoResOutput = {
  result: {
    output: Record<(typeof stockKeys)[number], string>[];
    rt_cd: string;
    msg_cd: string;
    msg1: string;
  };
};
