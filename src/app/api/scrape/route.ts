import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import * as cheerio from 'cheerio';

export const runtime = 'nodejs';

const BodySchema = z.object({ url: z.string().url() });

export async function POST(req: NextRequest) {
  let body: z.infer<typeof BodySchema>;
  try { body = BodySchema.parse(await req.json()); } catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }); }

  const res = await fetch(body.url, { headers: { 'user-agent': 'Mozilla/5.0 (compatible; SynthBot/1.0)' } });
  if (!res.ok) return NextResponse.json({ error: 'Failed to fetch' }, { status: 400 });
  const html = await res.text();
  const $ = cheerio.load(html);
  $('script, style, noscript').remove();
  const text = $('body').text().replace(/\s+/g, ' ').trim();
  const title = $('title').text();
  return NextResponse.json({ title, text });
}
