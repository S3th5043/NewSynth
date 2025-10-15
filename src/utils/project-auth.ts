import { prisma } from '@/utils/db';

export async function getProjectIdFromApiKey(apiKey: string | null | undefined): Promise<string | null> {
  if (!apiKey) return null;
  const rec = await prisma.apiKey.findFirst({ where: { key: apiKey, revokedAt: null } });
  return rec?.projectId ?? null;
}
