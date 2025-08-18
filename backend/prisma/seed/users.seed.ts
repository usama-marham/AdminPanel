import { faker } from '@faker-js/faker';
import { SeederContext } from './types';
import { range, pick } from './constants';
import * as bcrypt from 'bcrypt';

const hash = async (plain: string) => bcrypt.hash(plain, 10);

export async function seedUsers({ prisma, debug = false }: SeederContext) {
  if (debug) console.log('🌱 Seeding users...');

  // Agents
  const agentCount = 8;
  await Promise.all(
    range(agentCount).map(async () =>
      prisma.user.create({
        data: {
          email: faker.internet.email(),
          username: faker.internet.username().slice(0, 20),
          passwordHash: await hash('Password123!'),
          fullName: faker.person.fullName(),
          phone: faker.phone.number(),
          userTypeId: 3, // agent
          isActive: true,
        },
      }),
    ),
  );

  // Admin
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    create: {
      email: 'admin@example.com',
      username: 'admin',
      passwordHash: await hash('Admin123!'),
      fullName: 'System Admin',
      phone: faker.phone.number(),
      userTypeId: 4,
      isActive: true,
      isSystem: true,
    },
    update: {},
  });

  // Patient owners
  const patientCount = 320;
  const patientOwners = await Promise.all(
    range(patientCount).map(async () =>
      prisma.user.create({
        data: {
          email: faker.internet.email(),
          username: faker.internet.username().slice(0, 20),
          passwordHash: await hash('Password123!'),
          fullName: faker.person.fullName(),
          phone: faker.phone.number(),
          userTypeId: 1, // patient
          isActive: true,
        },
      }),
    ),
  );

  // Patients
  const patients = await Promise.all(
    patientOwners.map((owner) =>
      prisma.patient.create({
        data: {
          accountOwnerId: owner.id,
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          gender: pick(['male', 'female']),
          dateOfBirth: faker.date.birthdate({ min: 18, max: 75, mode: 'age' }),
          email: owner.email,
          phone: owner.phone ?? faker.phone.number(),
          city: faker.location.city(),
          country: 'Pakistan',
          emergencyContacts: { contacts: [] },
          consentEmail: true,
          consentSms: true,
          source: pick(['web', 'call-center', 'app']),
        },
      }),
    ),
  );

  if (debug) console.log('✅ Users seeded');
  return { patients };
} 