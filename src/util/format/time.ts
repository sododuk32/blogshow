import { UTCTimestamp } from 'lightweight-charts';

export function timeToKo(time: Date): string {
  const month = time.getMonth();
  const day = time.getDate();
  const min = time.getMinutes();
  const hours = time.getHours();

  return `현재 ${month}월 ${day}일 ${hours}시 ${min}분`;
}

/**
 * HHmmss 숫자를 오늘 날짜의 UTCTimestamp(초)로 변환
 */
export function hhmmssToEpochSeconds(hhmmss: number): UTCTimestamp {
  const hours = Math.floor(hhmmss / 10000);
  const minutes = Math.floor((hhmmss % 10000) / 100);
  const seconds = hhmmss % 100;

  // 브라우저 로컬 타임존(예: Asia/Seoul) 기준으로 “오늘” 생성
  const d = new Date();
  d.setHours(hours, minutes, seconds, 0);

  // 밀리초 → 초
  return Math.floor(d.getTime() / 1000) as UTCTimestamp;
}
