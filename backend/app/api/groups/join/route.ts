import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';
import { joinGroupSchema } from '../../../../lib/validation';
import { comparePassword } from '../../../../lib/auth';

function error(code: string, message: string, status = 400) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return error('UNAUTHORIZED', 'Unauthorized', 401);
  const json = await req.json().catch(() => null);
  const parsed = joinGroupSchema.safeParse(json);
  if (!parsed.success) return error('INVALID_BODY', 'Invalid request body');
  const { groupId, groupPw } = parsed.data;
  const group = await prisma.group.findUnique({ where: { groupId } });
  if (!group) return error('NOT_FOUND', 'Group not found', 404);
  const ok = await comparePassword(groupPw, group.groupPw);
  if (!ok) return error('INVALID_CREDENTIALS', 'Invalid credentials', 401);
  try {
    await prisma.groupMember.create({
      data: { userId, groupId: group.id, role: 'MEMBER' },
    });
  } catch {
    return error('ALREADY_MEMBER', 'Already a member', 400);
  }
  return NextResponse.json({ joined: true });
}
