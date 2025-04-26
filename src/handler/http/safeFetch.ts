/* eslint-disable @typescript-eslint/no-explicit-any */
import { FetchErrorDetail, FetchResult } from '../../util/types/ErrorTypes';

type HttpMeth = 'GET' | 'POST' | 'PUT' | 'DELETE';

/**
 *
 * @param url string
 * @param method restapi method
 * @param body any
 * @param headers key-value type header object
 * @returns Json StringFyed object  | undefined ( error 는 console로 전달)
 */
export default async function safeFetch<G>(
  url: string,
  method: HttpMeth,
  body?: any,
  headers?: Record<string, string> | null
): Promise<FetchResult<G>> {
  // fulfilled 시
  try {
    const res = await fetch(url, {
      method,
      headers: { ...(headers || { accept: 'application/json' }) },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const json = await res.json();

    const data = json;

    return { data: data, error: null };
  } catch (error: unknown) {
    const detail: FetchErrorDetail = { message: 'Unknown error' };

    if (error instanceof Error) {
      detail.message = error.message;

      if ('code' in error) {
        detail.code = (error as any).code;
      }
    } else {
      detail.message = String(error);
    }
    console.error('safeFetch network error:', detail);
    return { data: null, error: detail };
  }
}
