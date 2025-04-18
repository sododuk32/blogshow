/* eslint-disable @typescript-eslint/no-explicit-any */
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
  headers?: Record<string, string>
): Promise<G | undefined> {
  try {
    const res = await fetch(url, {
      method,
      headers: { ...(headers || {}) },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    } else {
      console.error('Unknown error', error);
    }
    return undefined;
  }
}
