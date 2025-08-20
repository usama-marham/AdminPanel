import { faker } from '@faker-js/faker';
import { SeederContext } from './types';
import { pick } from './constants';

interface SeedDoctorSpecialitiesOptions {
  doctors: any[];
  specialities: any[];
}

export async function seedDoctorSpecialities(
  { prisma, debug = false }: SeederContext,
  { doctors, specialities }: SeedDoctorSpecialitiesOptions,
) {
  if (debug) console.log('🌱 Seeding doctor specialities...');

  const doctorSpecialities: any[] = [];
  
  // Each doctor gets 1-3 additional specialities beyond their main one
  for (const doctor of doctors) {
    const numSpecialities = faker.number.int({ min: 1, max: 3 });
    const availableSpecialities = specialities.filter(s => s.id !== doctor.mainSpecialityId);
    const selectedSpecialities = faker.helpers.arrayElements(availableSpecialities, numSpecialities);

    for (const speciality of selectedSpecialities) {
      const doctorSpeciality = await prisma.doctorSpeciality.create({
        data: {
          doctorId: doctor.id,
          specialityId: speciality.id,
        },
      });
      doctorSpecialities.push(doctorSpeciality);
    }
  }

  if (debug) console.log(`✅ Seeded ${doctorSpecialities.length} doctor specialities`);
  return doctorSpecialities;
}
