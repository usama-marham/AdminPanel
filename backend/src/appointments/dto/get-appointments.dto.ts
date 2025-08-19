import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
  IsDateString,
  IsBoolean,
  IsEnum,
} from 'class-validator';

export class GetAppointmentsDto {
  @IsOptional()
  @IsString()
  q?: string; // search (patient name/phone, doctor name, hospital name)

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(100)
  pageSize = 50; // sensible default

  // Date filters
  @IsOptional()
  @IsDateString()
  bookedDateFrom?: string; // Appointment creation date range

  @IsOptional()
  @IsDateString()
  bookedDateTo?: string;

  @IsOptional()
  @IsDateString()
  scheduledDateFrom?: string; // Appointment scheduled time range

  @IsOptional()
  @IsDateString()
  scheduledDateTo?: string;

  // Status filters
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  status?: number; // Specific appointment status

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  paymentStatus?: number; // Specific payment status

  // Doctor filters
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  onPanel?: boolean; // Doctor on-panel status

  @IsOptional()
  @IsString()
  doctorName?: string; // Doctor name (instead of ID)

  @IsOptional()
  @IsString()
  specialtyName?: string; // Specialty name (instead of ID)

  // User filters
  @IsOptional()
  @IsString()
  bookedByName?: string; // Who booked the appointment (instead of ID)

  // Additional filters
  @IsOptional()
  @IsString()
  patientName?: string; // Patient name (instead of ID)

  @IsOptional()
  @IsString()
  hospitalName?: string; // Hospital name (instead of ID)

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  minFee?: number; // Minimum fee

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  maxFee?: number; // Maximum fee
}
