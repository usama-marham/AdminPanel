import { PrismaClient } from '@prisma/client';
import { cleanupAll, cleanupModel } from './utils/cleanup';
import { seedUserTypes } from './user_types.seed';
import { seedAppointmentStatuses } from './appointment_statuses.seed';
import { seedCategories } from './categories.seed';
import { seedSpecialities } from './specialities.seed';
import { seedHospitals } from './hospitals.seed';
import { seedDoctors } from './doctors.seed';
import { seedUsers } from './users.seed';
import { seedPractices } from './practices.seed';
import { seedAvailabilities } from './availabilities.seed';
import { seedSlots } from './slots.seed';
import { seedAppointments } from './appointments.seed';
import { SeederContext } from './types';

// Define the seeder names first
const SEEDER_NAMES = [
  'user_types',
  'appointment_statuses',
  'categories',
  'specialities',
  'hospitals',
  'doctors',
  'users',
  'practices',
  'availabilities',
  'slots',
  'appointments',
] as const;

type SeederName = typeof SEEDER_NAMES[number];

type SeederFunction = (context: SeederContext, ...args: any[]) => Promise<any>;

const SEEDERS: Record<SeederName, SeederFunction> = {
  'user_types': seedUserTypes,
  'appointment_statuses': seedAppointmentStatuses,
  categories: seedCategories,
  specialities: seedSpecialities,
  hospitals: seedHospitals,
  doctors: seedDoctors,
  users: seedUsers,
  practices: seedPractices,
  availabilities: seedAvailabilities,
  slots: seedSlots,
  appointments: seedAppointments,
};

const MODEL_MAP: Record<SeederName, string> = {
  'user_types': 'userType',
  'appointment_statuses': 'appointmentStatus',
  categories: 'category',
  specialities: 'speciality',
  hospitals: 'hospital',
  doctors: 'doctor',
  users: 'user',
  practices: 'doctorPractice',
  availabilities: 'availability',
  slots: 'appointmentSlot',
  appointments: 'appointment',
};

async function runSeeder(name: SeederName, prisma: PrismaClient, debug = true) {
  const modelName = MODEL_MAP[name];
  
  // Clean up the specific model first
  await cleanupModel(prisma, modelName, debug);
  
  // Run the seeder
  try {
    const context = { prisma, debug };
    const seeder = SEEDERS[name];
    
    // Special handling for seeders that need additional data
    switch (name) {
      case 'doctors': {
        const categories = await seedCategories(context);
        const { allSpecs, mhSpecs } = await seedSpecialities(context);
        await seeder(context, { categories, mhSpecs, allSpecs });
        break;
      }
      case 'practices': {
        const categories = await seedCategories(context);
        const { allSpecs, mhSpecs } = await seedSpecialities(context);
        const hospitals = await seedHospitals(context);
        const doctors = await seedDoctors(context, { categories, mhSpecs, allSpecs });
        await seeder(context, { doctors, hospitals });
        break;
      }
      case 'availabilities': {
        const categories = await seedCategories(context);
        const { allSpecs, mhSpecs } = await seedSpecialities(context);
        const hospitals = await seedHospitals(context);
        const doctors = await seedDoctors(context, { categories, mhSpecs, allSpecs });
        const practices = await seedPractices(context, { doctors, hospitals });
        await seeder(context, { practices });
        break;
      }
      case 'slots': {
        const categories = await seedCategories(context);
        const { allSpecs, mhSpecs } = await seedSpecialities(context);
        const hospitals = await seedHospitals(context);
        const doctors = await seedDoctors(context, { categories, mhSpecs, allSpecs });
        const practices = await seedPractices(context, { doctors, hospitals });
        const availabilities = await seedAvailabilities(context, { practices });
        await seeder(context, { practices, availabilities });
        break;
      }
      case 'appointments': {
        const categories = await seedCategories(context);
        const { allSpecs, mhSpecs } = await seedSpecialities(context);
        const hospitals = await seedHospitals(context);
        const doctors = await seedDoctors(context, { categories, mhSpecs, allSpecs });
        const { patients } = await seedUsers(context);
        const practices = await seedPractices(context, { doctors, hospitals });
        const availabilities = await seedAvailabilities(context, { practices });
        const slots = await seedSlots(context, { practices, availabilities });
        await seeder(context, { slots, patients });
        break;
      }
      default:
        await seeder(context);
    }
    
    console.log(`✅ Seeder '${name}' completed successfully`);
  } catch (error) {
    console.error(`❌ Seeder '${name}' failed:`, error);
    throw error;
  }
}

async function main() {
  const prisma = new PrismaClient();
  const args = process.argv.slice(2);
  const command = args[0];
  const seederName = args[1] as SeederName;

  try {
    switch (command) {
      case 'clean':
        if (seederName && seederName in MODEL_MAP) {
          await cleanupModel(prisma, MODEL_MAP[seederName], true);
        } else {
          await cleanupAll(prisma, true);
        }
        break;

      case 'seed':
        if (seederName && seederName in SEEDERS) {
          await runSeeder(seederName, prisma, true);
        } else {
          console.error('Please specify a valid seeder name:', SEEDER_NAMES.join(', '));
          process.exit(1);
        }
        break;

      default:
        console.error(`
Usage:
  npm run seed:cli clean [seeder]  - Clean all data or specific seeder data
  npm run seed:cli seed <seeder>   - Run a specific seeder

Available seeders:
  ${SEEDER_NAMES.join('\n  ')}
`);
        process.exit(1);
    }
  } catch (error) {
    console.error('Operation failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 