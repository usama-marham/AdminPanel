import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface AppointmentListItemDto {
  id: string;
  patientName: string | null;
  patientPhone: string | null;
  doctorName: string | null;
  doctorSpecialty: string | null;
  doctorPhone: string | null;
  hospitalName: string | null;
  hospitalAddress: string | null;
  hospitalCity: string | null;
  hospitalPhone: string | null; // New field
  scheduledAt: string | null;
  fee: number | null;
  appointmentStatus: string | null; // Renamed from status, now contains title
  paymentStatus: string | null; // Now contains title instead of ID
  createdAt: string;
  createdToScheduledTime: string | null;
  bookedBy: string | null; // Now contains user type (Admin, Patient, Agent)
  bookedFrom: string | null;
  probability: string | null; // Now contains name instead of ID
  acquisition: string | null;
  messageStatus: string | null; // Now contains string status
  lastMessagePatient: string | null;
  lastMessageDoctor: string | null;
  onPanel: boolean;
  directBookingAllowed: boolean | null; // New field
}

interface AppointmentListResponseDto {
  data: AppointmentListItemDto[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    pages: number;
  };
}

const API_BASE_URL = 'http://localhost:3333/v1';

interface EditAppointmentData {
  id?: string;
  appointmentStatus?: string; // string title
  paymentStatus?: string; // string title
  fee?: number;
  slotId?: number;
  notes?: string;
  appointmentInstructions?: string;
  probability?: string; // string title
  appointmentDateTime?: string; // ISO string
  patientDetails?: {
    phone?: string;
    occupation?: string;
    age?: string;
    gender?: string;
    city?: string;
  };
  paInfo?: {
    hospital?: string;
    name?: string;
    number?: string;
  };
  flags?: {
    willFixNextTime?: boolean;
    isMarkFollowUp?: boolean;
    isDirectBooking?: boolean;
    isAgentSpecial?: boolean;
    isWhatsappCreated?: boolean;
    isMarkDoctorAsRed?: boolean;
    isProcedure?: boolean;
  };
  messageSettings?: {
    sendToPatient?: boolean;
    sendToDoctor?: boolean;
    sendToAssistant?: boolean;
    sendVoiceToPatient?: boolean;
  };
}

interface EditAppointmentApiData {
  appointmentStatus?: string;
  paymentStatus?: string;
  fee?: number;
  slotId?: number;
  notes?: string;
  appointmentInstructions?: string;
  probability?: string;
  appointmentDateTime?: string;
  patientDetails?: EditAppointmentData['patientDetails'];
  paInfo?: EditAppointmentData['paInfo'];
  flags?: EditAppointmentData['flags'];
  messageSettings?: EditAppointmentData['messageSettings'];
}

