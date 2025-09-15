import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';
import { updateCommentSchema } from '../../../../lib/validation';

function error(code: string, message: string, status = 400) {
  return NextResponse.json({ error: { code, message } }, { status });
}

async function authorize(userId: string, commentId: string) {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment || comment.status !== 'active') return { error: 'NOT_FOUND' } as const;
  const post = await prisma.post.findUnique({ where: { id: comment.postId } });
  if (!post) return { error: 'NOT_FOUND' } as const;
  const group = await prisma.group.findUnique({ where: { id: post.groupId } });
  if (!group) return { error: 'NOT_FOUND' } as const;
  if (comment.authorId !== userId && post.authorId !== userId && group.adminId !== userId) {
    return { error: 'FORBIDDEN' } as const;
  }
  return { comment } as const;
}

export async function PATCH(req: NextRequest, { params }: { params: { commentId: string } }) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return error('UNAUTHORIZED', 'Unauthorized', 401);
  const auth = await authorize(userId, params.commentId);
  if ('error' in auth) return error(auth.error, 'Not allowed', auth.error === 'NOT_FOUND' ? 404 : 403);
  const json = await req.json().catch(() => null);
  const parsed = updateCommentSchema.safeParse(json);
  if (!parsed.success) return error('INVALID_BODY', 'Invalid request body');
  const updated = await prisma.comment.update({ where: { id: params.commentId }, data: parsed.data });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: { commentId: string } }) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return error('UNAUTHORIZED', 'Unauthorized', 401);
  const auth = await authorize(userId, params.commentId);
  if ('error' in auth) return error(auth.error, 'Not allowed', auth.error === 'NOT_FOUND' ? 404 : 403);
  await prisma.comment.update({ where: { id: params.commentId }, data: { status: 'deleted' } });
  return NextResponse.json({ deleted: true });
}
