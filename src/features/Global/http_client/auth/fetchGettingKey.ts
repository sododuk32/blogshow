/* eslint-disable @typescript-eslint/no-unused-vars */
import { HantHeadersAccess, HantHeadersAccessSocket } from '@util/types/Hant/HTHeaderType';
import safeFetch from '../safeFetch';
import {
  HashKeyRes,
  HashKeySocketRes,
  HashKeyAccessTokenRes,
} from '@util/types/Hant/authWithHantoo';
import { FetchErrorDetail } from '../../../../util/types/ErrorTypes';

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

export default async function fetchingHTKey(): Promise<HashKeyRes> {
  const headers1: HantHeadersAccess = {
    appkey: `Bearer ${htKey}`,
    appsecret: htSec,
    grant_type: 'client_credentials',
    cache: 'no-store',
  };
  const reqUrl = `${HanRealUrl}/uapi/hashkey`;
  const { data, error } = await safeFetch<HashKeyRes>(reqUrl, 'GET', null, headers1);

  if (error) throw new Error(error.message);

  return data;
}

export async function fetchingHTSocketKey(): Promise<HashKeySocketRes> {
  const headers1: HantHeadersAccessSocket = {
    appkey: `${htKey}`,
    secretkey: htSec,
    grant_type: 'client_credentials',
    cache: 'no-store',
  };
  const reqUrl = `${HanRealUrl}/oauth2/Approval`;
  const { data, error } = await safeFetch<HashKeySocketRes>(reqUrl, 'POST', headers1, {
    'content-type': 'application/json',
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function fetchingHTAccessToken(): Promise<HashKeyAccessTokenRes> {
  const bodys: HantHeadersAccess = {
    appkey: `${htKey}`,
    appsecret: htSec,
    grant_type: 'client_credentials',
    cache: 'no-store',
  };
  const reqUrl = `${HanRealUrl}/oauth2/tokenP`;

  const { data, error } = await safeFetch<HashKeyAccessTokenRes>(reqUrl, 'POST', bodys, {
    'content-type': 'application/json',
  });
  if (error) throw new Error(error.message);

  return data;
}
