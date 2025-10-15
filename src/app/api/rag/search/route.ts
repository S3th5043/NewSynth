import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { search } from '@/utils/vector-store';

export const runtime = 'nodejs';

const BodySchema = z.object({
  projectId: z.string().default('default'),
  query: z.string().min(1),
  topK: z.number().min(1).max(20).default(5),
});

export async function POST(req: NextRequest) {
  let body: z.infer<typeof BodySchema>;
  try { body = BodySchema.parse(await req.json()); }
  catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }); }

  const results = await search(body.projectId, body.query, body.topK);
  return NextResponse.json({ results });
}
