import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/utils/db';
import { verifyAdminApiKey } from '@/utils/auth';

export const runtime = 'nodejs';

const IssueSchema = z.object({ projectId: z.string().min(1) });

export async function POST(req: NextRequest) {
  if (!verifyAdminApiKey(req.headers.get('x-api-key'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let body: z.infer<typeof IssueSchema>;
  try { body = IssueSchema.parse(await req.json()); } catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }); }
  const key = `proj_${body.projectId}_${crypto.randomUUID().replace(/-/g,'').slice(0,24)}`;
  const created = await prisma.apiKey.create({ data: { key, projectId: body.projectId } });
  return NextResponse.json({ apiKey: created });
}

export async function GET(req: NextRequest) {
  if (!verifyAdminApiKey(req.headers.get('x-api-key'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const keys = await prisma.apiKey.findMany({ where: { revokedAt: null }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ keys });
}
