# Prompt: Backend API (Next.js + Prisma)

You are a senior TypeScript backend engineer.

## Endpoints
- Auth: signup, signin, refresh, signout
- Group: check-id, create, join, list my groups
- Post: list by group (cursor pagination), create, get detail, edit/delete
- Comment: list by post, create, edit/delete

## Non-functional
- JWT auth middleware
- Zod validation
- Error format {error:{code,message}}
- Prisma transactions
- Logging

## Output
- Route handlers (`/app/api/.../route.ts`)
- `lib/auth.ts`, `lib/db.ts`, `lib/validation.ts`
- `.env.example`
- Jest tests + Postman collection
