import { NextResponse, NextRequest } from 'next/server';
import { XMLParser } from 'fast-xml-parser';
import safeFetch from '@features/Global/http_client/safeFetch';

type RawRSSItem = {
  title: string;
  link: string;
  pubDate: string;
  description: string;
};

export async function POST(req: NextRequest) {
  const { word } = await req.json();
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(word)}&hl=ko&gl=KR&ceid=KR:ko`;

  // 1) fetch & get raw XML
  const res = await fetch(url);
  if (!res.ok) {
    return NextResponse.json({ error: `${res.status} ${res.statusText}` }, { status: res.status });
  }
  const xml = await res.text();

  // 2) parse XML → JS object
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
  });
  const json = parser.parse(xml);

  // 3) extract <item> array
  let items = json.rss?.channel?.item ?? [];
  if (!Array.isArray(items)) items = [items];

  // 4) map to only the fields you need
  const data = items.map((it: RawRSSItem) => ({
    title: it?.title,
    link: it?.link,
    pubDate: it?.pubDate,
    description: it?.description,
  }));
  console.log(data);
  return NextResponse.json({ data });
}
// naver api로 변경 필요. 구글 api는 구글 링크에서 원본 기사로 리디렉션되는대 이거 못써먹음.
