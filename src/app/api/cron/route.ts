import { setKey, getKey } from '@util/cronFile/keyStore';
import fetchKey from '@util/cronFile/fetchKey';

export async function GET() {
  const newKey = await fetchKey();
  setKey(newKey); // 이건 메모리에 저장됨
  return Response.json({ ok: true, body: getKey() || 'no key' });
}

// 1. api/cron => fetchKey => keyStore.setKey => saved

// 2.
//  crontab -e
// 0 11,11 * * * curl -X GET http://localhost:3000/api/cron
// => 위 1번 반복
