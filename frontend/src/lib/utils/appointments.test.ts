import { describe, expect, it } from 'vitest';
import {
  getStatusColor,
  isOverdueConfirmation,
  isCritical,
  getSLAStatus,
  getConfirmationStatus,
} from './appointments';
import { Appointment } from '../types/appointments';

describe('Appointment Utils', () => {
  describe('getStatusColor', () => {
    it('returns green for completed statuses', () => {
      expect(getStatusColor('CONFIRMED')).toBe('green');
      expect(getStatusColor('PAID')).toBe('green');
      expect(getStatusColor('SHOWED_UP')).toBe('green');
    });

    it('returns yellow for pending statuses', () => {
      expect(getStatusColor('PENDING_CONFIRMATION')).toBe('yellow');
      expect(getStatusColor('BOOKED')).toBe('yellow');
    });

    it('returns red for cancelled statuses', () => {
      expect(getStatusColor('CANCELLED')).toBe('red');
      expect(getStatusColor('NO_SHOW')).toBe('red');
    });

    it('returns gray for other statuses', () => {
      expect(getStatusColor('LEAD')).toBe('gray');
      expect(getStatusColor('RESCHEDULED')).toBe('gray');
    });
  });

  describe('isOverdueConfirmation', () => {
    it('returns true when elapsed time is over 30 minutes', () => {
      const appointment = {
        confirmation: { elapsedMinutes: 31 },
      } as Appointment;
      expect(isOverdueConfirmation(appointment)).toBe(true);
    });

    it('returns false when elapsed time is under 30 minutes', () => {
      const appointment = {
        confirmation: { elapsedMinutes: 29 },
      } as Appointment;
      expect(isOverdueConfirmation(appointment)).toBe(false);
    });

    it('returns false when elapsed time is undefined', () => {
      const appointment = {
        confirmation: {},
      } as Appointment;
      expect(isOverdueConfirmation(appointment)).toBe(false);
    });
  });

  describe('isCritical', () => {
    it('returns true for pending confirmation', () => {
      const appointment = {
        status: 'PENDING_CONFIRMATION',
        confirmation: {},
        doctorPAConfirmation: 'CONFIRMED',
      } as Appointment;
      expect(isCritical(appointment)).toBe(true);
    });

    it('returns true for overdue confirmation', () => {
      const appointment = {
        status: 'BOOKED',
        confirmation: { elapsedMinutes: 31 },
        doctorPAConfirmation: 'CONFIRMED',
      } as Appointment;
      expect(isCritical(appointment)).toBe(true);
    });

    it('returns true for not confirmed by doctor', () => {
      const appointment = {
        status: 'BOOKED',
        confirmation: {},
        doctorPAConfirmation: 'NOT_CONFIRMED',
      } as Appointment;
      expect(isCritical(appointment)).toBe(true);
    });

    it('returns false for non-critical appointments', () => {
      const appointment = {
        status: 'CONFIRMED',
        confirmation: { elapsedMinutes: 29 },
        doctorPAConfirmation: 'CONFIRMED',
      } as Appointment;
      expect(isCritical(appointment)).toBe(false);
    });
  });

  describe('getSLAStatus', () => {
    it('returns N/A when wait time is undefined', () => {
      const appointment = {} as Appointment;
      expect(getSLAStatus(appointment)).toEqual({
        text: 'N/A',
        color: 'gray',
      });
    });

    it('returns within SLA for wait time <= 15 minutes', () => {
      const appointment = { waitTimeMinutes: 15 } as Appointment;
      expect(getSLAStatus(appointment)).toEqual({
        text: 'Within SLA',
        color: 'green',
      });
    });

    it('returns warning for wait time <= 30 minutes', () => {
      const appointment = { waitTimeMinutes: 30 } as Appointment;
      expect(getSLAStatus(appointment)).toEqual({
        text: 'SLA Warning',
        color: 'yellow',
      });
    });

    it('returns breached for wait time > 30 minutes', () => {
      const appointment = { waitTimeMinutes: 31 } as Appointment;
      expect(getSLAStatus(appointment)).toEqual({
        text: 'SLA Breached',
        color: 'red',
      });
    });
  });

  describe('getConfirmationStatus', () => {
    it('returns not confirmed when type is NONE', () => {
      const appointment = {
        confirmation: { type: 'NONE' },
      } as Appointment;
      expect(getConfirmationStatus(appointment)).toEqual({
        text: 'Not Confirmed',
        color: 'red',
      });
    });

    it('returns overdue when elapsed time > 30 minutes', () => {
      const appointment = {
        confirmation: { type: 'SMS', elapsedMinutes: 31 },
      } as Appointment;
      expect(getConfirmationStatus(appointment)).toEqual({
        text: 'Confirmation Overdue',
        color: 'red',
      });
    });

    it('returns confirmed when confirmedBy is set', () => {
      const appointment = {
        confirmation: { type: 'APP', confirmedBy: 'PA' },
      } as Appointment;
      expect(getConfirmationStatus(appointment)).toEqual({
        text: 'Confirmed',
        color: 'green',
      });
    });

    it('returns pending for other cases', () => {
      const appointment = {
        confirmation: { type: 'CALL' },
      } as Appointment;
      expect(getConfirmationStatus(appointment)).toEqual({
        text: 'Pending',
        color: 'yellow',
      });
    });
  });
}); 