import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function check() {
  const bays = await prisma.bay.findMany();
  console.log('Bays in DB:', bays);
  const count = await prisma.bay.count({ where: { isAvailable: true } });
  console.log('Available bays count:', count);
}
check().finally(() => prisma.$disconnect());
