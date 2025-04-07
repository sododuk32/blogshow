// src/app/sitemap.xml/route.ts

const DOMAIN = 'https://your-domain.com';

async function getGeneratedCodes(): Promise<string[]> {
  // 예시: DB나 KV에서 이미 생성된 경로 리스트 가져오기
  return ['AAPL', 'TSLA', 'NVDA'];
}
// 실제론 await fetchDB() 등으로 대체
// 변경된 타임스탬프 또한 필요함

export async function GET() {
  const codes = await getGeneratedCodes();

  const staticRoutes = [
    '/subpage',
    '/stocks', // 종목 리스트 페이지
  ];

  const urls = [
    ...staticRoutes.map(
      (path) => `
    <url>
      <loc>${DOMAIN}${path}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.6</priority>
    </url>`
    ),
    ...codes.map(
      (code) => `
    <url>
      <loc>${DOMAIN}/stocks/${code}</loc>
      <changefreq>hourly</changefreq>
      <priority>0.8</priority>
      <lastmod>${new Date().toISOString()}</lastmod>
    </url>`
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
  <loc>https://mydomain.com/</loc>
  <changefreq>hourly</changefreq>
  <priority>1.0</priority>
  <lastmod>2025-04-07T13:00:00Z</lastmod>
</url>
${urls.join('\n')}
</urlset>`;

  return new Response(xml.trim(), {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
