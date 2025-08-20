import { SeederContext } from './types';

export async function seedAppointmentTypes(context: SeederContext) {
  const { prisma } = context;

  console.log('🌱 Seeding appointment types...');

  const appointmentTypes = [
    {
      id: 1,
      title: 'Consultation',
      statusKey: 'CONSULTATION',
      description: 'General medical consultation',
      isActive: true,
    },
    {
      id: 2,
      title: 'Procedure',
      statusKey: 'PROCEDURE',
      description: 'Medical procedure or treatment',
      isActive: true,
    },
    {
      id: 3,
      title: 'Video Consultation',
      statusKey: 'VIDEO_CONSULTATION',
      description: 'Remote video consultation',
      isActive: true,
    },
    {
      id: 4,
      title: 'Follow-up',
      statusKey: 'FOLLOW_UP',
      description: 'Follow-up appointment',
      isActive: true,
    },
    {
      id: 5,
      title: 'Emergency',
      statusKey: 'EMERGENCY',
      description: 'Emergency medical care',
      isActive: true,
    },
  ];

  for (const type of appointmentTypes) {
    await prisma.appointmentType.upsert({
      where: { id: type.id },
      update: type,
      create: type,
    });
  }

  console.log(`✅ Seeded ${appointmentTypes.length} appointment types`);
  return appointmentTypes;
}
