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
  scheduledAt: string | null;
  fee: number | null;
  status: number;
  paymentStatus: number | null;
  createdAt: string;
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
  status?: string;
  paymentStatus?: string;
  fee?: number;
  slotId?: number;
  notes?: string;
  appointmentInstructions?: string;
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
  status?: number;
  paymentStatus?: number;
  fee?: number;
  slotId?: number;
  notes?: string;
  appointmentInstructions?: string;
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

const appointmentsApi = {
  async get(id: string) {
    console.log('Making get request to:', `${API_BASE_URL}/appointments/${id}`);
    const response = await axios.get(`${API_BASE_URL}/appointments/${id}`);
    
    // Transform the backend response to match frontend format
    const item = response.data;
    return {
      id: item.id,
      patient: {
        name: item.patientName || 'N/A',
        phone: item.patientPhone || 'N/A',
        type: 'Regular',
      },
      doctor: {
        name: item.doctorName || 'N/A',
        specialty: item.doctorSpecialty || 'N/A',
        phone: item.doctorPhone || 'N/A',
      },
      hospital: {
        name: item.hospitalName || 'N/A',
        location: `${item.hospitalAddress || ''}, ${item.hospitalCity || ''}`.trim() || 'N/A',
      },
      time: item.scheduledAt || new Date().toISOString(),
      status: mapStatusToFrontend(item.status),
      paymentStatus: mapPaymentStatusToFrontend(item.paymentStatus),
      feePKR: item.fee || 0,
      createdAt: item.createdAt,
      notes: item.notes || '',
      appointmentInstructions: item.appointmentInstructions || '',
      flags: item.flags || {
        willFixNextTime: false,
        isMarkFollowUp: false,
        isDirectBooking: false,
        isAgentSpecial: false,
        isWhatsappCreated: false,
        isMarkDoctorAsRed: false,
        isProcedure: false,
      },
      messageSettings: item.messageSettings || {
        sendToPatient: true,
        sendToDoctor: true,
        sendToAssistant: true,
        sendVoiceToPatient: true,
      },
    };
  },

  async edit(id: string, data: EditAppointmentData) {
    console.log('Making edit request to:', `${API_BASE_URL}/appointments/${id}`);
    console.log('With data:', data);
    
    // Convert string status values to numbers for the API
    const apiData: EditAppointmentApiData = {
      ...data,
      status: data.status ? mapStatusToBackend(data.status) : undefined,
      paymentStatus: data.paymentStatus ? mapPaymentStatusToBackend(data.paymentStatus) : undefined,
    };
    
    const response = await axios.patch(`${API_BASE_URL}/appointments/${id}`, apiData);
    return response.data;
  },

  async list(params: { page?: number; pageSize?: number; q?: string }) {
    console.log('Making API request to:', `${API_BASE_URL}/appointments`);
    console.log('With params:', params);
    
    const response = await axios.get<AppointmentListResponseDto>(`${API_BASE_URL}/appointments`, {
      params: {
        page: params.page || 1,
        pageSize: params.pageSize || 50,
        q: params.q,
      },
    });
    
    // Transform the backend response to match frontend format
    return {
      rows: response.data.data.map(item => ({
        id: item.id,
        patient: {
          name: item.patientName || 'N/A',
          phone: item.patientPhone || 'N/A',
        },
        doctor: {
          name: item.doctorName || 'N/A',
          specialty: item.doctorSpecialty || 'N/A',
          phone: item.doctorPhone || 'N/A',
        },
        hospital: {
          name: item.hospitalName || 'N/A',
          location: `${item.hospitalAddress || ''}, ${item.hospitalCity || ''}`.trim() || 'N/A',
        },
        time: item.scheduledAt || new Date().toISOString(),
        feePKR: item.fee || 0,
        appointmentStatus: mapStatusToFrontend(item.status),
        paymentStatus: mapPaymentStatusToFrontend(item.paymentStatus),
        createdAt: item.createdAt,
      })),
      total: response.data.meta.total,
    };
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
  'Patient - Not Showed up': 10,
  'Patient Not Responding': 11,
  'Doctor - Not Showed Up': 12,
  'Case Declined': 13,
  'Not Showed-up By Doctor': 14,
  'Powered Off': 15,
  'Not Showed up-Billing': 16,
  'Duplicate': 17,
} as const;

export const paymentStatusMap = {
  'Unpaid': 1,
  'Paid': 2,
  'Evidence Received': 3,
  'Pending': 4,
  'To Be Refund': 5,
  'Refunded': 6,
} as const;

function mapStatusToFrontend(status: number): string {
  return Object.entries(appointmentStatusMap).find(([_, value]) => value === status)?.[0] || 'Other';
}

function mapPaymentStatusToFrontend(status: number | null): string {
  return Object.entries(paymentStatusMap).find(([_, value]) => value === status)?.[0] || 'Unpaid';
}

function mapStatusToBackend(status: string): number {
  return appointmentStatusMap[status as keyof typeof appointmentStatusMap] || appointmentStatusMap['Other'];
}

function mapPaymentStatusToBackend(status: string): number {
  return paymentStatusMap[status as keyof typeof paymentStatusMap] || paymentStatusMap['Unpaid'];
}

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
    queryFn: () => mockMetrics, // TODO: Replace with API call
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
    queryFn: () => mockViolations, // TODO: Replace with API call
  });
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: () => appointmentsApi.get(id),
    enabled: Boolean(id),
  });
}

// Bulk action types
type BulkActionType = 'REMIND' | 'ESCALATE_CALL' | 'ASSIGN';

interface BulkActionInput {
  action: BulkActionType;
  ids: string[];
  assigneeId?: string;
}

interface BulkActionResult {
  success: boolean;
  message: string;
  updatedCount: number;
}

// Mock bulk action API call
async function mockBulkAction(input: BulkActionInput): Promise<BulkActionResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    message: `Successfully processed ${input.ids.length} appointments`,
    updatedCount: input.ids.length,
  };
}

export function useEditAppointment(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EditAppointmentData) => {
      console.log('Sending edit request with data:', data);
      return appointmentsApi.edit(id, data);
    },
    onSuccess: (response) => {
      console.log('Edit successful, response:', response);
      // Invalidate all appointment-related queries
      console.log('Invalidating queries...');
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment'] });
      // Force a refetch of the appointments list
      console.log('Forcing refetch...');
      queryClient.refetchQueries({ queryKey: ['appointments'] });
    },
    onError: (error) => {
      console.error('Failed to edit appointment:', error);
    },
  });
}

export function useBulkActions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: BulkActionInput) => mockBulkAction(input),
    onSuccess: () => {
      // Invalidate appointments list to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useAppointments(params: UseAppointmentsParams = {}) {
  return useQuery({
    queryKey: ['appointments', params],
    queryFn: async () => {
      try {
        console.log('Fetching appointments with params:', params);
        const result = await appointmentsApi.list({
          page: params.page,
          pageSize: params.pageSize,
          q: params.q,
        });
        console.log('API response:', result);
        return result;
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
        throw error;
      }
    },
  });
}