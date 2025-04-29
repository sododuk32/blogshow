export default function numberToWon(value: string) {
  const num = Number(value) * 1000;

  if (isNaN(num)) return '-';

  if (num >= 1000000000000) {
    return Math.floor(num / 1000000000000) + ' 조';
  } else if (num >= 100000000) {
    return Math.floor(num / 100000000) + ' 억';
  } else if (num >= 10000000) {
    return Math.floor(num / 10000000) + ' 천만';
  } else if (num >= 10000) {
    return Math.floor(num / 10000) + ' 만';
  } else {
    return num.toString();
  }
}

export function numberToWonTotal(value: string) {
  const num = Number(value) * 1000;
  if (isNaN(num)) return '-';

  // 소수점 첫째 자리까지 '내림' 한 값을 반환하는 헬퍼
  const floor1 = (n: number) => (Math.floor(n * 10) / 10).toFixed(1);

  if (num >= 1e12) {
    // 조 단위 (1조 = 1e12)
    return `${floor1(num / 1e12)} 조`;
  } else if (num >= 1e8) {
    // 억 단위 (1억 = 1e8)
    return `${floor1(num / 1e8)} 억`;
  } else if (num >= 1e4) {
    // 만 단위 (1만 = 1e4)
    return `${floor1(num / 1e4)} 만`;
  } else {
    return num.toString();
  }
}
