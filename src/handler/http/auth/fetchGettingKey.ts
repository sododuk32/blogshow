import { HantHeadersAccess } from '@util/types/HTHeaderType';
import safeFetch from './safeFetch';
import { AccessTokenRes, HashKeyRes, HashKeySocketRes } from '@util/types/authWithHantoo';
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

export async function fetchingHTSocketKey() {
  const headers1: HantHeadersAccess = {
    appkey: `Bearer ${htKey}`,
    appsecret: htSec,
    grant_type: 'client_credentials',
  };
  const reqUrl = `${BaseUrls}/oauth2/Approval`;
  const TokenOBJ = await safeFetch<HashKeySocketRes>(reqUrl, 'GET', null, headers1);
  console.log('get from ./..');
  console.log(TokenOBJ);
  return TokenOBJ;
}
