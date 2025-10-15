import OpenAI from 'openai';
import { ZodSchema } from 'zod';
import { env } from '@/utils/env';

export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

export type ChatOptions = {
  model?: string;
  messages: ChatMessage[];
  schema?: ZodSchema<any>;
};

export async function* streamChat(opts: ChatOptions): AsyncGenerator<string> {
  if (!env.OPENAI_API_KEY) {
    yield 'Mock reply: This is a placeholder streaming response.';
    return;
  }

  const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  const model = opts.model ?? 'gpt-4o-mini';

  const stream = await client.chat.completions.create({
    model,
    messages: opts.messages,
    stream: true,
  } as any);

  for await (const chunk of stream as any) {
    const delta = chunk?.choices?.[0]?.delta?.content;
    if (delta) yield delta;
  }
}

export async function chatJson<T>(opts: ChatOptions & { schema: ZodSchema<T> }): Promise<T> {
  if (!env.OPENAI_API_KEY) {
    return opts.schema.parse({ ok: true } as any);
  }
  const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  const model = opts.model ?? 'gpt-4o-mini';
  const completion = await client.chat.completions.create({ model, messages: opts.messages });
  const text = completion.choices[0]?.message?.content ?? '';
  return opts.schema.parse(JSON.parse(safeJson(text)));
}

function safeJson(text: string): string {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start >= 0 && end > start) return text.slice(start, end + 1);
  return '{}';
}
