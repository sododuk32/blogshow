/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { cellStyleItem } from './index.css';
import Link from 'next/link';

function TableCells({
  children,
  styleString,
  info,
}: {
  children: React.ReactNode;
  styleString?: string | null;
  info?: any | null;
}) {
  const code = info?.row?.original?.mksc_shrn_iscd || info?.row?.original?.stck_shrn_iscd;

  const className = `${cellStyleItem}${styleString ? ` ${styleString}` : ''}`;

  if (code) {
    return (
      <Link href={`/stocks/${code}`}>
        <div className={className}>{children}</div>
      </Link>
    );
  }

  return <div className={className}>{children}</div>;
}

export default TableCells;
