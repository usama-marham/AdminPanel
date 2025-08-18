export class AppointmentListItemDto {
  id!: string; // BigInt ID converted to string

  patientName!: string | null;
  patientPhone!: string | null;

  doctorName!: string | null;
  doctorSpecialty!: string | null;
  doctorPhone!: string | null;

  hospitalName!: string | null;
  hospitalAddress!: string | null;
  hospitalCity!: string | null;

  scheduledAt!: string | null; // ISO string from slot.startTs
  fee!: number | null;

  status!: number;
  paymentStatus!: number | null;

  createdAt!: string; // appointment.createdAt (booking time)
}

export class AppointmentListResponseDto {
  data!: AppointmentListItemDto[];
  meta!: { page: number; pageSize: number; total: number; pages: number };
}
