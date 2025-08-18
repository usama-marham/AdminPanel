import { SeederContext } from './types';
import { MH_SPECIALITIES } from './constants';

export async function seedSpecialities({ prisma, debug = false }: SeederContext) {
  if (debug) console.log('🌱 Seeding specialities...');

  await prisma.speciality.createMany({
    data: [
      ...MH_SPECIALITIES.map((s) => ({ name: s.name, slug: s.slug })),
      { name: 'Cardiology', slug: 'cardiology' },
      { name: 'Dermatology', slug: 'dermatology' },
    ],
    skipDuplicates: true,
  });

  const allSpecs = await prisma.speciality.findMany();
  const mhSpecs = allSpecs.filter((s) =>
    MH_SPECIALITIES.some((m) => m.slug === s.slug),
  );

  if (debug) console.log('✅ Specialities seeded');
  return { allSpecs, mhSpecs };
} 