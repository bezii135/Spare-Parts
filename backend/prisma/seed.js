// prisma/seed.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');
  // Add any default data here, for example:
  await prisma.role.createMany({
    data: [
      { name: 'Admin', description: 'System Administrator' },
      { name: 'Sales', description: 'Salesperson' },
    ],
  });
  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
