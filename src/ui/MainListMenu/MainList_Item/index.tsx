import React from 'react';
import { cellStyleItem } from './index.css';

function TableCells({
  children,
  styleString,
}: {
  children: React.ReactNode;
  styleString?: string | null;
}) {
  return (
    <div className={`${cellStyleItem} ${styleString ? ` ${styleString}` : ''}`}>{children}</div>
  );
}

export default TableCells;
