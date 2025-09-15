import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';
import { signinSchema } from '../../../../lib/validation';
import {
  comparePassword,
  signAccessToken,
  signRefreshToken,
  setRefreshCookie,
} from '../../../../lib/auth';

function error(code: string, message: string, status = 400) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = signinSchema.safeParse(json);
  if (!parsed.success) return error('INVALID_BODY', 'Invalid request body');
  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return error('INVALID_CREDENTIALS', 'Invalid credentials', 401);
  const match = await comparePassword(password, user.password);
  if (!match) return error('INVALID_CREDENTIALS', 'Invalid credentials', 401);
  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);
  const res = NextResponse.json({ accessToken });
  setRefreshCookie(res, refreshToken);
  return res;
}
