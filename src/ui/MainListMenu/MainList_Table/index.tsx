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

  if (!data || isLoadings) {
    return (
      <div>
        <BarLoader color="#000000" loading aria-label="Loading Spinner" data-testid="loader" />
      </div>
    );
  }
  return (
    <div>
      <h2>{category}</h2>
      <table className={tableStyle}>
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
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className={cellStyle}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
