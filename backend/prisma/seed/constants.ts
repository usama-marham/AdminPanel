import { faker } from '@faker-js/faker';

// Appointment status IDs
export const APPT_STATUS = {
  IN_PROCESS: 1,
  SCHEDULED: 2,
  CANCELLED: 3,
  DOCTOR_NOT_RESPONDING: 4,
  DATA_INCORRECT: 5,
  DOCTOR_NOT_AVAILABLE: 6,
  INQUIRY: 7,
  SHOWED_UP: 8,
  OTHER: 9,
  PATIENT_NO_SHOW: 10,
  PATIENT_NOT_RESPONDING: 11,
  DOCTOR_NO_SHOW: 12,
  CASE_DECLINED: 13,
  DOCTOR_NO_SHOW_ALT: 14,
  POWERED_OFF: 15,
  NO_SHOW_BILLING: 16,
  DUPLICATE: 17,
  CANCELLED_BY_DOCTOR: 18,
} as const;

export const PAYMENT_STATUS = {
  UNPAID: 1,
  PAID: 2,
  EVIDENCE_RECEIVED: 3,
  PENDING: 4,
  TO_BE_REFUNDED: 5,
  REFUNDED: 6,
} as const;

export const APPOINTMENT_PROBABILITY = {
  CONFIRMED: 1,
  MAY_BE: 2,
  NO_RESPONSE: 3,
  CALL_DONE: 4,
  ADDRESS_LEAD: 5,
  CALLBACK_REQUIRED: 6,
} as const;

export const SLOT_STATUS = {
  FREE: 0,
  HELD: 1,
  BOOKED: 2,
  CANCELLED: 3,
} as const;

// Mental Health specialities
export const MH_SPECIALITIES = [
  { name: 'Psychologist', slug: 'psychologist' },
  { name: 'Psychiatrist', slug: 'psychiatrist' },
  { name: 'Neuro-Psychiatrist', slug: 'neuro-psychiatrist' },
  { name: 'Child Psychologist', slug: 'child-psychologist' },
  { name: 'Counselor', slug: 'counselor' },
];

// Helper functions
export const range = (n: number) => Array.from({ length: n }, (_, i) => i);
export const pick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
export const isoDate = (y: number, m: number, d: number) =>
  new Date(Date.UTC(y, m, d));
export const timeOfDay = (h: number, m = 0) => new Date(Date.UTC(1970, 0, 1, h, m, 0)); 