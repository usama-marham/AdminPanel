import { PrismaClient } from '@prisma/client';
import { SeederOptions } from './types';
import { seedUserTypes } from './user_types.seed';
import { seedAppointmentStatuses } from './appointment_statuses.seed';
import { seedAppointmentTypes } from './appointment_types.seed';
import { seedPaymentStatuses } from './payment_statuses.seed';
import { seedAppointmentProbabilities } from './appointment_probabilities.seed';
import { seedCategories } from './categories.seed';
import { seedSpecialities } from './specialities.seed';
import { seedHospitals } from './hospitals.seed';
import { seedDoctors } from './doctors.seed';
import { seedDoctorSpecialities } from './doctor_specialities.seed';
import { seedUsers } from './users.seed';
import { seedPractices } from './practices.seed';
import { seedAvailabilities } from './availabilities.seed';
import { seedSlots } from './slots.seed';
import { seedAppointments } from './appointments.seed';
import { seedReviews } from './reviews.seed';
import { seedMessageLogs } from './message_logs.seed';

export async function seed(options: SeederOptions = {}) {
  const prisma = new PrismaClient();
  const context = { prisma, debug: options.debug };
  console.log('enetered the index.ts file');

  try {
    // 1. Base data
    await seedUserTypes(context);
    await seedAppointmentStatuses(context);
    await seedAppointmentTypes(context);
    await seedPaymentStatuses(context);
    await seedAppointmentProbabilities(context);
    const categories = await seedCategories(context);
    const { allSpecs, mhSpecs } = await seedSpecialities(context);
    const hospitals = await seedHospitals(context);

    // 2. Users and doctors
    const doctors = await seedDoctors(context, {
      categories,
      mhSpecs,
      allSpecs,
    });
    await seedDoctorSpecialities(context, { doctors, specialities: allSpecs });
    const { patients } = await seedUsers(context);

    // 3. Practices and scheduling
    const practices = await seedPractices(context, { doctors, hospitals });
    const availabilities = await seedAvailabilities(context, { practices });
    const slots = await seedSlots(context, { practices, availabilities });

    // 4. Appointments
    const appointments = await seedAppointments(context, { slots, patients });

    // 5. Reviews
    await seedReviews(context, { doctors, users: patients });

    // 6. Message logs (optional - for testing messaging features)
    await seedMessageLogs(context, { appointments, users: patients });

    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export default seed;

// Execute seeding if this file is run directly
if (require.main === module) {
  seed({ debug: true }).catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
}
