import { faker } from '@faker-js/faker';
import { Availability, DoctorPractice } from '@prisma/client';
import { SeederContext } from './types';
import { timeOfDay } from './constants';

interface SeedAvailabilitiesOptions {
  practices: DoctorPractice[];
}

export async function seedAvailabilities(
  { prisma, debug = false }: SeederContext,
  { practices }: SeedAvailabilitiesOptions,
) {
  if (debug) console.log('🌱 Seeding availabilities...');

  const WEEKDAYS = [1, 3, 5]; // Mon, Wed, Fri
  const availabilities: Availability[] = [];

  for (const p of practices) {
    const days = faker.helpers.arrayElements(WEEKDAYS, 2);
    for (const d of days) {
      const availability = await prisma.availability.create({
        data: {
          doctorPracticeId: p.id,
          weekday: d,
          startTime: timeOfDay(10, 0),
          endTime: timeOfDay(14, 0),
          slotDurationMinutes: 30,
          isActive: true,
        },
      });
      availabilities.push(availability);
    }
  }

  if (debug) console.log('✅ Availabilities seeded');
  return availabilities;
} 