import { HantHeadersAccess } from '@util/types/HTHeaderType';
import safeFetch from './safeFetch';
// only use in server

const htKeyRaw = process.env.HanTKey;
const htSecRaw = process.env.HanTSecret;
const HanBaseUrl = process.env.HantBaseUrl;
if (!htKeyRaw || !htSecRaw || !HanBaseUrl) {
  throw new Error('❌ .env에서 HanTKey 또는 HanTSecret이 누락되었습니다');
}
const htKey: string = htKeyRaw;
const htSec: string = htSecRaw;
const BaseUrls: string = HanBaseUrl;

export default async function fetchingHTKey() {
  const headers1: HantHeadersAccess = {
    appkey: `Bearer ${htKey}`,
    appsecret: htSec,
    grant_type: 'client_credentials',
  };
  const reqUrl = `${BaseUrls}/uapi/hashkey`;
  const TokenOBJ = await safeFetch<HashKeyRes>(reqUrl, 'GET', null, headers1);
  console.log('get from ./..');
  console.log(TokenOBJ);
  return TokenOBJ;
}

export type AccessTokenRes = {
  access_token: string;
  access_token_token_expired: string;
  token_type: string;
  expires_in: number;
};

// const ress = await safeFetch<HashKeyRes>(reqUrl, 'GET', null, headers1);
export type HashKeyRes = {
  BODY: Record<string, string>;
  HASH: string;
};

// safeFetch 작성 -> Record 학습 , error type 관련 insetanceof 학습,
// 함수명뒤의 <T> => 아님. 함수 안에서 사용할 제네릭 타입 변수 선언. D V X 등등 뭘 써도 되는대 제네릭 키 값임
// 함수props 뒤의 <T> => 는 함수의 리턴타입인데, 앞에 선언한 제네릭 T를 쓰는 것일 뿐.
