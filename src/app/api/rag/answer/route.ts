import { NextRequest } from 'next/server';
import { z } from 'zod';
import { search } from '@/utils/vector-store';
import { streamChat } from '@/utils/ai';
import { verifyProjectApiKey } from '@/utils/auth-project';

export const runtime = 'nodejs';

const BodySchema = z.object({
  projectId: z.string().default('default'),
  query: z.string().min(1),
  topK: z.number().min(1).max(10).default(4),
});

export async function POST(req: NextRequest) {
  const auth = await verifyProjectApiKey(req.headers.get('x-api-key'));
  if (!auth.ok) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'content-type': 'application/json' } });
  let body: z.infer<typeof BodySchema>;
  try { body = BodySchema.parse(await req.json()); }
  catch { return new Response(JSON.stringify({ error: 'Invalid body' }), { status: 400, headers: { 'content-type': 'application/json' } }); }

  const matches = await search(body.projectId || auth.projectId!, body.query, body.topK);
  const context = matches.map((m, i) => `# Doc ${i+1} (score=${m.score.toFixed(3)})\n${m.text}`).join('\n\n');

  const messages = [
    { role: 'system' as const, content: 'You are an expert assistant. Use the provided context to answer. If the answer is not in the context, say you do not know.' },
    { role: 'user' as const, content: `Context:\n${context}\n\nQuestion: ${body.query}\nAnswer:` },
  ];

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of streamChat({ messages })) {
          controller.enqueue(encoder.encode(chunk));
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
