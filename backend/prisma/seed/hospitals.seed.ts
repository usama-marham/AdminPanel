import { faker } from '@faker-js/faker';
import { SeederContext } from './types';
import { range } from './constants';

export async function seedHospitals({ prisma, debug = false }: SeederContext) {
  if (debug) console.log('🌱 Seeding hospitals...');

  const hospitalCount = 8;
  const hospitals = await Promise.all(
    range(hospitalCount).map(() =>
      prisma.hospital.create({
        data: {
          name: `${faker.company.name()} Medical Center`,
          city: faker.location.city(),
          address: faker.location.streetAddress(),
          lat: faker.location.latitude(),
          lng: faker.location.longitude(),
          phone: faker.phone.number(),
          type: faker.number.int({ min: 1, max: 3 }),
        },
      }),
    ),
  );

  if (debug) console.log('✅ Hospitals seeded');
  return hospitals;
} 