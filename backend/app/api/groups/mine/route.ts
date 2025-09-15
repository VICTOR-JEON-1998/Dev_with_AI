import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/db';

function error(code: string, message: string, status = 400) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return error('UNAUTHORIZED', 'Unauthorized', 401);
  const memberships = await prisma.groupMember.findMany({
    where: { userId },
    include: { group: true },
  });
  return NextResponse.json({ groups: memberships.map((m) => ({ id: m.group.id, groupId: m.group.groupId, name: m.group.name })) });
}
