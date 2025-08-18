import { mockAppointments } from '../../../mocks/appointments';
import { mockMetrics } from '../../../mocks/metrics';
import { mockViolations } from '../../../mocks/violations';
import { 
  Appointment, 
  BulkActionInput, 
  BulkActionResult, 
  HeaderMetric, 
  IAppointmentsService, 
  IMetricsService, 
  IViolationsService,
  ListParams, 
  ViolationItem 
} from '../../types/appointments';
import { isSameDay, parseISO } from 'date-fns';

export class InMemoryAppointmentsService implements IAppointmentsService {
  private appointments = mockAppointments;

  async list(params: ListParams): Promise<{ rows: Appointment[]; total: number }> {
    let filtered = [...this.appointments];

    // Apply filters
    if (params.date) {
      filtered = filtered.filter(app => 
        isSameDay(parseISO(app.time), parseISO(params.date!))
      );
    }

    if (params.doctorId) {
      filtered = filtered.filter(app => app.doctor.id === params.doctorId);
    }

    if (params.hospitalId) {
      filtered = filtered.filter(app => app.hospital.id === params.hospitalId);
    }

    if (params.status) {
      filtered = filtered.filter(app => app.status === params.status);
    }

    if (params.q) {
      const query = params.q.toLowerCase();
      filtered = filtered.filter(app => 
        app.patient.name.toLowerCase().includes(query) ||
        app.doctor.name.toLowerCase().includes(query) ||
        app.hospital.name.toLowerCase().includes(query)
      );
    }

    // Apply tab filters
    switch (params.tab) {
      case 'CRITICAL':
        filtered = filtered.filter(app => 
          app.status === 'PENDING_CONFIRMATION' ||
          (app.confirmation.elapsedMinutes && app.confirmation.elapsedMinutes > 30) ||
          app.doctorPAConfirmation === 'NOT_CONFIRMED'
        );
        break;
      case 'PENDING':
        filtered = filtered.filter(app => 
          app.status === 'PENDING_CONFIRMATION' ||
          app.status === 'BOOKED'
        );
        break;
      case 'TIME_PASSED':
        filtered = filtered.filter(app => 
          new Date(app.time) < new Date() &&
          !['SHOWED_UP', 'CANCELLED', 'NO_SHOW'].includes(app.status)
        );
        break;
      case 'COMPLETED':
        filtered = filtered.filter(app => 
          ['SHOWED_UP', 'CANCELLED', 'NO_SHOW'].includes(app.status)
        );
        break;
      // 'ALL' tab doesn't need filtering
    }

    // Apply pagination
    const page = params.page || 1;
    const pageSize = params.pageSize || 50;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      rows: filtered.slice(start, end),
      total: filtered.length
    };
  }

  async get(id: string): Promise<Appointment> {
    const appointment = this.appointments.find(a => a.id === id);
    if (!appointment) {
      throw new Error(`Appointment ${id} not found`);
    }
    return appointment;
  }

  async bulkAction(input: BulkActionInput): Promise<BulkActionResult> {
    // Simulate bulk actions (in a real service, this would make API calls)
    const affected = this.appointments.filter(a => input.ids.includes(a.id));
    
    switch (input.action) {
      case 'REMIND':
        affected.forEach(a => {
          a.confirmation = {
            ...a.confirmation,
            type: 'SMS',
            elapsedMinutes: 0
          };
        });
        break;
      case 'ESCALATE_CALL':
        affected.forEach(a => {
          a.harmonyCall = {
            status: 'NOT_STARTED',
            required: true
          };
        });
        break;
      case 'ASSIGN':
        if (!input.assigneeId) {
          throw new Error('assigneeId required for ASSIGN action');
        }
        // In real implementation, this would assign to a PA/agent
        break;
    }

    return { updated: affected.length };
  }
}

export class InMemoryMetricsService implements IMetricsService {
  async getHeaderMetrics(date?: string): Promise<HeaderMetric[]> {
    // In a real service, this would filter by date
    return mockMetrics;
  }
}

export class InMemoryViolationsService implements IViolationsService {
  async getViolationsSummary(date?: string): Promise<ViolationItem[]> {
    // In a real service, this would filter by date
    return mockViolations;
  }
} 