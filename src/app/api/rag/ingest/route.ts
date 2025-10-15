import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { addDocuments } from '@/utils/vector-store';
import { log } from '@/utils/observability';

export const runtime = 'nodejs';

const BodySchema = z.object({
  projectId: z.string().default('default'),
  docs: z.array(z.object({ id: z.string().optional(), text: z.string().min(1), metadata: z.record(z.string(), z.any()).optional() })).min(1),
});

export async function POST(req: NextRequest) {
  let body: z.infer<typeof BodySchema>;
  try { body = BodySchema.parse(await req.json()); }
  catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }); }

  const created = await addDocuments(body.projectId, body.docs);
  log('info', 'rag_ingest', { projectId: body.projectId, created });
  return NextResponse.json({ ok: true, created });
}
