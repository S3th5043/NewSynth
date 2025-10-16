import { prisma } from '@/utils/db';

export async function writeAuditLog(params: {
  projectId: string;
  apiKeyId?: string;
  path: string;
  method: string;
  status: number;
  tokensUsed?: number;
}) {
  try {
    await prisma.auditLog.create({ data: params });
  } catch {
    // ignore
  }
}
