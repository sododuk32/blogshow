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
