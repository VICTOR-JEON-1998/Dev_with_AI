# Private Board (PB)

This repository contains a minimal full-stack example for the **Private Board** project.

## Backend
- Next.js (App Router) with TypeScript
- Prisma ORM with PostgreSQL
- JWT authentication (access + refresh tokens)
- Zod validation
- Seed script for demo data
- Docker Compose for local development

### Run
```sh
cd backend
npm install
npm run dev
```

## Frontend
- Flutter with Riverpod and go_router
- Basic sign-in screen and navigation

### Run
```sh
cd frontend
flutter run
```

## Postman Collection
See `backend/postman_collection.json` for example requests.
