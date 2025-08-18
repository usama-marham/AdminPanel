// Core enums for appointment domain
export type Specialty = 'PSYCHOLOGIST' | 'PSYCHIATRIST' | 'NEURO_PSYCHIATRIST' | 'CHILD_PSYCHOLOGIST' | 'COUNSELOR';
export type VisitType = 'FIRST_VISIT' | 'FOLLOW_UP' | 'CORPORATE';
export type Channel = 'OC' | 'PHYSICAL';
export type ConfirmationType = 'APP' | 'CALL' | 'SMS' | 'NONE';
export type DoctorPAStatus = 'CONFIRMED' | 'NOT_CONFIRMED' | 'UNKNOWN';
export type AppointmentStatus = 'LEAD' | 'BOOKED' | 'PENDING_CONFIRMATION' | 'CONFIRMED' | 'PAID' | 'SHOWED_UP' | 'CANCELLED' | 'NO_SHOW' | 'RESCHEDULED';
export type TabKey = 'CRITICAL' | 'PENDING' | 'TIME_PASSED' | 'COMPLETED' | 'ALL';

// Core domain interfaces
export interface Patient {
  id: string;
  name: string;
  phone: string;
  type: VisitType;
  tags?: string[];
}

export interface Doctor {
  id: string;
  name: string;
  specialty: Specialty;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
}

export interface HarmonyCall {
  status: 'COMPLETED' | 'NOT_STARTED';
  required: boolean;
}

export interface Confirmation {
  type: ConfirmationType;
  elapsedMinutes?: number;
  confirmedBy?: 'PA' | 'DOCTOR' | 'SYSTEM' | null;
}

export interface Appointment {
  id: string;
  patient: Patient;
  doctor: Doctor;
  hospital: Hospital;
  time: string; // ISO string
  feePKR: number;
  channel: Channel;
  travel: 'LOCAL' | 'REMOTE';
  appointmentStatus: string;
  paymentStatus: string;
  doctorPAConfirmation: DoctorPAStatus;
  confirmation: Confirmation;
  harmonyCall: {
    status: 'COMPLETED' | 'NOT_STARTED';
    required: boolean;
  };
  waitTimeMinutes?: number;
  createdAt: string;
}

// Service interfaces
export interface ListParams {
  tab: TabKey;
  date?: string; // ISO date, optional
  doctorId?: string;
  hospitalId?: string;
  status?: AppointmentStatus;
  q?: string; // search
  page?: number;
  pageSize?: number; // default 50
}

// Header metrics
export type MetricKey = 'FIVE_STAR_RATE' | 'LOST_PATIENTS' | 'PENDING_CONFIRMATION' | 'SLA_BREACHES' | 'AGENT_EFFICIENCY';

export interface HeaderMetric {
  key: MetricKey;
  label: string;
  value: number;
  unit: 'PERCENT' | 'COUNT';
  changePct: number;
  trend: 'up' | 'down' | 'neutral';
  color: 'green' | 'red' | 'yellow';
}

// Violations
export type ViolationKey = 'TIME_CONFIRMATION_ELAPSED' | 'NOT_CONFIRMED_BY_DOCTOR' | 'TIME_RESCHEDULED' | 'HARMONY_CALL_NOT_DONE';

export interface ViolationItem {
  key: ViolationKey;
  title: string;
  count: number;
  description: string;
  elapsed?: string;
  severity: 'critical' | 'warning' | 'info';
}

// Service interfaces
export interface BulkActionInput {
  action: 'REMIND' | 'ESCALATE_CALL' | 'ASSIGN';
  ids: string[];
  assigneeId?: string;
}

export interface BulkActionResult {
  updated: number;
}

// Service interfaces
export interface IAppointmentsService {
  list(params: ListParams): Promise<{ rows: Appointment[]; total: number }>;
  get(id: string): Promise<Appointment>;
  bulkAction(input: BulkActionInput): Promise<BulkActionResult>;
}

export interface IMetricsService {
  getHeaderMetrics(date?: string): Promise<HeaderMetric[]>;
}

export interface IViolationsService {
  getViolationsSummary(date?: string): Promise<ViolationItem[]>;
} 