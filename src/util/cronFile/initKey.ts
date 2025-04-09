import { setKey } from './keyStore';
import fetchKey from './fetchKey';

let initialized = false;

export async function initIfNeeded() {
  if (initialized) return;

  const res = await fetchKey(); // 진짜 백엔드 요청

  setKey(res); // ✅ 직접 저장
  initialized = true;
}
