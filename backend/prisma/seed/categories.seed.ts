import { SeederContext } from './types';

export async function seedCategories({ prisma, debug = false }: SeederContext) {
  if (debug) console.log('🌱 Seeding categories...');

  await prisma.category.createMany({
    data: [
      { name: 'Mental Health', isOnboardingPaymentRequired: false },
      { name: 'General Medicine', isOnboardingPaymentRequired: false },
      { name: 'Surgery', isOnboardingPaymentRequired: false },
    ],
    skipDuplicates: true,
  });

  const categories = await prisma.category.findMany();
  if (debug) console.log('✅ Categories seeded');
  return categories;
} 