const appointmentsApi = {
  async get(id: string) {
    try {
      console.log('Fetching appointment:', id);
      const response = await axios.get(`${API_BASE_URL}/appointments/${id}`);
      console.log('Appointment response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch appointment:', error);
      throw error;
    }
  },

  async getLookups() {
    try {
      console.log('Fetching lookups');
      const response = await axios.get(`${API_BASE_URL}/appointments/lookups`);
      console.log('Lookups response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch lookups:', error);
      throw error;
    }
  },

  async edit(data: EditAppointmentData) {
    if (!data.id) throw new Error('Appointment ID is required');
    console.log('Making edit request to:', `${API_BASE_URL}/appointments/${data.id}`);
    console.log('With data:', data);
    
    const apiData: EditAppointmentApiData = {
      ...data,
      appointmentStatus: data.appointmentStatus,
      paymentStatus: data.paymentStatus,
      probability: data.probability,
      appointmentDateTime: data.appointmentDateTime,
    };
    
    const response = await axios.patch(`${API_BASE_URL}/appointments/${data.id}`, apiData);
    return response.data;
  },

  async list(params: {
    page?: number;
    pageSize?: number;
    q?: string;
    bookedDateFrom?: string;
    bookedDateTo?: string;
    scheduledDateFrom?: string;
    scheduledDateTo?: string;
    status?: string;
    paymentStatus?: string;
    onPanel?: string;
    doctorName?: string;
    specialtyName?: string;
    bookedByName?: string;
    patientName?: string;
    hospitalName?: string;
    minFee?: string;
    maxFee?: string;
  }) {
    try {
      console.log('Fetching appointments with params:', params);
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
      if (params.q) queryParams.append('q', params.q);
      
      // Date filters
      if (params.bookedDateFrom) queryParams.append('bookedDateFrom', params.bookedDateFrom);
      if (params.bookedDateTo) queryParams.append('bookedDateTo', params.bookedDateTo);
      if (params.scheduledDateFrom) queryParams.append('scheduledDateFrom', params.scheduledDateFrom);
      if (params.scheduledDateTo) queryParams.append('scheduledDateTo', params.scheduledDateTo);
      
      // Status filters
      if (params.status) queryParams.append('status', params.status);
      if (params.paymentStatus) queryParams.append('paymentStatus', params.paymentStatus);
      if (params.onPanel) queryParams.append('onPanel', params.onPanel);
      
      // Name-based filters
      if (params.doctorName) queryParams.append('doctorName', params.doctorName);
      if (params.specialtyName) queryParams.append('specialtyName', params.specialtyName);
      if (params.bookedByName) queryParams.append('bookedByName', params.bookedByName);
      if (params.patientName) queryParams.append('patientName', params.patientName);
      if (params.hospitalName) queryParams.append('hospitalName', params.hospitalName);
      
      // Fee filters
      if (params.minFee) queryParams.append('minFee', params.minFee);
      if (params.maxFee) queryParams.append('maxFee', params.maxFee);
      
      const url = `${API_BASE_URL}/appointments?${queryParams.toString()}`;
      console.log('Making request to:', url);
      
      const response = await axios.get(url);
      console.log('Appointments response:', response.data);
      console.log('Raw response data:', {
        totalRows: response.data.data?.length,
        meta: response.data.meta,
        firstRow: response.data.data?.[0],
        lastRow: response.data.data?.[response.data.data.length - 1]
      });
      
      // Transform the response to match frontend expectations
      const transformedData = {
        data: response.data.data.map((appointment: any) => ({
          ...appointment,
          // Ensure all required fields are present
          patientName: appointment.patientName || 'Unknown',
          patientPhone: appointment.patientPhone || 'N/A',
          doctorName: appointment.doctorName || 'Unknown',
          doctorPhone: appointment.doctorPhone || 'N/A',
          doctorSpecialty: appointment.doctorSpecialty || 'N/A',
          hospitalName: appointment.hospitalName || 'Unknown',
          hospitalAddress: appointment.hospitalAddress || 'N/A',
          hospitalCity: appointment.hospitalCity || 'N/A',
          hospitalPhone: appointment.hospitalPhone || 'N/A',
          scheduledAt: appointment.scheduledAt || null,
          fee: appointment.fee || 0,
          appointmentStatus: appointment.appointmentStatus || null,
          paymentStatus: appointment.paymentStatus || null,
          createdAt: appointment.createdAt || new Date().toISOString(),
          createdToScheduledTime: appointment.createdToScheduledTime || null,
          bookedBy: appointment.bookedBy || 'Unknown',
          bookedFrom: appointment.bookedFrom || 'N/A',
          probability: appointment.probability || null,
          acquisition: appointment.acquisition || 'N/A',
          messageStatus: appointment.messageStatus || null,
          lastMessagePatient: appointment.lastMessagePatient || null,
          lastMessageDoctor: appointment.lastMessageDoctor || null,
          onPanel: appointment.onPanel || false,
          directBookingAllowed: appointment.directBookingAllowed || null,
        })),
        meta: response.data.meta,
      };
      
      console.log('Transformed data:', {
        totalRows: transformedData.data?.length,
        meta: transformedData.meta,
        firstRow: transformedData.data?.[0],
        lastRow: transformedData.data?.[transformedData.data.length - 1]
      });
      
      return transformedData;
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      throw error;
    }
  },
};

export const appointmentStatusMap = {
  'In Process': 1,
  'Scheduled': 2,
  'Cancelled': 3,
  'Doctor Not Responding': 4,
  'Data Incorrect': 5,
  'Doctor Not Available': 6,
  'Inquiry': 7,
  'Showed up': 8,
  'Other': 9,
  'Patient No Show': 10,
  'Patient Not Responding': 11,
  'Doctor No Show': 12,
  'Case Declined': 13,
  'Doctor No Show Alt': 14,
  'Powered Off': 15,
  'No Show Billing': 16,
  'Duplicate': 17,
  'Cancelled By Doctor': 18,
} as const;

export const paymentStatusMap = {
  'Unpaid': 1,
  'Paid': 2,
  'Evidence Received': 3,
  'Pending': 4,
  'To Be Refunded': 5,
  'Refunded': 6,
} as const;

// These functions are no longer needed since we're working with string values directly
// function mapStatusToFrontend(status: number): string {
//   return Object.entries(appointmentStatusMap).find(([_, value]) => value === status)?.[0] || 'Other';
// }

// function mapPaymentStatusToFrontend(status: number | null): string {
//   if (status === null) return 'No';
//   return Object.entries(paymentStatusMap).find(([_, value]) => value === status)?.[0] || 'No';
// }

// function mapStatusToBackend(status: string): number {
//   return appointmentStatusMap[status as keyof typeof appointmentStatusMap] || appointmentStatusMap['Other'];
// }

// function mapPaymentStatusToBackend(status: string): number {
//   return paymentStatusMap[status as keyof typeof paymentStatusMap] || paymentStatusMap['No'];
// }

export type MetricKey = 'FIVE_STAR_RATE' | 'LOST_PATIENTS' | 'PENDING_CONFIRMATION' | 'SLA_BREACHES' | 'AGENT_EFFICIENCY';
export type ViolationKey = 'TIME_CONFIRMATION_ELAPSED' | 'NOT_CONFIRMED_BY_DOCTOR' | 'TIME_RESCHEDULED' | 'HARMONY_CALL_NOT_DONE';

