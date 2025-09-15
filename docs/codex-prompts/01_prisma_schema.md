# Prompt: Design Prisma Schema

You are a senior data modeler + Prisma expert.
Design a Prisma schema for PB with PostgreSQL.

## Entities
- User: id, email(unique), passwordHash, displayName, createdAt, updatedAt
- Group: id, groupId(unique), groupPw (hashed), name, description, createdAt, updatedAt
- Membership: userId, groupId, role (ADMIN|MEMBER), joinedAt
- Post: id, groupId, authorId, title, body, isDeleted, createdAt, updatedAt
- Comment: id, postId, authorId, body, isDeleted, createdAt, updatedAt

## Requirements
- Group creator = Membership.ADMIN
- Soft delete posts/comments
- Indexes: email, groupId, (membership userId+groupId), etc.

## Output
1. `schema.prisma`
2. Example seed script
3. Migration notes
