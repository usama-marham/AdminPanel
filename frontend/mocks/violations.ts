import { ViolationItem } from '../lib/types/appointments';

export const mockViolations: ViolationItem[] = [
  {
    key: 'TIME_CONFIRMATION_ELAPSED',
    title: 'Confirmation Time Elapsed',
    count: 4,
    description: 'Appointments that have exceeded confirmation time limit',
    elapsed: '9 minutes',
    severity: 'critical'
  },
  {
    key: 'NOT_CONFIRMED_BY_DOCTOR',
    title: 'Doctor Not Confirmed',
    count: 12,
    description: 'Appointments pending doctor confirmation',
    severity: 'warning'
  },
  {
    key: 'TIME_RESCHEDULED',
    title: 'Rescheduled',
    count: 8,
    description: 'Appointments that were rescheduled',
    severity: 'info'
  },
  {
    key: 'HARMONY_CALL_NOT_DONE',
    title: 'Harmony Call Pending',
    count: 15,
    description: 'Required harmony calls not completed',
    severity: 'warning'
  }
]; 