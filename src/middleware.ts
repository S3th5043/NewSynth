import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/utils/db';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  if (url.pathname.startsWith('/api/')) {
    const start = Date.now();
    const res = NextResponse.next();
    res.headers.set('x-request-id', crypto.randomUUID());
    res.headers.set('x-start-time', String(start));
    return res;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
