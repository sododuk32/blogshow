/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import useNumberBlink from '@features/MainPage/hook/useNumberBlink';
import { blinkStyles, fitContentCell } from './Tablecell.css';
import { cellStyleItem } from './index.css';

interface TableCellsProps {
  children?: ReactNode;
  styleString?: string;
  info?: { row?: { original?: Record<string, any> } };
  innerTexts?: string | null;
  alignments?: 'left' | 'right' | 'middle' | null;
}

export default function TableCells({
  children,
  styleString,
  info,
  innerTexts,
  alignments,
}: TableCellsProps) {
  const code = info?.row?.original?.mksc_shrn_iscd ?? info?.row?.original?.stck_shrn_iscd;

  // 숫자 변화 감지 훅
  const { blink } = useNumberBlink(innerTexts);

  const variantClass = blinkStyles({
    blink: blink ?? undefined,
    alignments: alignments ?? undefined,
  });
  const innerTextStyle = clsx(variantClass, fitContentCell);
  const className = clsx(styleString, cellStyleItem);

  const cell = (
    <div className={className}>
      <div className={innerTextStyle}>{innerTexts}</div>
    </div>
  );

  const noTextCell = <div className={className}>{children}</div>;
  const content = innerTexts ? cell : noTextCell;

  return code ? (
    <Link href={`/stocks/${code}`} id={`/stocks/${code}`}>
      {content}
    </Link>
  ) : (
    <>{content}</>
  );
}
