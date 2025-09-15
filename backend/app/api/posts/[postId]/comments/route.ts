import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/db';
import { postListQuerySchema, createCommentSchema } from '../../../../../lib/validation';

function error(code: string, message: string, status = 400) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function GET(req: NextRequest, { params }: { params: { postId: string } }) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return error('UNAUTHORIZED', 'Unauthorized', 401);
  const post = await prisma.post.findUnique({ where: { id: params.postId } });
  if (!post || post.status !== 'active') return error('NOT_FOUND', 'Not found', 404);
  const membership = await prisma.groupMember.findUnique({ where: { userId_groupId: { userId, groupId: post.groupId } } });
  if (!membership) return error('FORBIDDEN', 'Not a member', 403);
  const { searchParams } = new URL(req.url);
  const parsed = postListQuerySchema.safeParse({
    cursor: searchParams.get('cursor'),
    limit: searchParams.get('limit'),
  });
  if (!parsed.success) return error('INVALID_QUERY', 'Invalid query');
  const { cursor, limit } = parsed.data;
  const comments = await prisma.comment.findMany({
    where: { postId: post.id, status: 'active' },
    orderBy: { createdAt: 'asc' },
    take: limit,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });
  return NextResponse.json({ comments });
}

export async function POST(req: NextRequest, { params }: { params: { postId: string } }) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return error('UNAUTHORIZED', 'Unauthorized', 401);
  const post = await prisma.post.findUnique({ where: { id: params.postId } });
  if (!post || post.status !== 'active') return error('NOT_FOUND', 'Not found', 404);
  const membership = await prisma.groupMember.findUnique({ where: { userId_groupId: { userId, groupId: post.groupId } } });
  if (!membership) return error('FORBIDDEN', 'Not a member', 403);
  const json = await req.json().catch(() => null);
  const parsed = createCommentSchema.safeParse(json);
  if (!parsed.success) return error('INVALID_BODY', 'Invalid request body');
  const comment = await prisma.comment.create({
    data: { postId: post.id, authorId: userId, body: parsed.data.body },
  });
  return NextResponse.json(comment, { status: 201 });
}
