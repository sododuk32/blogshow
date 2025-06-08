/**
 * og image 추출
 * @param url
 * @returns
 */
export async function fetchOgImage(url: string): Promise<string | undefined> {
  try {
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) return undefined;

    const html = await res.text();
    const match = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
    if (match && match[1]) {
      return match[1];
    }
  } catch (error) {
    console.error(`fetchOgImage Error for ${url}:`, error);
  }
  return undefined;
}
