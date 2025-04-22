export function timeToKo(time: Date): string {
  const month = time.getMonth();
  const day = time.getDate();
  const min = time.getMinutes();
  const hours = time.getHours();

  return `현재 ${month}월 ${day}일 ${hours}시 ${min}`;
}
