'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

export type BlinkState = 'increase' | 'decrease' | null;

export default function useNumberBlink(text?: string | null): {
  numeric: number | null;
  blink: BlinkState;
} {
  // 1) text → 숫자 파싱
  const numeric = useMemo<number | null>(() => {
    if (!text) return null;
    const cleaned = text.replace(/[^0-9.\-]/g, '');
    const n = parseFloat(cleaned);
    return isNaN(n) ? null : n;
  }, [text]);

  // 2) 이전 숫자 보관용 ref
  const prevRef = useRef<number | null>(null);
  // 3) blink 상태
  const [blink, setBlink] = useState<BlinkState>(null);

  // 4) numeric이 바뀔 때마다 이전 값과 비교
  useEffect(() => {
    const prev = prevRef.current;
    const curr = numeric;
    if (prev !== null && curr !== null && curr !== prev) {
      setBlink(curr > prev ? 'increase' : 'decrease');
      const timer = setTimeout(() => setBlink(null), 900);
      return () => clearTimeout(timer);
    }
    prevRef.current = curr;
  }, [numeric]);

  return { numeric, blink };
}
