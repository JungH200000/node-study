// e-commerce/prisma/seed.js
import { PrismaClient } from '../generated/prisma/index.js';
import { USERS, PRODUCTS, USER_PREFERENCES, ORDERS, ORDER_ITEMS } from './mock.js';

const prisma = new PrismaClient();

async function main() {
  // 1. 기존 데이터 삭제 (관계의 종속성을 고려하여 자식 테이블부터 삭제)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.userPreference.deleteMany();
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();
  console.log('🗑️ All existing data deleted.');

  // 2. 참조되는 데이터(부모) 먼저 생성
  await prisma.product.createMany({
    data: PRODUCTS,
    skipDuplicates: true,
  });
  console.log('📥 PRODUCTS seeded successfully.');

  // 3. 관계가 포함된 데이터 생성 (Promise.all + create)
  await Promise.all(
    USERS.map(async (user) => {
      await prisma.user.create({ data: user });
    })
  );
  console.log('📥 Users seeded successfully.');

  // 4. 나머지 데이터 순서대로 생성
  await prisma.userPreference.createMany({
    data: USER_PREFERENCES,
    skipDuplicates: true,
  });
  await prisma.order.createMany({
    data: ORDERS,
    skipDuplicates: true,
  });
  await prisma.orderItem.createMany({
    data: ORDER_ITEMS,
    skipDuplicates: true,
  });
  console.log('✅ All data seeded successfully!');
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
