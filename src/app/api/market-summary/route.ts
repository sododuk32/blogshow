/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/chart/route.ts
import { NextResponse } from 'next/server';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

const API_KEY = process.env.ALPHA_KEY!;
const CACHE_DIR = path.join(process.cwd(), 'cache_data');
const SVG_EXPIRE_HOUR = 11;
const SVG_EXPIRE_MINUTE = 59;

const SYMBOLS = ['SPY', 'QQQ', 'EWY'];

/**
 * 15분봉 기준 24시간 정보를 차트로 svg출력해줌. svg 가져다가 고정으로박으면되고
 * 나중에 sh로 크론잡 돌려서 24시간마다 svg 갈아끼워줘야함
 * @returns
 */
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
      const filePath = path.join(CACHE_DIR, `${symbol}.svg`);

      let useCache = false;
      if (existsSync(filePath)) {
        const stats = statSync(filePath);
        const lastModified = new Date(stats.mtime);
        if (lastModified > todayExpire || now < todayExpire) {
          useCache = true;
        }
      }

      if (useCache) {
        results[symbol] = readFileSync(filePath, 'utf-8');
        continue;
      }

      const prices: { time: string; price: number }[] = [];
      const filteredPrices = prices.slice(-96);

      const res = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=15min&outputsize=compact&apikey=${API_KEY}`
      );
      const json = await res.json();
      const raw = json['Time Series (15min)'];
      if (!raw) {
        console.warn('Missing time series for', symbol);
        continue;
      }
      const entries = Object.entries(raw)
        .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
        .map(([time, data]: [string, any]) => ({
          time,
          price: parseFloat(data['1. open']),
        }));
      filteredPrices.push(...entries);

      if (filteredPrices.length === 0) {
        console.warn('No valid prices for', symbol);
        continue;
      }

      const labels = filteredPrices.map((e) => e.time.slice(11, 16));
      const values = filteredPrices.map((e) => e.price);

      const config = {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: '',
              data: values,
              fill: true,
              tension: 0.4,
              borderColor: '#007bff',
              backgroundColor: 'rgba(0, 123, 255, 0.5)',
              pointRadius: 0,
              borderWidth: 2,
            },
          ],
        },
        options: {
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
          },
          scales: {
            x: {
              display: true,
              ticks: { display: false, callback: () => '', color: 'transparent' },
              grid: { display: false, drawTicks: false, color: 'transparent' },
              border: { display: false },
            },
            y: {
              display: true,
              ticks: { display: false, callback: () => '', color: 'transparent' },
              grid: { display: false, drawTicks: false, color: 'transparent' },
              border: { display: false },
            },
          },
          layout: { padding: 0 },
          backgroundColor: 'transparent',
        },
        configVersion: 2,
      };

      const chartUrl = `https://quickchart.io/chart?format=svg&width=800&height=400&c=${encodeURIComponent(JSON.stringify(config))}`;
      const chartSvg = await (await fetch(chartUrl)).text();

      const $ = cheerio.load(chartSvg, { xmlMode: true });
      const svg = $('svg');
      const firstG = svg.children('g').first();
      const innerG = firstG.children('g').first();
      svg.children().remove();
      const newOuterG = $('<g></g>').append(innerG);
      svg.append(newOuterG);
      $('line').remove();
      $('rect').remove();

      const cleaned = $.xml();
      writeFileSync(filePath, cleaned, 'utf-8');
      results[symbol] = cleaned;
    }

    return NextResponse.json({ success: true, cached: Object.keys(results) });
  } catch (err) {
    return NextResponse.json(
      { error: '처리 중 오류', detail: (err as Error).message },
      { status: 500 }
    );
  }
}
