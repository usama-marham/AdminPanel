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
  hospitalPhone!: string | null; // New field for hospital phone number

  // Appointment Times
  scheduledAt!: string | null; // ISO string from appointmentDateTime
  createdToScheduledTime!: string | null; // Time difference between creation and scheduled time
  
  // Fees and Payment
  fee!: number | null;
  paymentStatus!: string | null; // Now contains the title from PaymentStatus model

  // Status and Messages
  appointmentStatus!: string | null; // Renamed from status, contains title from AppointmentStatus model
  messageStatus!: string | null; // "Delivered" or "Not Delivered" based on MessageLog
  lastMessagePatient!: string | null; // This needs to be added to schema
  lastMessageDoctor!: string | null; // This needs to be added to schema

  // Booking Info
  bookedBy!: string | null; // User type: Admin, Patient, or Agent from UserType
  bookedFrom!: string | null; // Source/platform of booking
  probability!: string | null; // Now contains the name from AppointmentProbability model
  acquisition!: string | null; // This needs to be added to schema

  // Doctor Practice Info
  directBookingAllowed!: boolean | null; // New field: whether doctor allows direct booking
  onPanel!: boolean; // Doctor on-panel status

  createdAt!: string; // appointment.createdAt (booking time)
}

export class AppointmentListResponseDto {
  data!: AppointmentListItemDto[];
  meta!: { page: number; pageSize: number; total: number; pages: number };
}