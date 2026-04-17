import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial 10 bays...');
  for (let i = 1; i <= 10; i++) {
    await prisma.bay.upsert({
      where: { id: i },
      update: {},
      create: { id: i, isAvailable: true },
    });
  }
  console.log('Successfully seeded 10 bays.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
