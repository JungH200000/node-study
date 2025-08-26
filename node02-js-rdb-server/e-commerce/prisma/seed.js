// e-commerce/seed.js
import { PrismaClient } from '../generated/prisma/index.js';
import { USERS, PRODUCTS } from './mock.js';

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();
  console.log('🗑️  All users deleted.');

  // mock 데이터 삽입
  await prisma.user.createMany({
    data: USERS,
    skipDuplicates: true,
  });
  await prisma.product.createMany({
    data: PRODUCTS,
    skipDuplicates: true,
  });
  console.log('📥 Users seeded successfully.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
