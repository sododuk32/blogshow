/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from 'next/server';
import getNewsFromNaver from '@features/Global/http_client/newsTap/news/getNewsFromNaver';

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'need input' }, { status: 400 });
  }

  const { word } = body || {};
  if (!word) {
    return NextResponse.json({ message: 'need input' }, { status: 400 });
  }

  const response = await getNewsFromNaver(word);

  if (response?.message !== 'good') {
    return NextResponse.json({ message: response.message || 'error' }, { status: 400 });
  }
  return NextResponse.json(response);
}
