import { SeederContext } from './types';

export async function seedAppointmentProbabilities(context: SeederContext) {
  const { prisma } = context;

  console.log('🌱 Seeding appointment probabilities...');

  const probabilities = [
    {
      id: 1,
      name: 'Confirmed',
      statusKey: 'CONFIRMED',
      description: 'Appointment is confirmed by the patient',
    },
    {
      id: 2,
      name: 'May Be',
      statusKey: 'MAY_BE',
      description: 'Patient is unsure about the appointment',
    },
    {
      id: 3,
      name: 'No Response',
      statusKey: 'NO_RESPONSE',
      description: 'Patient has not responded to appointment request',
    },
    {
      id: 4,
      name: 'Call Done',
      statusKey: 'CALL_DONE',
      description: 'Follow-up call has been completed',
    },
    {
      id: 5,
      name: 'Address Lead',
      statusKey: 'ADDRESS_LEAD',
      description: 'Lead has been addressed and processed',
    },
    {
      id: 6,
      name: 'Callback Required',
      statusKey: 'CALLBACK_REQUIRED',
      description: 'Patient requires a callback',
    },
  ];

  for (const probability of probabilities) {
    await prisma.appointmentProbability.upsert({
      where: { id: probability.id },
      update: probability,
      create: probability,
    });
  }

  console.log(`✅ Seeded ${probabilities.length} appointment probabilities`);
  return probabilities;
}
