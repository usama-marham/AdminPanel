import { faker } from '@faker-js/faker';
import { Category, Doctor, Speciality } from '@prisma/client';
import { SeederContext } from './types';
import { pick, range } from './constants';
import * as bcrypt from 'bcrypt';

const hash = async (plain: string) => bcrypt.hash(plain, 10);

interface SeedDoctorsOptions {
  categories: Category[];
  mhSpecs: Speciality[];
  allSpecs: Speciality[];
}

export async function seedDoctors(
  { prisma, debug = false }: SeederContext,
  { categories, mhSpecs, allSpecs }: SeedDoctorsOptions,
) {
  if (debug) console.log('🌱 Seeding doctors...');

  const doctorCount = 22;
  const doctors: Doctor[] = await Promise.all(
    range(doctorCount).map(async (i) => {
      const isMentalHealth = i < Math.ceil(doctorCount * 0.7); // ~70% MH doctors
      const mainSpec = isMentalHealth ? pick(mhSpecs) : pick(allSpecs);
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const name = `Dr. ${firstName} ${lastName}`;

      const doctor = await prisma.doctor.create({
        data: {
          name,
          email: faker.internet.email(),
          phone: faker.phone.number(),
          bio: faker.lorem.sentences({ min: 2, max: 4 }),
          profilePicUrl: faker.image.avatar(),
          dateOfExperience: faker.date.past({ years: 10 }),
          pmdcNumber: faker.string.alphanumeric({ length: 8 }),
          mainSpecialityId: mainSpec.id,
          categoryId: pick(categories).id,
        },
      });

      // Create linked Doctor User
      await prisma.user.create({
        data: {
          email: faker.internet.email(),
          username: faker.internet.username().slice(0, 20),
          passwordHash: await hash('Password123!'),
          fullName: name,
          phone: faker.phone.number(),
          userTypeId: 2, // doctor
          isActive: true,
          doctorId: doctor.id,
        },
      });

      return doctor;
    }),
  );

  if (debug) console.log('✅ Doctors seeded');
  return doctors;
} 