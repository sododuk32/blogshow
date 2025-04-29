/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from '@tanstack/react-table';
import { BarLoader } from 'react-spinners';
import { tableStyle, cellStyle } from './index.css';

interface MainListTableProps<T> {
  category?: string | null;
  columns: any;
  data: T[]; // ← 여기는 T[]
  isLoadings: boolean;
}

export default function MainList_Table<T>({
  category = '거래량',
  columns,
  data,
  isLoadings,
}: MainListTableProps<T>): JSX.Element {
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  if (!data && isLoadings) {
    return (
      <div>
        {/* 초기로드를 위한 스켈레톤으로 대체 해야함. */}
        <BarLoader color="#000000" loading aria-label="Loading Spinner" data-testid="loader" />
      </div>
    );
  }
  return (
    <div>
      <table className={tableStyle}>
        <colgroup>
          {table.getHeaderGroups()[0].headers.map((header) => {
            const isRank = header.column.id === 'data_rank';
            const isName = header.column.id === 'hts_kor_isnm';
            const widthVal = isRank ? '40px' : isName ? '40%' : undefined;
            return (
              <col
                key={header.id}
                style={{
                  width: widthVal,
                }}
              />
            );
          })}
        </colgroup>
        {/* 이하 테이블 헤드 */}

        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan} className={cellStyle}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        {/* 이하 테이블 바디 hts_kor_isnm */}
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={(row.original as any)?.hts_kor_isnm ?? row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={cellStyle}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
