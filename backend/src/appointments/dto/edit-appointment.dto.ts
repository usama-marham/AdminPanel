import { Type } from 'class-transformer';
import {
  IsOptional,
  IsPositive,
  IsString,
  Min,
  IsNumber,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class EditAppointmentDto {
  @IsOptional()
  @IsString()
  appointmentStatus?: string; // String value like "Scheduled", "Cancelled", etc.

  @IsOptional()
  @IsString()
  paymentStatus?: string; // String value like "Paid", "Unpaid", etc.

  @IsOptional()
  @IsString()
  probability?: string; // String value like "Confirmed", "May Be", etc.

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(0)
  fee?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  appointmentInstructions?: string;

  @IsOptional()
  @IsDateString()
  appointmentDateTime?: string; // ISO date string for rescheduling

  @IsOptional()
  @IsBoolean()
  onPanel?: boolean; // Update panel status

  @IsOptional()
  @IsBoolean()
  directBookingAllowed?: boolean; // Update direct booking permission

  @IsOptional()
  patientDetails?: {
    phone?: string;
    occupation?: string;
    age?: string;
    gender?: string;
    city?: string;
    firstName?: string;
    lastName?: string;
  };

  @IsOptional()
  doctorDetails?: {
    name?: string;
    phone?: string;
    email?: string;
  };

  @IsOptional()
  hospitalDetails?: {
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
  };
} 