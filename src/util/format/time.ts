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

/**
 * pubDate 문자열을 받아서
 * • 일 전 (7일 미만)
 * • 주 전 (28일 미만)
 * • 개월 전 (365일 미만)
 * • 년 전
 * 으로 리턴하는 함수
 */
export function formatRelativeDate(pubDate: string): string {
  const now = new Date();
  const past = new Date(pubDate);
  const diffMs = now.getTime() - past.getTime();

  if (diffMs < 0) {
    return '오늘'; // 미래 시점 처리
  }

  /** 일별 시간값 */
  const msPerDay = 1000 * 60 * 60 * 24;
  const msPerWeek = msPerDay * 7;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  if (diffMs < msPerWeek) {
    const days = Math.floor(diffMs / msPerDay) || 1;
    return `${days}일 전`;
  }

  if (diffMs < msPerMonth * 1) {
    const weeks = Math.floor(diffMs / msPerWeek);
    return `${weeks}주 전`;
  }

  if (diffMs < msPerYear) {
    const months = Math.floor(diffMs / msPerMonth);
    return `${months}개월 전`;
  }

  const years = Math.floor(diffMs / msPerYear);
  return `${years}년 전`;
}
