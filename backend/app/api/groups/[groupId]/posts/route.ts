import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/db';
import { postListQuerySchema, createPostSchema } from '../../../../../lib/validation';

function error(code: string, message: string, status = 400) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function GET(req: NextRequest, { params }: { params: { groupId: string } }) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return error('UNAUTHORIZED', 'Unauthorized', 401);
  const group = await prisma.group.findUnique({ where: { groupId: params.groupId } });
  if (!group) return error('NOT_FOUND', 'Group not found', 404);
  const membership = await prisma.groupMember.findUnique({ where: { userId_groupId: { userId, groupId: group.id } } });
  if (!membership) return error('FORBIDDEN', 'Not a member', 403);
  const { searchParams } = new URL(req.url);
  const parsed = postListQuerySchema.safeParse({
    cursor: searchParams.get('cursor'),
    limit: searchParams.get('limit'),
  });
  if (!parsed.success) return error('INVALID_QUERY', 'Invalid query');
  const { cursor, limit } = parsed.data;
  const posts = await prisma.post.findMany({
    where: { groupId: group.id, status: 'active' },
    orderBy: { createdAt: 'desc' },
    take: limit,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest, { params }: { params: { groupId: string } }) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return error('UNAUTHORIZED', 'Unauthorized', 401);
  const group = await prisma.group.findUnique({ where: { groupId: params.groupId } });
  if (!group) return error('NOT_FOUND', 'Group not found', 404);
  const membership = await prisma.groupMember.findUnique({ where: { userId_groupId: { userId, groupId: group.id } } });
  if (!membership) return error('FORBIDDEN', 'Not a member', 403);
  const json = await req.json().catch(() => null);
  const parsed = createPostSchema.safeParse(json);
  if (!parsed.success) return error('INVALID_BODY', 'Invalid request body');
  const post = await prisma.post.create({
    data: { groupId: group.id, authorId: userId, title: parsed.data.title, body: parsed.data.body },
  });
  return NextResponse.json(post, { status: 201 });
}
