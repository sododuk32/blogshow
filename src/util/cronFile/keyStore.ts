import fs from 'fs';
import { KeyPackage } from '../types/authWithHantoo';

const filePath = './cache_data/auth-key.json';
const TTL = 1000 * 60 * 60 * 12; // 12시간

// key를 KeyPackage array로 받아 처리해야함.

export function setKey(key: KeyPackage[]) {
  console.log('setKey start');
  fs.mkdirSync('./cache_data', { recursive: true });

  const now = Date.now();

  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const existing: KeyPackage[] = JSON.parse(raw);

      const now = Date.now(); // 보장용
      const notExpired = (pkg: KeyPackage | undefined) =>
        !!pkg && now - pkg.timestamp < TTL && pkg.value?.length > 5;
      console.log(existing[0].value?.length);
      if (notExpired(existing[0]) && notExpired(existing[1]) && notExpired(existing[2])) {
        if (notExpired(existing[0])) {
          return console.log('[setKey] 기존 일반key 유효함 → 덮어쓰기 생략');
        }

        if (notExpired(existing[1])) {
          return console.log('[setKey] 기존 소켓key 유효함 → 덮어쓰기 생략');
        }
        if (notExpired(existing[2])) {
          return console.log('[setKey] 기존 ACCESS KEY 유효함 → 덮어쓰기 생략');
        }
      }

      throw Error;
    } catch (e) {
      console.warn('[setKey] 기존 key 읽기 실패 → 덮어쓰기 진행');

      try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);

        if (!Array.isArray(parsed)) {
          throw new Error('파일 내용이 배열이 아님');
        }
        console.log('여기');
        if (!parsed[0]?.value) console.warn('⚠️ 기존 일반 key 누락됨');
        if (!parsed[1]?.value) console.warn('⚠️ 기존 소켓 key 누락됨');
        if (!parsed[2]?.value) console.warn('⚠️ 기존 접근 key 누락됨');
      } catch (innerErr) {
        console.error('❌ 복구 중에도 실패:', innerErr);
      }

      console.warn('[setKey] 덮어쓰기 진행합니다.', e);
    }
  }

  // 수정
  console.log('전달받은 키 ');
  console.log(key);
  const data: KeyPackage[] = [
    { ...key[0], value: key[0].value, timestamp: now },
    { ...key[0], value: key[1].value, timestamp: now },
    { ...key[0], value: key[2].value, timestamp: now },
  ];

  fs.writeFileSync(filePath, JSON.stringify(data), 'utf-8');
  console.log('[setKey] key 저장 완료');
}

export interface KeyCheckResult {
  valid: boolean;
  data: KeyPackage[] | null;
}

/**
 * 키 존재 유무. expired 유무 || 값 존재 유무 4개중 하나라도 false이면 false
 * @returns
 */
export function getKey(): KeyCheckResult {
  if (!fs.existsSync(filePath)) {
    return { valid: false, data: null };
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data: KeyPackage[] = JSON.parse(raw);

    const valid = data.every((item) => Date.now() - item.timestamp < TTL && Boolean(item.value));

    return { valid, data };
  } catch (e) {
    console.error('[getKeyInfo] read error', e);
    return { valid: false, data: null };
  }
}
// export function getKey(): boolean {
//   if (!fs.existsSync(filePath)) return false;

//   console.log(filePath);

//   try {
//     const raw = fs.readFileSync(filePath, 'utf-8');
//     const data: KeyPackage[] = JSON.parse(raw);

//     const bothNotExpired =
//       Date.now() - data[0].timestamp < TTL &&
//       Date.now() - data[1].timestamp < TTL &&
//       Date.now() - data[2].timestamp < TTL;

//     const bothHaveValue = !!data[0]?.value && !!data[1]?.value && !!data[2]?.value;

//     console.log(raw);

//     return bothNotExpired && bothHaveValue;
//   } catch (e) {
//     console.error('[getKey] read error', e);
//     return false;
//   }
// }
