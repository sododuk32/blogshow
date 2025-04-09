import fs from 'fs';

const filePath = './.cache/auth-key.json';
const TTL = 1000 * 60 * 60 * 12; // 12시간

type StoredKey = {
  value: string;
  timestamp: number;
};

export function setKey(key: string) {
  fs.mkdirSync('./.cache', { recursive: true });

  const now = Date.now();

  // 기존 키가 있으면, 타임스탬프 비교
  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const existing: StoredKey = JSON.parse(raw);

      const notExpired = now - existing.timestamp < TTL;
      if (notExpired) {
        console.log('[setKey] 기존 key 유효함 → 덮어쓰기 생략');
        return;
      }
    } catch (e) {
      console.warn('[setKey] 기존 key 읽기 실패, 덮어쓰기 진행', e);
    }
  }

  // 새로 쓰기
  const data: StoredKey = { value: key, timestamp: now };
  fs.writeFileSync(filePath, JSON.stringify(data), 'utf-8');
  console.log('[setKey] key 저장 완료');
}

export function getKey(): string | null {
  if (!fs.existsSync(filePath)) return null;

  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data: StoredKey = JSON.parse(raw);
    const expired = Date.now() - data.timestamp > TTL;
    return expired ? null : data.value;
  } catch (e) {
    console.error('[getKey] read error', e);
    return null;
  }
}
