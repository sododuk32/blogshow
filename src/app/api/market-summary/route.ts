/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/chart/route.ts
import { NextResponse } from 'next/server';
import path from 'path';
import { existsSync, mkdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import cheerio from 'cheerio';

const API_KEY = process.env.ALPHA_KEY!;
const CACHE_DIR = path.join(process.cwd(), 'cache_data');
const SVG_EXPIRE_HOUR = 11;
const SVG_EXPIRE_MINUTE = 59;

// 일간 데이터만 필요하므로 TIME_SERIES_DAILY 로 통일
const SYMBOLS = ['SPY', 'EWY'];

export async function GET() {
  try {
    if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR);

    const now = new Date();
    const todayExpire = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      SVG_EXPIRE_HOUR,
      SVG_EXPIRE_MINUTE
    );

    const results: Record<string, string> = {};

    for (const symbol of SYMBOLS) {
      // 파일명에 ^는 제거해도 무방
      const fileName = symbol.replace(/^\^/, '');
      const filePath = path.join(CACHE_DIR, `${fileName}.svg`);

      // 캐시 검사
      let useCache = false;
      if (existsSync(filePath)) {
        const stats = statSync(filePath);
        const lastMod = new Date(stats.mtime);
        if (lastMod > todayExpire || now < todayExpire) {
          useCache = true;
        }
      }
      if (useCache) {
        results[symbol] = readFileSync(filePath, 'utf-8');
        continue;
      }

      // 1) Alpha Vantage 일간 시리즈 호출
      const fetchUrl = new URL('https://www.alphavantage.co/query');
      fetchUrl.searchParams.set('function', 'TIME_SERIES_DAILY');
      fetchUrl.searchParams.set('symbol', symbol);
      fetchUrl.searchParams.set('outputsize', 'compact');
      fetchUrl.searchParams.set('apikey', API_KEY);

      const res = await fetch(fetchUrl.toString());
      // TS에서 unknown 에러 제거용으로 any 캐스팅
      const json: any = await res.json();
      const raw = json['Time Series (Daily)'];
      if (!raw) {
        console.warn('Missing time series for', symbol);
        continue;
      }

      // 2) 날짜 오름차순 정렬
      const entries = Object.entries(raw)
        .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
        .map(([date, data]: [string, any]) => ({
          time: date,
          price: parseFloat(data['4. close']),
        }));

      if (entries.length === 0) {
        console.warn('No valid prices for', symbol);
        continue;
      }

      const labels = entries.map((e) => e.time);
      const values = entries.map((e) => e.price);

      // 3) QuickChart.io 로 SVG 생성
      const config = {
        type: 'line',
        data: { labels, datasets: [{ data: values, fill: true, tension: 0.4 }] },
        options: {
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales: {
            x: { display: false, grid: { display: false } },
            y: { display: false, grid: { display: false } },
          },
          layout: { padding: 0 },
          backgroundColor: 'transparent',
        },
        configVersion: 2,
      };
      const chartUrl =
        'https://quickchart.io/chart?format=svg&width=800&height=400&c=' +
        encodeURIComponent(JSON.stringify(config));

      const chartSvg = await (await fetch(chartUrl)).text();

      // 4) Cheerio 로 불필요 요소 제거 (선택사항)
      const $ = cheerio.load(chartSvg, { xmlMode: true });
      const svg = $('svg');
      const innerG = svg.children('g').first().children('g').first();
      svg.children().remove();
      svg.append($('<g></g>').append(innerG));
      $('line, rect').remove();
      const cleaned = $.xml();

      // 5) 캐시에 저장
      writeFileSync(filePath, cleaned, 'utf-8');
      results[symbol] = cleaned;
    }

    return NextResponse.json({ success: true, symbols: Object.keys(results) });
  } catch (e) {
    return NextResponse.json(
      { error: '처리 중 오류', detail: (e as Error).message },
      { status: 500 }
    );
  }
}
