import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/utils/db';
import { verifyAdminApiKey } from '@/utils/auth';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  if (!verifyAdminApiKey(req.headers.get('x-api-key'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const projects = await prisma.project.findMany({ include: { apiKeys: true } });
  return NextResponse.json({ projects });
}

const CreateSchema = z.object({ name: z.string().min(2) });

export async function POST(req: NextRequest) {
  if (!verifyAdminApiKey(req.headers.get('x-api-key'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let body: z.infer<typeof CreateSchema>;
  try { body = CreateSchema.parse(await req.json()); } catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }); }
  const project = await prisma.project.create({ data: { name: body.name } });
  return NextResponse.json({ project });
}
