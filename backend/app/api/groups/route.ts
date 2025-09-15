import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';
import { createGroupSchema } from '../../../../lib/validation';
import { hashPassword } from '../../../../lib/auth';

function error(code: string, message: string, status = 400) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return error('UNAUTHORIZED', 'Unauthorized', 401);
  const json = await req.json().catch(() => null);
  const parsed = createGroupSchema.safeParse(json);
  if (!parsed.success) return error('INVALID_BODY', 'Invalid request body');
  const { groupId, groupPw, name, description } = parsed.data;
  const existing = await prisma.group.findUnique({ where: { groupId } });
  if (existing) return error('GROUP_ID_TAKEN', 'Group ID already taken', 409);
  const hashed = await hashPassword(groupPw);
  const group = await prisma.$transaction(async (tx) => {
    const g = await tx.group.create({
      data: { groupId, groupPw: hashed, name, description, adminId: userId },
    });
    await tx.groupMember.create({
      data: { userId, groupId: g.id, role: 'ADMIN' },
    });
    return g;
  });
  return NextResponse.json({ id: group.id, groupId: group.groupId });
}
