import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  OPENAI_API_KEY: z.string().min(1).optional(),
});

export type Env = z.infer<typeof EnvSchema>;

function readEnv(key: string): string | undefined {
  if (typeof process === 'undefined') return undefined;
  return (process as any).env?.[key];
}

export const env: Env = EnvSchema.parse({
  NODE_ENV: readEnv('NODE_ENV'),
  OPENAI_API_KEY: readEnv('OPENAI_API_KEY'),
});

export function isProduction(): boolean {
  return env.NODE_ENV === 'production';
}

export function requireServerEnv(key: keyof Env): string {
  const value = env[key];
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Missing required env var: ${String(key)}`);
  }
  return value;
}
