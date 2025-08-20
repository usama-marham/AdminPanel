export interface AppointmentListItemDto {
  id: string;
  patientName: string | null;
  patientPhone: string | null;
  doctorName: string | null;
  doctorSpecialty: string | null;
  doctorPhone: string | null;
  hospitalName: string | null;
  hospitalAddress: string | null;
  hospitalCity: string | null;
  hospitalPhone: string | null;
  scheduledAt: string | null;
  fee: number | null;
  appointmentStatus: string; // Changed from status: number
  paymentStatus: string | null; // Changed from paymentStatus: number
  probability: string | null; // Added probability field
  createdAt: string;
  bookedBy: string | null;
  bookedFrom: string | null;
  onPanel: boolean | null;
  directBookingAllowed: boolean | null;
  messageStatus: string | null;
}

export interface AppointmentListResponseDto {
  data: AppointmentListItemDto[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    pages: number;
  };
}

// Lookups types
export interface LookupItem {
  id: number;
  title?: string;
  name?: string;
}

export interface LookupsResponse {
  specialties: LookupItem[];
  doctors: Array<{
    id: string;
    name: string;
    specialty: string;
  }>;
  patients: Array<{
    id: string;
    name: string;
    phone: string;
  }>;
  users: Array<{
    id: string;
    name: string;
    type: string;
  }>;
  appointmentStatuses: LookupItem[];
  paymentStatuses: LookupItem[];
  probabilities: LookupItem[];
}
