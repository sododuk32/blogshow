import { HantHeadersAccess, HantHeadersAccessSocket } from '@util/types/HTHeaderType';
import safeFetch from './safeFetch';
import { HashKeyRes, HashKeySocketRes, HashKeyAccessTokenRes } from '@util/types/authWithHantoo';
// only use in server

const htKeyRaw = process.env.HanTKey;
const htSecRaw = process.env.HanTSecret;
const HanBaseUrl = process.env.HantBaseUrl;
const HanRealUrls = process.env.HantBaseRealUrl;

if (!htKeyRaw || !htSecRaw || !HanBaseUrl) {
  throw new Error('❌ .env에서 HanTKey 또는 HanTSecret이 누락되었습니다');
}
const htKey: string = htKeyRaw;
const htSec: string = htSecRaw;
const BaseUrls: string = HanBaseUrl;
const HanRealUrl: string | undefined = HanRealUrls;

export default async function fetchingHTKey() {
  const headers1: HantHeadersAccess = {
    appkey: `Bearer ${htKey}`,
    appsecret: htSec,
    grant_type: 'client_credentials',
  };
  const reqUrl = `${HanRealUrl}/uapi/hashkey`;
  const TokenOBJ = await safeFetch<HashKeyRes>(reqUrl, 'GET', null, headers1);
  console.log('get from ./..');
  console.log(TokenOBJ);
  return TokenOBJ;
}

export async function fetchingHTSocketKey() {
  const headers1: HantHeadersAccessSocket = {
    appkey: `${htKey}`,
    secretkey: htSec,
    grant_type: 'client_credentials',
  };
  const reqUrl = `${HanRealUrl}/oauth2/Approval`;
  const TokenOBJ = await (<HashKeySocketRes>(reqUrl,
  'POST',
  headers1,
  {
    'content-type': 'application/json; utf-8',
  }));
  console.log('get Socket from ./..');
  console.log(TokenOBJ);
  return TokenOBJ;
}

export async function fetchingHTAccessToken() {
  const headers1: HantHeadersAccess = {
    appkey: `${htKey}`,
    appsecret: htSec,
    grant_type: 'client_credentials',
  };
  const reqUrl = `${HanRealUrl}/oauth2/tokenP`;
  console.log(reqUrl);

  console.log(headers1);

  const TokenOBJ = await safeFetch<HashKeyAccessTokenRes>(reqUrl, 'POST', headers1, {
    'content-type': 'application/json; utf-8',
  });
  console.log('get AccessToken from ./..');
  console.log(TokenOBJ);
  return TokenOBJ;
}
