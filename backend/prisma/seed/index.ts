import { PrismaClient } from '@prisma/client';
import { SeederOptions } from './types';
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

export async function seed(options: SeederOptions = {}) {
  const prisma = new PrismaClient();
  const context = { prisma, debug: options.debug };

  try {
    // 1. Base data
    await seedUserTypes(context);
    await seedAppointmentStatuses(context);
    const categories = await seedCategories(context);
    const { allSpecs, mhSpecs } = await seedSpecialities(context);
    const hospitals = await seedHospitals(context);

    // 2. Users and doctors
    const doctors = await seedDoctors(context, { categories, mhSpecs, allSpecs });
    const { patients } = await seedUsers(context);

    // 3. Practices and scheduling
    const practices = await seedPractices(context, { doctors, hospitals });
    const availabilities = await seedAvailabilities(context, { practices });
    const slots = await seedSlots(context, { practices, availabilities });

    // 4. Appointments
    await seedAppointments(context, { slots, patients });

    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export default seed; 