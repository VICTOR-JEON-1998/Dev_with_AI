import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/db';
import { checkGroupIdSchema } from '../../../../../lib/validation';

function error(code: string, message: string, status = 400) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = checkGroupIdSchema.safeParse(json);
  if (!parsed.success) return error('INVALID_BODY', 'Invalid request body');
  const { groupId } = parsed.data;
  const existing = await prisma.group.findUnique({ where: { groupId } });
  return NextResponse.json({ available: !existing });
}
