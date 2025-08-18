import { faker } from '@faker-js/faker';
import { Appointment, AppointmentSlot, Patient } from '@prisma/client';
import { SeederContext } from './types';
import { APPT_STATUS, PAYMENT_STATUS, SLOT_STATUS, pick } from './constants';

interface SeedAppointmentsOptions {
  slots: AppointmentSlot[];
  patients: Patient[];
}

export async function seedAppointments(
  { prisma, debug = false }: SeederContext,
  { slots, patients }: SeedAppointmentsOptions,
) {
  if (debug) console.log('🌱 Seeding appointments...');

  const bookable = faker.helpers.arrayElements(
    slots,
    Math.floor(slots.length * 0.35),
  );

  const appointments: Appointment[] = [];
  for (const s of bookable) {
    const status = pick([
      APPT_STATUS.IN_PROCESS,
      APPT_STATUS.SCHEDULED,
      APPT_STATUS.SHOWED_UP,
      APPT_STATUS.CANCELLED,
      APPT_STATUS.PATIENT_NO_SHOW,
    ]);
    const patient = pick(patients);
    const fee = faker.number.int({ min: 1500, max: 6000 });
    const discount = faker.number.int({ min: 0, max: 1000 });

    const appointment = await prisma.appointment.create({
      data: {
        slotId: s.id,
        doctorPracticeId: s.doctorPracticeId,
        patientId: patient.id,
        status,
        fee,
        discount,
        paymentStatus: status === APPT_STATUS.SHOWED_UP ? PAYMENT_STATUS.PAID : PAYMENT_STATUS.UNPAID,
      },
    });
    appointments.push(appointment);

    await prisma.appointmentSlot.update({
      where: { id: s.id },
      data: {
        slotStatus: status === APPT_STATUS.CANCELLED ? SLOT_STATUS.CANCELLED : SLOT_STATUS.BOOKED,
      },
    });
  }

  if (debug) console.log('✅ Appointments seeded');
  return appointments;
} 