import { Appointment, AppointmentStatus, Channel, ConfirmationType, Doctor, DoctorPAStatus, Hospital, Patient, Specialty, VisitType } from '../lib/types/appointments';
import { addHours, addMinutes, subDays, subHours } from 'date-fns';

// Helper to generate random items from an array
const randomFrom = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

// Mock data pools
const doctors: Doctor[] = [
  { id: 'd1', name: 'Dr. Sarah Ahmed', specialty: 'PSYCHOLOGIST' },
  { id: 'd2', name: 'Dr. Amir Khan', specialty: 'PSYCHIATRIST' },
  { id: 'd3', name: 'Dr. Fatima Hassan', specialty: 'NEURO_PSYCHIATRIST' },
  { id: 'd4', name: 'Dr. Zainab Ali', specialty: 'CHILD_PSYCHOLOGIST' },
  { id: 'd5', name: 'Dr. Omar Malik', specialty: 'COUNSELOR' },
];

const hospitals: Hospital[] = [
  { id: 'h1', name: 'Mind Care Center', location: 'Karachi' },
  { id: 'h2', name: 'Wellness Hospital', location: 'Lahore' },
  { id: 'h3', name: 'Mental Health Institute', location: 'Islamabad' },
];

const patientTypes: VisitType[] = ['FIRST_VISIT', 'FOLLOW_UP', 'CORPORATE'];
const channels: Channel[] = ['OC', 'PHYSICAL'];
const confirmationTypes: ConfirmationType[] = ['APP', 'CALL', 'SMS', 'NONE'];

const appointmentStatuses = [
  "In Process",
  "Scheduled",
  "Cancelled",
  "Doctor Not Responding",
  "Data Incorrect",
  "Doctor Not Available",
  "Inquiry",
  "Showed up",
  "Other",
  "Patient - Not Showed up",
  "Patient Not Responding",
  "Doctor - Not Showed Up",
  "Case Declined",
  "Not Showed-up By Doctor",
  "Powered Off",
  "Not Showed up-Billing",
  "Duplicate",
];

const paymentStatuses = [
  "Unpaid",
  "Paid",
  "Evidence Received",
  "Pending",
  "To Be Refund",
  "Refunded",
];

// Generate a deterministic set of appointments
export const generateMockAppointments = (count: number = 250): Appointment[] => {
  const appointments: Appointment[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const time = addHours(subDays(now, Math.floor(Math.random() * 7)), Math.floor(Math.random() * 24));
    const doctor = randomFrom(doctors);
    const hospital = randomFrom(hospitals);
    const type = randomFrom(patientTypes);
    const channel = randomFrom(channels);
    const confirmationType = randomFrom(confirmationTypes);

    const appointment: Appointment = {
      id: `app-${i + 1}`,
      patient: {
        id: `p${i + 1}`,
        name: `Patient ${i + 1}`,
        phone: `+92${Math.floor(Math.random() * 1000000000)}`,
        type,
        tags: Math.random() > 0.7 ? ['VIP', 'Corporate'] : undefined,
      },
      doctor,
      hospital,
      time: time.toISOString(),
      feePKR: Math.floor(Math.random() * 5000) + 2000,
      channel,
      travel: Math.random() > 0.5 ? 'LOCAL' : 'REMOTE',
      appointmentStatus: appointmentStatuses[0], // Set default to first value
      paymentStatus: paymentStatuses[0], // Set default to first value
      doctorPAConfirmation: randomFrom(['CONFIRMED', 'NOT_CONFIRMED', 'UNKNOWN'] as DoctorPAStatus[]),
      confirmation: {
        type: confirmationType,
        elapsedMinutes: Math.random() > 0.5 ? Math.floor(Math.random() * 60) : undefined,
        confirmedBy: Math.random() > 0.5 ? randomFrom(['PA', 'DOCTOR', 'SYSTEM', null]) : undefined,
      },
      harmonyCall: {
        status: Math.random() > 0.3 ? 'COMPLETED' : 'NOT_STARTED',
        required: Math.random() > 0.2,
      },
      waitTimeMinutes: Math.random() > 0.5 ? Math.floor(Math.random() * 120) : undefined,
      createdAt: subHours(time, Math.floor(Math.random() * 24)).toISOString(),
    };

    appointments.push(appointment);
  }

  return appointments;
};

// Generate mock data
export const mockAppointments = generateMockAppointments(); 