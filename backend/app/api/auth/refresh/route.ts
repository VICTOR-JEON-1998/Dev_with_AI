import { NextRequest, NextResponse } from 'next/server';
import {
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
  setRefreshCookie,
} from '../../../../lib/auth';

function error(code: string, message: string, status = 400) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('refreshToken')?.value;
  if (!token) return error('UNAUTHORIZED', 'No refresh token', 401);
  try {
    const payload = verifyRefreshToken(token);
    const userId = payload.sub as string;
    const accessToken = signAccessToken(userId);
    const refreshToken = signRefreshToken(userId);
    const res = NextResponse.json({ accessToken });
    setRefreshCookie(res, refreshToken);
    return res;
  } catch {
    return error('UNAUTHORIZED', 'Invalid refresh token', 401);
  }
}
