import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  const ok = typeof email === 'string' && email.includes('@');
  return NextResponse.json({ ok, message: ok ? 'Subscribed' : 'Invalid email' }, { status: ok ? 200 : 400 });
}
