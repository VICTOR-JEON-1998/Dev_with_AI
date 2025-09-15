import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from './lib/auth';

export function middleware(req: NextRequest) {
  const requestHeaders = new Headers(req.headers);
  const auth = requestHeaders.get('authorization');
  if (auth && auth.startsWith('Bearer ')) {
    const token = auth.slice(7);
    try {
      const payload = verifyAccessToken(token);
      if (payload && typeof payload.sub === 'string') {
        requestHeaders.set('x-user-id', payload.sub);
      }
    } catch {
      // ignore invalid token
    }
  }
  return NextResponse.next({ request: { headers: requestHeaders } });
}
