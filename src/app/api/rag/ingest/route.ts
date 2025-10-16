import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { addDocuments } from '@/utils/vector-store';
import { log } from '@/utils/observability';
import { verifyProjectApiKey } from '@/utils/auth-project';
import { prisma } from '@/utils/db';
import { writeAuditLog } from '@/utils/audit';

export const runtime = 'nodejs';

const BodySchema = z.object({
  projectId: z.string().default('default'),
  docs: z.array(z.object({ id: z.string().optional(), text: z.string().min(1), metadata: z.record(z.string(), z.any()).optional() })).min(1),
});

export async function POST(req: NextRequest) {
  const auth = await verifyProjectApiKey(req.headers.get('x-api-key'));
  if (!auth.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let body: z.infer<typeof BodySchema>;
  try { body = BodySchema.parse(await req.json()); }
  catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }); }

  const projectId = body.projectId || auth.projectId!;
  const created = await addDocuments(projectId, body.docs);
  // persist docs plain text for now
  await prisma.$transaction(
    body.docs.map((d) =>
      prisma.document.create({ data: { projectId, text: d.text, metadata: d.metadata as any } })
    )
  );
  log('info', 'rag_ingest', { projectId: body.projectId, created });
  await writeAuditLog({ projectId, path: '/api/rag/ingest', method: 'POST', status: 200 });
  return NextResponse.json({ ok: true, created });
}
