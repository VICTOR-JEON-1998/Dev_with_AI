import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().min(1),
});

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const checkGroupIdSchema = z.object({
  groupId: z.string().min(3),
});

export const createGroupSchema = z.object({
  groupId: z.string().min(3),
  groupPw: z.string().min(6),
  name: z.string().min(1),
  description: z.string().optional(),
});

export const joinGroupSchema = z.object({
  groupId: z.string().min(3),
  groupPw: z.string().min(6),
});

export const postListQuerySchema = z.object({
  cursor: z.string().nullish(),
  limit: z.coerce.number().min(1).max(50).default(20),
});

export const createPostSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
});

export const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  body: z.string().min(1).optional(),
});

export const createCommentSchema = z.object({
  body: z.string().min(1),
});

export const updateCommentSchema = z.object({
  body: z.string().min(1).optional(),
});
