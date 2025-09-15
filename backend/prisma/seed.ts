import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@pb.com' },
    update: {},
    create: {
      email: 'demo@pb.com',
      password
    }
  });

  const group = await prisma.group.upsert({
    where: { groupId: 'demo' },
    update: {},
    create: {
      groupId: 'demo',
      groupPw: await bcrypt.hash('demopw', 10),
      admin: { connect: { id: user.id } }
    }
  });

  await prisma.groupMember.upsert({
    where: { id: `${user.id}-${group.id}` },
    update: {},
    create: {
      id: `${user.id}-${group.id}`,
      userId: user.id,
      groupId: group.id,
      role: 'admin'
    }
  });

  await prisma.post.create({
    data: {
      groupId: group.id,
      authorId: user.id,
      content: 'Welcome to the demo group!'
    }
  });
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