export interface ViolationItem {
  key: ViolationKey;
  title: string;
  description: string;
  count: number;
  severity: 'critical' | 'warning' | 'info';
  elapsed?: string;
}

export interface HeaderMetric {
  key: MetricKey;
  label: string;
  value: number;
  unit: 'NUMBER' | 'PERCENT';
  trend: 'up' | 'down';
  changePct: number;
  color: 'green' | 'red' | 'yellow';
}

interface UseAppointmentsParams {
  tab?: string;
  page?: number;
  pageSize?: number;
  q?: string;
}

// Mock metrics data
const mockMetrics: HeaderMetric[] = [
  {
    key: 'FIVE_STAR_RATE',
    label: '5-Star Rating',
    value: 92,
    unit: 'PERCENT',
    trend: 'up',
    changePct: 5,
    color: 'green',
  },
  {
    key: 'LOST_PATIENTS',
    label: 'Lost Patients',
    value: 24,
    unit: 'NUMBER',
    trend: 'down',
    changePct: 12,
    color: 'red',
  },
  {
    key: 'PENDING_CONFIRMATION',
    label: 'Pending Confirmation',
    value: 45,
    unit: 'NUMBER',
    trend: 'up',
    changePct: 8,
    color: 'yellow',
  },
  {
    key: 'SLA_BREACHES',
    label: 'SLA Breaches',
    value: 3,
    unit: 'NUMBER',
    trend: 'down',
    changePct: 25,
    color: 'green',
  },
  {
    key: 'AGENT_EFFICIENCY',
    label: 'Agent Efficiency',
    value: 87,
    unit: 'PERCENT',
    trend: 'up',
    changePct: 3,
    color: 'green',
  },
];

export function useHeaderMetrics() {
  return useQuery({
    queryKey: ['headerMetrics'],
    queryFn: () => mockMetrics,
  });
}

// Mock violations data
const mockViolations: ViolationItem[] = [
  {
    key: 'TIME_CONFIRMATION_ELAPSED',
    title: 'Confirmation Time Elapsed',
    description: 'Appointments that have exceeded the confirmation time limit',
    count: 12,
    severity: 'critical',
    elapsed: '30 minutes',
  },
  {
    key: 'NOT_CONFIRMED_BY_DOCTOR',
    title: 'Doctor Not Confirmed',
    description: 'Appointments pending doctor confirmation',
    count: 8,
    severity: 'warning',
  },
  {
    key: 'TIME_RESCHEDULED',
    title: 'Time Passed',
    description: 'Appointments that need to be rescheduled',
    count: 5,
    severity: 'warning',
  },
  {
    key: 'HARMONY_CALL_NOT_DONE',
    title: 'Harmony Call Pending',
    description: 'Appointments requiring harmony call',
    count: 15,
    severity: 'info',
  },
];

export function useViolations() {
  return useQuery({
    queryKey: ['violations'],
    queryFn: () => mockViolations,
  });
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: () => appointmentsApi.get(id),
    enabled: Boolean(id),
  });
}

export function useEditAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EditAppointmentData) => {
      console.log('Sending edit request with data:', data);
      return appointmentsApi.edit(data);
    },
    onSuccess: (response) => {
      console.log('Edit successful, response:', response);
      console.log('Invalidating queries...');
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment'] });
      console.log('Forcing refetch...');
      queryClient.refetchQueries({ queryKey: ['appointments'] });
    },
    onError: (error) => {
      console.error('Failed to edit appointment:', error);
    },
  });
}

// Types for bulk actions
export type BulkActionType = 'REMIND' | 'ESCALATE_CALL' | 'ASSIGN';

export interface BulkActionInput {
  action: BulkActionType;
  ids: string[];
  assigneeId?: string;
}

export interface BulkActionResult {
  success: boolean;
  message: string;
  updatedCount: number;
}

// Mock bulk action API call
async function mockBulkAction(input: BulkActionInput): Promise<BulkActionResult> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    success: true,
    message: `Successfully processed ${input.ids.length} appointments`,
    updatedCount: input.ids.length,
  };
}

export function useBulkActions() {
  const queryClient = useQueryClient();

  return useMutation<BulkActionResult, Error, BulkActionInput>({
    mutationFn: (input: BulkActionInput) => mockBulkAction(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useAppointments(params: {
  tab: string;
  page?: number;
  pageSize?: number;
  q?: string;
  bookedDateFrom?: string;
  bookedDateTo?: string;
  scheduledDateFrom?: string;
  scheduledDateTo?: string;
  status?: string;
  paymentStatus?: string;
  onPanel?: string;
  doctorName?: string;
  specialtyName?: string;
  bookedByName?: string;
  patientName?: string;
  hospitalName?: string;
  minFee?: string;
  maxFee?: string;
}) {
  return useQuery({
    queryKey: ['appointments', params],
    queryFn: () => appointmentsApi.list(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useLookups() {
  return useQuery({
    queryKey: ['lookups'],
    queryFn: () => appointmentsApi.getLookups(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}