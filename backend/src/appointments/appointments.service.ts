import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetAppointmentsDto } from './dto/get-appointments.dto';
import {
  AppointmentListItemDto,
  AppointmentListResponseDto,
} from './dto/appointment-list-item.dto';
import { EditAppointmentDto } from './dto/edit-appointment.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(public prisma: PrismaService) {}

  async list(dto: GetAppointmentsDto): Promise<AppointmentListResponseDto> {
    const { 
      page = 1, 
      pageSize = 10, 
      q,
      bookedDateFrom,
      bookedDateTo,
      scheduledDateFrom,
      scheduledDateTo,
      status,
      paymentStatus,
      onPanel,
      doctorName,
      specialtyName,
      bookedByName,
      patientName,
      hospitalName,
      minFee,
      maxFee
    } = dto;
    
    const pageNum = Number(page);
    const pageSizeNum = Number(pageSize);
    const skip = (pageNum - 1) * pageSizeNum;
    const take = pageSizeNum;

    // Build comprehensive where clause
    const where: Prisma.AppointmentWhereInput = {
      deletedAt: null,
      
      // Text search
      OR: q
        ? [
            { patient: { firstName: { contains: q } } },
            { patient: { lastName: { contains: q } } },
            { patient: { phone: { contains: q } } },
            {
              practice: {
                doctor: { name: { contains: q } },
              },
            },
            {
              practice: {
                hospital: { name: { contains: q } },
              },
            },
          ]
        : undefined,
    };

    // Add date filters
    if (bookedDateFrom || bookedDateTo) {
      where.createdAt = {};
      if (bookedDateFrom) {
        where.createdAt.gte = new Date(bookedDateFrom);
      }
      if (bookedDateTo) {
        where.createdAt.lte = new Date(bookedDateTo);
      }
    }

    // Add status filters
    if (status !== undefined) {
      where.status = status;
    }
    if (paymentStatus !== undefined) {
      where.paymentStatus = paymentStatus;
    }

    // Add doctor filters
    if (onPanel !== undefined || doctorName || specialtyName) {
      where.practice = {};
      if (onPanel !== undefined) {
        where.practice.onPanel = onPanel;
      }
      if (doctorName) {
        where.practice.doctor = {
          name: { contains: doctorName },
        };
      }
      if (specialtyName) {
        if (!where.practice.doctor) {
          where.practice.doctor = {};
        }
        where.practice.doctor.mainSpeciality = {
          name: { contains: specialtyName },
        };
      }
    }

    // Add user filters
    if (bookedByName) {
      where.user = {
        fullName: { contains: bookedByName },
      };
    }

    // Add additional filters
    if (patientName) {
      where.patient = {
        OR: [
          { firstName: { contains: patientName } },
          { lastName: { contains: patientName } },
        ],
      };
    }
    if (hospitalName) {
      if (!where.practice) {
        where.practice = {};
      }
      where.practice.hospital = {
        name: { contains: hospitalName },
      };
    }

    // Add fee filters
    if (minFee !== undefined || maxFee !== undefined) {
      where.fee = {};
      if (minFee !== undefined) {
        where.fee.gte = minFee;
      }
      if (maxFee !== undefined) {
        where.fee.lte = maxFee;
      }
    }

    // Add scheduled date filters (via slot)
    if (scheduledDateFrom || scheduledDateTo) {
      where.slot = {};
      if (scheduledDateFrom) {
        (where.slot as any).startTs = { gte: new Date(scheduledDateFrom) };
      }
      if (scheduledDateTo) {
        if (!(where.slot as any).startTs) {
          (where.slot as any).startTs = {};
        }
        (where.slot as any).startTs.lte = new Date(scheduledDateTo);
      }
    }

    const [total, appointments] = await this.prisma.$transaction([
      this.prisma.appointment.count({ where }),
      this.prisma.appointment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: {
          user: {
            select: {
              fullName: true,
              userTypeId: true,
            },
          },
          patient: { 
            select: { 
              firstName: true, 
              lastName: true, 
              phone: true, 
              source: true,
              utmSource: true,
              utmMedium: true,
              utmCampaign: true,
            } 
          },
          practice: {
            select: {
              doctor: {
                select: {
                  name: true,
                  phone: true,
                  mainSpeciality: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
              hospital: {
                select: {
                  name: true,
                  address: true,
                  city: true,
                },
              },
              onPanel: true, // Include on-panel status
            },
          },
          slot: {
            select: {
              startTs: true,
            },
          },
        },
      }),
    ]);

    const data: AppointmentListItemDto[] = appointments.map((appointment) => {
      const patientName = appointment.patient
        ? [appointment.patient.firstName, appointment.patient.lastName]
            .filter(Boolean)
            .join(' ') || null
        : null;

      // Calculate time difference between creation and scheduled time
      const createdToScheduledTime = appointment.slot?.startTs && appointment.createdAt
        ? this.calculateTimeDifference(appointment.createdAt, appointment.slot.startTs)
        : null;

      // Combine UTM parameters for acquisition info
      const acquisition = appointment.patient?.utmSource
        ? `${appointment.patient.utmSource}${
            appointment.patient.utmMedium ? ` / ${appointment.patient.utmMedium}` : ''
          }${
            appointment.patient.utmCampaign ? ` / ${appointment.patient.utmCampaign}` : ''
          }`
        : null;

      return {
        id: appointment.id.toString(),
        
        // Patient Info
        patientName,
        patientPhone: appointment.patient?.phone ?? null,

        // Doctor Info
        doctorName: appointment.practice?.doctor?.name ?? null,
        doctorPhone: appointment.practice?.doctor?.phone ?? null,
        doctorSpecialty: appointment.practice?.doctor?.mainSpeciality?.name ?? null,

        // Hospital Info
        hospitalName: appointment.practice?.hospital?.name ?? null,
        hospitalAddress: appointment.practice?.hospital?.address ?? null,
        hospitalCity: appointment.practice?.hospital?.city ?? null,

        // Appointment Times
        scheduledAt: appointment.slot?.startTs?.toISOString() ?? null,
        createdToScheduledTime,

        // Fees and Payment
        fee: appointment.fee ?? null,
        paymentStatus: appointment.paymentStatus ?? null,

        // Status and Messages
        status: appointment.status,
        messageStatus: null, // Needs schema update
        lastMessagePatient: null, // Needs schema update
        lastMessageDoctor: null, // Needs schema update

        // Booking Info
        bookedBy: appointment.user?.fullName ?? null,
        bookedFrom: appointment.patient?.source ?? null,
        probability: null, // Needs schema update
        acquisition,

        // Additional fields for filtering
        onPanel: appointment.practice?.onPanel ?? false,

        createdAt: appointment.createdAt.toISOString(),
      };
    });

    return {
      data,
      meta: {
        page: pageNum,
        pageSize: pageSizeNum,
        total,
        pages: Math.max(1, Math.ceil(total / pageSizeNum)),
      },
    };
  }

  private calculateTimeDifference(createdAt: Date, scheduledAt: Date): string {
    const diffInHours = Math.abs(scheduledAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `${Math.round(diffInHours)} hours`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days} days`;
    }
  }

  async get(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: BigInt(id), deletedAt: null },
      include: {
        user: { select: { fullName: true, userTypeId: true } },
        patient: { 
          select: { 
            firstName: true, 
            lastName: true, 
            phone: true, 
            source: true,
            utmSource: true,
            utmMedium: true,
            utmCampaign: true,
          } 
        },
        practice: {
          select: {
            doctor: {
              select: {
                name: true,
                phone: true,
                mainSpeciality: { select: { name: true } },
              },
            },
            hospital: { select: { name: true, address: true, city: true } },
          },
        },
        slot: { select: { startTs: true } },
      },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return {
      id: appointment.id.toString(),
      patientName: appointment.patient
        ? [appointment.patient.firstName, appointment.patient.lastName]
            .filter(Boolean)
            .join(' ') || null
        : null,
      patientPhone: appointment.patient?.phone ?? null,
      doctorName: appointment.practice?.doctor?.name ?? null,
      doctorPhone: appointment.practice?.doctor?.phone ?? null,
      doctorSpecialty: appointment.practice?.doctor?.mainSpeciality?.name ?? null,
      hospitalName: appointment.practice?.hospital?.name ?? null,
      hospitalAddress: appointment.practice?.hospital?.address ?? null,
      hospitalCity: appointment.practice?.hospital?.city ?? null,
      scheduledAt: appointment.slot?.startTs?.toISOString() ?? null,
      fee: appointment.fee ?? null,
      status: appointment.status,
      paymentStatus: appointment.paymentStatus ?? null,
      createdAt: appointment.createdAt.toISOString(),
      notes: null, // TODO: Add these fields to schema
      appointmentInstructions: null, // TODO: Add these fields to schema
      messageStatus: null, // TODO: Add these fields to schema
      lastMessagePatient: null, // TODO: Add these fields to schema
      lastMessageDoctor: null, // TODO: Add these fields to schema
      probability: null, // TODO: Add these fields to schema
      createdToScheduledTime: appointment.slot?.startTs && appointment.createdAt
        ? this.calculateTimeDifference(appointment.createdAt, appointment.slot.startTs)
        : null,
      bookedBy: appointment.user?.fullName ?? null,
      bookedFrom: appointment.patient?.source ?? null,
      acquisition: appointment.patient?.utmSource
        ? `${appointment.patient.utmSource}${
            appointment.patient.utmMedium ? ` / ${appointment.patient.utmMedium}` : ''
          }${
            appointment.patient.utmCampaign ? ` / ${appointment.patient.utmCampaign}` : ''
          }`
        : null,
      onPanel: false, // TODO: Add this field to schema
    };
  }

  async edit(id: string, dto: EditAppointmentDto) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: BigInt(id), deletedAt: null },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    const updateData: any = {};

    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.paymentStatus !== undefined) updateData.paymentStatus = dto.paymentStatus;
    if (dto.fee !== undefined) updateData.fee = dto.fee;
    if (dto.slotId !== undefined) updateData.slotId = BigInt(dto.slotId);
    if (dto.notes !== undefined) updateData.notes = dto.notes;
    if (dto.appointmentInstructions !== undefined) updateData.appointmentInstructions = dto.appointmentInstructions;

    // Update appointment
    await this.prisma.appointment.update({
      where: { id: BigInt(id) },
      data: updateData,
    });

    // Update patient details if provided
    if (dto.patientDetails) {
      const patient = await this.prisma.appointment.findUnique({
        where: { id: BigInt(id) },
        select: { patientId: true },
      });

      if (patient?.patientId) {
        const patientUpdateData: any = {};
        if (dto.patientDetails.phone !== undefined) patientUpdateData.phone = dto.patientDetails.phone;
        if (dto.patientDetails.occupation !== undefined) patientUpdateData.occupation = dto.patientDetails.occupation;
        if (dto.patientDetails.age !== undefined) patientUpdateData.age = dto.patientDetails.age;
        if (dto.patientDetails.gender !== undefined) patientUpdateData.gender = dto.patientDetails.gender;
        if (dto.patientDetails.city !== undefined) patientUpdateData.city = dto.patientDetails.city;

        if (Object.keys(patientUpdateData).length > 0) {
          await this.prisma.patient.update({
            where: { id: patient.patientId },
            data: patientUpdateData,
          });
        }
      }
    }

    return { message: 'Appointment updated successfully' };
  }

  async getLookups() {
    // Get all specialties
    const specialties = await this.prisma.speciality.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });

    // Get all doctors with their specialties
    const doctors = await this.prisma.doctor.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        mainSpeciality: { select: { name: true } },
      },
      orderBy: { name: 'asc' },
    });

    // Get all patients
    const patients = await this.prisma.patient.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
      },
      orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
    });

    // Get all users (for booked by)
    const users = await this.prisma.user.findMany({
      where: { deletedAt: null, isActive: true },
      select: {
        id: true,
        fullName: true,
        email: true,
        type: { select: { typeName: true } },
      },
      orderBy: { fullName: 'asc' },
    });

    return {
      specialties: specialties.map(s => ({ id: s.id, name: s.name })),
      doctors: doctors.map(d => ({
        id: d.id.toString(),
        name: d.name || 'Unknown',
        specialty: d.mainSpeciality?.name || 'Unknown',
      })),
      patients: patients.map(p => ({
        id: p.id.toString(),
        name: [p.firstName, p.lastName].filter(Boolean).join(' ') || 'Unknown',
        phone: p.phone || 'N/A',
      })),
      users: users.map(u => ({
        id: u.id.toString(),
        name: u.fullName || u.email || 'Unknown',
        type: u.type.typeName,
      })),
    };
  }
}