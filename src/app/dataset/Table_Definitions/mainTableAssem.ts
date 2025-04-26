// tableConfig.ts
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { MainMenuAlltype, KeyofMainMenu } from '@util/types/StockListInfoRes';

// 🛠️ union 타입 전체를 한 번에 커버하는 헬퍼
//    (각 카테고리별 프로퍼티도 union에 포함되면 접근은 가능하지만,
//     없는 경우엔 undefined가 리턴될 수 있습니다)
const helper = createColumnHelper<MainMenuAlltype<KeyofMainMenu>>();

// 공통 컬럼 정의
const common: ColumnDef<MainMenuAlltype<KeyofMainMenu>, string>[] = [
  helper.accessor('data_rank', { header: '순위', cell: (i) => i.getValue() }),
  helper.accessor('hts_kor_isnm', { header: '종목명', cell: (i) => i.getValue() }),
  helper.accessor('stck_prpr', { header: '현재가', cell: (i) => i.getValue() }),
  helper.accessor('prdy_ctrt', { header: '등락(%)', cell: (i) => i.getValue() }),
  helper.accessor('acml_vol', { header: '누적거래량', cell: (i) => i.getValue() }),
];

// 카테고리별 추가 컬럼 매핑
export const columnsMap: Record<
  KeyofMainMenu,
  ColumnDef<MainMenuAlltype<KeyofMainMenu>, string>[]
> = {
  거래량: [
    ...common,
    helper.accessor('vol_inrt', { header: '거래량증가율', cell: (i) => i.getValue() }),
    helper.accessor('vol_tnrt', { header: '거래량회전율', cell: (i) => i.getValue() }),
    helper.accessor('acml_tr_pbmn', { header: '누적거래대금', cell: (i) => i.getValue() }),
    helper.accessor('avrg_vol', { header: '평균거래량', cell: (i) => i.getValue() }),
  ],
  시가총액: [
    ...common,
    helper.accessor('stck_avls', { header: '시가총액', cell: (i) => i.getValue() }),
  ],
  급상승: [
    ...common,
    helper.accessor('prd_rsfl', { header: '절대등락수치', cell: (i) => i.getValue() }),
    helper.accessor('prd_rsfl_rate', { header: '등락비율(%)', cell: (i) => i.getValue() }),
  ],
  급하락: [
    ...common,
    helper.accessor('prd_rsfl', { header: '절대등락수치', cell: (i) => i.getValue() }),
    helper.accessor('prd_rsfl_rate', { header: '등락비율(%)', cell: (i) => i.getValue() }),
  ],
  대량체결건수: [
    ...common,
    helper.accessor('shnu_cntg_csnu', { header: '대량매수건수', cell: (i) => i.getValue() }),
    helper.accessor('seln_cntg_csnu', { header: '대량매도건수', cell: (i) => i.getValue() }),
  ],
};
