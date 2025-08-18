import { SeederContext } from './types';

export async function seedUserTypes({ prisma, debug = false }: SeederContext) {
  if (debug) console.log('🌱 Seeding user types...');

  await prisma.userType.createMany({
    data: [
      { id: 1, typeName: 'patient' },
      { id: 2, typeName: 'doctor' },
      { id: 3, typeName: 'agent' },
      { id: 4, typeName: 'admin' },
    ],
    skipDuplicates: true,
  });

  if (debug) console.log('✅ User types seeded');
} 