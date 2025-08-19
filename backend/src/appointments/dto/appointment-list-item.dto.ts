export class AppointmentListItemDto {
  id!: string; // BigInt ID converted to string

  // Patient Info
  patientName!: string | null;
  patientPhone!: string | null;

  // Doctor Info
  doctorName!: string | null;
  doctorPhone!: string | null;
  doctorSpecialty!: string | null;

  // Hospital Info
  hospitalName!: string | null;
  hospitalAddress!: string | null;
  hospitalCity!: string | null;

  // Appointment Times
  scheduledAt!: string | null; // ISO string from slot.startTs
  createdToScheduledTime!: string | null; // Time difference between creation and scheduled time
  
  // Fees and Payment
  fee!: number | null;
  paymentStatus!: number | null;

  // Status and Messages
  status!: number;
  messageStatus!: string | null; // This needs to be added to schema
  lastMessagePatient!: string | null; // This needs to be added to schema
  lastMessageDoctor!: string | null; // This needs to be added to schema
  onPanel?: boolean; // Doctor on-panel status

  // Booking Info
  bookedBy!: string | null; // User who created the appointment
  bookedFrom!: string | null; // Source/platform of booking
  probability!: number | null; // This needs to be added to schema
  acquisition!: string | null; // This needs to be added to schema

  createdAt!: string; // appointment.createdAt (booking time)
}

export class AppointmentListResponseDto {
  data!: AppointmentListItemDto[];
  meta!: { page: number; pageSize: number; total: number; pages: number };
}