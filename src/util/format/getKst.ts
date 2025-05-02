export function getKSTDateTime() {
  // 1) UTC 또는 서버 로컬 기준 now
  const now = new Date();
  // 2) 한국시간 문자열로 변환 후 다시 Date 객체로
  const kstString = now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' });
  const kstDate = new Date(kstString);

  const yyyy = kstDate.getFullYear();
  const MM = String(kstDate.getMonth() + 1).padStart(2, '0');
  const dd = String(kstDate.getDate()).padStart(2, '0');
  const hh = String(kstDate.getHours()).padStart(2, '0');
  const mm = String(kstDate.getMinutes()).padStart(2, '0');
  const ss = String(kstDate.getSeconds()).padStart(2, '0');

  return {
    inqrDate: `${yyyy}${MM}${dd}`,
    inqrHour: `${hh}${mm}${ss}`,
  };
}
