import fs from 'fs';
import { KeyPackage } from '../types/authWithHantoo';

const filePath = './cache_data/auth-key.json';
const TTL = 1000 * 60 * 60 * 12; // 12시간

// key를 KeyPackage array로 받아 처리해야함.

export function setKey(key: KeyPackage[]) {
  console.log('setKey start');
  fs.mkdirSync('./cache_data', { recursive: true });

  const now = Date.now();

  // 기존 키가 있으면, 타임스탬프 비교
  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const existing: KeyPackage[] = JSON.parse(raw);

      const now = Date.now(); // 보장용
      const notExpired = (pkg: KeyPackage | undefined) => !!pkg && now - pkg.timestamp < TTL;

      if (notExpired(existing[0])) {
        console.log('[setKey] 기존 일반key 유효함 → 덮어쓰기 생략');
        return;
      }

      if (notExpired(existing[1])) {
        console.log('[setKey] 기존 소켓key 유효함 → 덮어쓰기 생략');
        return;
      }
    } catch (e) {
      console.warn('[setKey] 기존 key 읽기 실패 → 덮어쓰기 진행');

      try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);

        if (!Array.isArray(parsed)) {
          throw new Error('파일 내용이 배열이 아님');
        }

        if (!parsed[0]?.value) console.warn('⚠️ 기존 일반 key 누락됨');
        if (!parsed[1]?.value) console.warn('⚠️ 기존 소켓 key 누락됨');
      } catch (innerErr) {
        console.error('❌ 복구 중에도 실패:', innerErr);
      }

      console.warn('[setKey] 덮어쓰기 진행합니다.', e);
    }
  }

  // 수정
  const data: KeyPackage = { value: key, timestamp: now };
  fs.writeFileSync(filePath, JSON.stringify(data), 'utf-8');
  console.log('[setKey] key 저장 완료');
}

export function getKey(): string | null {
  if (!fs.existsSync(filePath)) return null;
  console.log(filePath);
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    console.log(raw);
    const data: KeyPackage = JSON.parse(raw);
    const expired = Date.now() - data.timestamp > TTL;

    console.log('expired:   ' + expired);

    console.log('data:   ' + data.value);
    return expired ? null : data.value;
  } catch (e) {
    console.error('[getKey] read error', e);
    return null;
  }
}
