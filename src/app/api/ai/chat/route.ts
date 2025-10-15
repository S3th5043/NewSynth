import { NextRequest } from 'next/server';
import { z } from 'zod';
import { rateLimit } from '@/utils/rate-limit';
import { log } from '@/utils/observability';
import { streamChat } from '@/utils/ai';

const BodySchema = z.object({
  messages: z.array(z.object({ role: z.enum(['system','user','assistant']), content: z.string().min(1) })).min(1),
  model: z.string().optional(),
});

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'local';
  if (!rateLimit(`chat:${ip}`, 30, 15)) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429, headers: { 'content-type': 'application/json' } });
  }

  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid body' }), { status: 400, headers: { 'content-type': 'application/json' } });
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of streamChat({ messages: body.messages, model: body.model })) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (e: any) {
        log('error', 'chat_stream_error', { message: e?.message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
