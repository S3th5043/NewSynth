import { env } from '@/utils/env';

export function verifyAdminApiKey(value: string | null | undefined): boolean {
  const expected = env.ADMIN_API_KEY;
  if (!expected) return true; // if unset, allow for local dev
  return typeof value === 'string' && value.length > 0 && value === expected;
}
