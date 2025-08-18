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
  scheduledAt: string | null;
  fee: number | null;
  status: number;
  paymentStatus: number | null;
  createdAt: string;
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
