import seed from './seed/index';
import { PrismaClient } from '@prisma/client';
import { cleanupAll } from './seed/utils/cleanup';

async function main() {
  const prisma = new PrismaClient();
  try {
    // Clean up existing data first
    await cleanupAll(prisma, true);
    
    // Run the seeder
    await seed({ debug: true });
    
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
