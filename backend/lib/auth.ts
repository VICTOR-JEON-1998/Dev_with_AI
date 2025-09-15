import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refreshsecret';

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signAccessToken(userId: string) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '15m' });
}

export function signRefreshToken(userId: string) {
  return jwt.sign({ sub: userId }, REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET) as jwt.JwtPayload;
}

export function setRefreshCookie(res: NextResponse, token: string) {
  res.cookies.set('refreshToken', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearRefreshCookie(res: NextResponse) {
  res.cookies.set('refreshToken', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });
}
