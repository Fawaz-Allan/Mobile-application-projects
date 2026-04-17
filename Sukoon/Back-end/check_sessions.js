import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function check() {
  const sessions = await prisma.session.findMany({ take: 5, orderBy: { id: 'desc' } });
  console.log('Last 5 sessions:', sessions);
}
check().finally(() => prisma.$disconnect());
