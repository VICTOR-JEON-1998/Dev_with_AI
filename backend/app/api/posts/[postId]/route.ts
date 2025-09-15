import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';
import { updatePostSchema } from '../../../../lib/validation';

function error(code: string, message: string, status = 400) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function GET(req: NextRequest, { params }: { params: { postId: string } }) {
  const post = await prisma.post.findFirst({ where: { id: params.postId, status: 'active' } });
  if (!post) return error('NOT_FOUND', 'Not found', 404);
  return NextResponse.json(post);
}

export async function PATCH(req: NextRequest, { params }: { params: { postId: string } }) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return error('UNAUTHORIZED', 'Unauthorized', 401);
  const post = await prisma.post.findUnique({ where: { id: params.postId } });
  if (!post || post.status !== 'active') return error('NOT_FOUND', 'Not found', 404);
  const group = await prisma.group.findUnique({ where: { id: post.groupId } });
  if (!group) return error('NOT_FOUND', 'Not found', 404);
  const membership = await prisma.groupMember.findUnique({ where: { userId_groupId: { userId, groupId: group.id } } });
  if (!membership) return error('FORBIDDEN', 'Not a member', 403);
  if (post.authorId !== userId && group.adminId !== userId) return error('FORBIDDEN', 'Forbidden', 403);
  const json = await req.json().catch(() => null);
  const parsed = updatePostSchema.safeParse(json);
  if (!parsed.success) return error('INVALID_BODY', 'Invalid request body');
  const updated = await prisma.post.update({ where: { id: post.id }, data: parsed.data });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: { postId: string } }) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return error('UNAUTHORIZED', 'Unauthorized', 401);
  const post = await prisma.post.findUnique({ where: { id: params.postId } });
  if (!post) return error('NOT_FOUND', 'Not found', 404);
  const group = await prisma.group.findUnique({ where: { id: post.groupId } });
  if (!group) return error('NOT_FOUND', 'Not found', 404);
  const membership = await prisma.groupMember.findUnique({ where: { userId_groupId: { userId, groupId: group.id } } });
  if (!membership) return error('FORBIDDEN', 'Not a member', 403);
  if (post.authorId !== userId && group.adminId !== userId) return error('FORBIDDEN', 'Forbidden', 403);
  await prisma.post.update({ where: { id: post.id }, data: { status: 'deleted' } });
  return NextResponse.json({ deleted: true });
}
