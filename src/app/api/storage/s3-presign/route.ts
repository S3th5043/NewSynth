import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { z } from 'zod';

export const runtime = 'nodejs';

const BodySchema = z.object({ filename: z.string().min(1), contentType: z.string().min(1) });

export async function POST(req: NextRequest) {
  let body: z.infer<typeof BodySchema>;
  try { body = BodySchema.parse(await req.json()); } catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }); }
  const region = process.env.AWS_REGION ?? 'us-east-1';
  const bucket = process.env.AWS_S3_BUCKET ?? 'dev-bucket';
  const s3 = new S3Client({ region, credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? undefined : undefined });
  const key = `uploads/${Date.now()}_${body.filename}`;
  const cmd = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: body.contentType });
  const url = await getSignedUrl(s3, cmd, { expiresIn: 60 });
  return NextResponse.json({ url, key, bucket, region });
}
