import { faker } from '@faker-js/faker';
import { Doctor, DoctorPractice, Hospital } from '@prisma/client';
import { SeederContext } from './types';
import { isoDate } from './constants';

interface SeedPracticesOptions {
  doctors: Doctor[];
  hospitals: Hospital[];
}

export async function seedPractices(
  { prisma, debug = false }: SeederContext,
  { doctors, hospitals }: SeedPracticesOptions,
) {
  if (debug) console.log('🌱 Seeding doctor practices...');

  const practices: DoctorPractice[] = [];
  for (const doc of doctors) {
    const count = faker.number.int({ min: 1, max: 2 });
    const chosen = faker.helpers.arrayElements(hospitals, count);
    for (const hosp of chosen) {
      const practice = await prisma.doctorPractice.create({
        data: {
          doctorId: doc.id,
          hospitalId: hosp.id,
          practiceSlug: faker.helpers.slugify(`${doc.name}-${hosp.name}`).slice(0, 48),
          profileSlug: `/doctors/${faker.helpers.slugify(doc.name ?? `doc-${doc.id}`)}`,
          consultationFee: faker.number.int({ min: 1500, max: 6000 }),
          discountFee: faker.number.int({ min: 0, max: 1000 }),
          appointmentPolicy: { maxLateMinutes: 10, rescheduleWindowHours: 4 },
          patientsPerHour: 2,
          avgTimePerPatientMinutes: 30,
          onPanel: faker.datatype.boolean(),
          consultancyReferralPercent: faker.number.int({ min: 0, max: 20 }),
          activeFrom: isoDate(2024, 0, 1),
        },
      });
      practices.push(practice);
    }
  }

  if (debug) console.log('✅ Doctor practices seeded');
  return practices;
} 