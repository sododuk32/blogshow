// app/robots.txt/route.ts

export async function GET() {
  const content = `
  User-agent: *
  Disallow: /api/
  Disallow: /admin/
  
  Sitemap: https://mydomain.com/sitemap.xml
  `;

  return new Response(content.trim(), {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
