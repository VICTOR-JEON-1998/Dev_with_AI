import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';
import { signupSchema } from '../../../../lib/validation';
import {
  hashPassword,
  signAccessToken,
  signRefreshToken,
  setRefreshCookie,
} from '../../../../lib/auth';

function error(code: string, message: string, status = 400) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = signupSchema.safeParse(json);
  if (!parsed.success) {
    return error('INVALID_BODY', 'Invalid request body');
  }
  const { email, password, displayName } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return error('EMAIL_TAKEN', 'Email already registered', 409);
  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, password: hashed, displayName },
  });
  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);
  const res = NextResponse.json({ accessToken }, { status: 201 });
  setRefreshCookie(res, refreshToken);
  return res;
}
