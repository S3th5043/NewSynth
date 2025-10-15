import { prisma } from '@/utils/db';

export async function verifyProjectApiKey(value: string | null | undefined): Promise<{ ok: boolean; projectId?: string }> {
  if (!value) return { ok: false };
  const key = await prisma.apiKey.findUnique({ where: { key: value } });
  if (!key || key.revokedAt) return { ok: false };
  return { ok: true, projectId: key.projectId };
}
