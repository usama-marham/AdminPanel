import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

// These should match the frontend status values
export enum AppointmentStatus {
  IN_PROCESS = 1,
  SCHEDULED = 2,
  CANCELLED = 3,
  DOCTOR_NOT_RESPONDING = 4,
  DATA_INCORRECT = 5,
  DOCTOR_NOT_AVAILABLE = 6,
  INQUIRY = 7,
  SHOWED_UP = 8,
  OTHER = 9,
  PATIENT_NOT_SHOWED_UP = 10,
  PATIENT_NOT_RESPONDING = 11,
  DOCTOR_NOT_SHOWED_UP = 12,
  CASE_DECLINED = 13,
  NOT_SHOWED_UP_BY_DOCTOR = 14,
  POWERED_OFF = 15,
  NOT_SHOWED_UP_BILLING = 16,
  DUPLICATE = 17,
}

export enum PaymentStatus {
  UNPAID = 1,
  PAID = 2,
  EVIDENCE_RECEIVED = 3,
  PENDING = 4,
  TO_BE_REFUND = 5,
  REFUNDED = 6,
}

export class EditAppointmentDto {
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(0)
  fee?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  slotId?: number; // To reschedule to a different slot

  @IsOptional()
  @IsString()
  notes?: string; // Optional notes about the edit

  @IsOptional()
  @IsString()
  appointmentInstructions?: string;

  @IsOptional()
  patientDetails?: {
    phone?: string;
    occupation?: string;
    age?: string;
    gender?: string;
    city?: string;
  };
} 