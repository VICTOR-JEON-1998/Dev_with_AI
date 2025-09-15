import { NextRequest, NextResponse } from 'next/server';
import { clearRefreshCookie } from '../../../../lib/auth';

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ ok: true });
  clearRefreshCookie(res);
  return res;
}
