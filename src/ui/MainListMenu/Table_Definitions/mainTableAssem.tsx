// tableConfig.ts
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { MainMenuAlltype, KeyofMainMenu } from '@util/types/StockListInfoRes';
import TableCells from '@ui/MainListMenu/MainList_Item';
import { headerBlue, cellBlue, cellRed } from '../MainList_Table/index.css';
import numberToWon from '@util/format/numberToWon';

const helper = createColumnHelper<MainMenuAlltype<KeyofMainMenu>>();
// common 의 타입 = DisplayColumnDef<TData, TValue> | GroupColumnDef<TData, TValue> | AccessorColumnDef<TData, TValue>; 참고

// 공통 컬럼 정의

const common = [
  helper.accessor('data_rank', {
    header: '순위',
    cell: (i) => <TableCells>{i.getValue()} 위</TableCells>,
  }),
  helper.accessor('hts_kor_isnm', {
    header: '종목명',
    cell: (i) => <TableCells>{i.getValue()}</TableCells>,
  }),
  helper.accessor('stck_prpr', {
    header: '현재가',
    cell: (i) => <TableCells>{i.getValue()} 원</TableCells>,
  }),
];

// 카테고리별 추가 컬럼 매핑
export const columnsMap: Record<KeyofMainMenu, ColumnDef<MainMenuAlltype<KeyofMainMenu>, never>[]> =
  {
    거래량: [
      ...common,
      helper.accessor('vol_inrt', {
        header: '거래량증가율',
        cell: (i) => (
          <TableCells styleString={Math.sign(Number(i.getValue())) > 0 ? cellRed : cellBlue}>
            {i.getValue()}%
          </TableCells>
        ),
      }),

      helper.accessor('prdy_ctrt', {
        header: '등락(%)',
        cell: (i) => (
          <TableCells styleString={Math.sign(Number(i.getValue())) > 0 ? cellRed : cellBlue}>
            {i.getValue()}%
          </TableCells>
        ),
      }),
      helper.accessor('acml_vol', {
        header: () => <TableCells styleString={headerBlue}>누적거래량</TableCells>,
        cell: (i) => <TableCells>{numberToWon(i.getValue())}</TableCells>,
      }),
    ],
    시가총액: [
      ...common,
      helper.accessor('stck_avls', {
        header: () => <TableCells styleString={headerBlue}>시가총액</TableCells>,

        cell: (i) => <TableCells>{numberToWon(i.getValue())}</TableCells>,
      }),
    ],
    급상승: [
      ...common,

      helper.accessor('prd_rsfl_rate', {
        header: () => <TableCells styleString={headerBlue}>등락비율(%)</TableCells>,

        cell: (i) => (
          <TableCells styleString={Math.sign(Number(i.getValue())) > 0 ? cellRed : cellBlue}>
            {i.getValue()}%
          </TableCells>
        ),
      }),
    ],
    급하락: [
      ...common,
      helper.accessor('prd_rsfl_rate', {
        header: () => <TableCells styleString={headerBlue}>등락비율(%)</TableCells>,

        cell: (i) => (
          <TableCells styleString={Math.sign(Number(i.getValue())) > 0 ? cellRed : cellBlue}>
            {i.getValue()}%
          </TableCells>
        ),
      }),
    ],
    대량체결건수: [
      ...common,
      helper.accessor('shnu_cntg_csnu', {
        header: '대량매수건수',
        cell: (i) => <TableCells>{i.getValue()} 건</TableCells>,
      }),
      helper.accessor('seln_cntg_csnu', {
        header: () => <TableCells styleString={headerBlue}>대량매도건수</TableCells>,
        cell: (i) => <TableCells>{i.getValue()} 건</TableCells>,
      }),
    ],
  };

// 급상승 급하락에
// helper.accessor('prd_rsfl', {
//   header: '절대등락수치',
//   cell: (i) => <TableCells>{i.getValue()}</TableCells>,
// }),
// 제거함.

// 거래량에
// helper.accessor('vol_tnrt', { header: '거래량회전율', cell: (i) => i.getValue() }),
// helper.accessor('acml_tr_pbmn', { header: '누적거래대금', cell: (i) => i.getValue() }),
// helper.accessor('avrg_vol', { header: '평균거래량', cell: (i) => i.getValue() }),
// 제거함
