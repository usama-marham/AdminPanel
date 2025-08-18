import { SeederContext } from './types';
import { APPT_STATUS } from './constants';

export async function seedAppointmentStatuses({ prisma, debug = false }: SeederContext) {
  if (debug) console.log('🌱 Seeding appointment statuses...');

  for (const [key, id] of Object.entries(APPT_STATUS)) {
    await prisma.appointmentStatus.upsert({
      where: { id },
      create: {
        id,
        statusKey: key,
        title: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' '),
        description: `${key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')} status`,
        isActive: true,
      },
      update: {},
    });
  }

  if (debug) console.log('✅ Appointment statuses seeded');
} 