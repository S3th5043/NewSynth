import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';
import { verifyAdminApiKey } from '@/utils/auth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  if (!verifyAdminApiKey(req.headers.get('x-api-key'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const id = params.id;
  const keyValue = `proj_${id}_${crypto.randomUUID().replace(/-/g,'').slice(0,24)}`;
  const key = await prisma.apiKey.create({ data: { projectId: id, key: keyValue } });
  return NextResponse.json({ key });
}
