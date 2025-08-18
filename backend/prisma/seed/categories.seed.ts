import { SeederContext } from './types';

export async function seedCategories({ prisma, debug = false }: SeederContext) {
  if (debug) console.log('🌱 Seeding categories...');

  await prisma.category.createMany({
    data: [
      { name: 'Mental Health', points: 10, isOnboardingPaymentRequired: false },
      { name: 'General Medicine', points: 5, isOnboardingPaymentRequired: false },
      { name: 'Surgery', points: 7, isOnboardingPaymentRequired: false },
    ],
    skipDuplicates: true,
  });

  const categories = await prisma.category.findMany();
  if (debug) console.log('✅ Categories seeded');
  return categories;
} 