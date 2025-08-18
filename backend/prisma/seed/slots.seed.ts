import { faker } from '@faker-js/faker';
import { Availability, DoctorPractice, AppointmentSlot } from '@prisma/client';
import { SeederContext } from './types';
import { SLOT_STATUS } from './constants';

interface SeedSlotsOptions {
  practices: DoctorPractice[];
  availabilities: Availability[];
}

export async function seedSlots(
  { prisma, debug = false }: SeederContext,
  { practices, availabilities }: SeedSlotsOptions,
) {
  if (debug) console.log('🌱 Seeding appointment slots...');

  const now = new Date();
  const startDay = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  const DAYS = 7;

  const availsByPractice = new Map();
  for (const p of practices) {
    availsByPractice.set(p.id.toString(), availabilities.filter(a => a.doctorPracticeId === p.id));
  }

  const slotsCreated: AppointmentSlot[] = [];
  for (const p of practices) {
    const avails = availsByPractice.get(p.id.toString());
    for (let d = 0; d < DAYS; d++) {
      const date = new Date(startDay);
      date.setUTCDate(startDay.getUTCDate() + d);
      const weekday = ((date.getUTCDay() + 6) % 7) + 1;
      const todays = avails.filter((a) => a.weekday === weekday);

      for (const a of todays) {
        if (!a.startTime || !a.endTime) continue;

        const startH = a.startTime.getUTCHours();
        const startM = a.startTime.getUTCMinutes();
        const endH = a.endTime.getUTCHours();
        const endM = a.endTime.getUTCMinutes();
        const totalMinutes = endH * 60 + endM - (startH * 60 + startM);
        const count = Math.floor(totalMinutes / (a.slotDurationMinutes || 30));

        for (let i = 0; i < count; i++) {
          const minutesFromStart = i * (a.slotDurationMinutes || 30);
          const slotStart = new Date(date);
          slotStart.setUTCHours(startH, startM + minutesFromStart, 0, 0);
          const slotEnd = new Date(slotStart);
          slotEnd.setUTCMinutes(slotEnd.getUTCMinutes() + (a.slotDurationMinutes || 30));

          const slot = await prisma.appointmentSlot.create({
            data: {
              doctorPracticeId: p.id,
              slotDate: new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())),
              startTs: slotStart,
              endTs: slotEnd,
              slotStatus: SLOT_STATUS.FREE,
              slotVersion: 1,
            },
          });
          slotsCreated.push(slot);
        }
      }
    }
  }

  if (debug) console.log(`→ Created ${slotsCreated.length} slots`);
  return slotsCreated;
} 