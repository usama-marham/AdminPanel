import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetAppointmentsDto } from './dto/get-appointments.dto';
import {
  AppointmentListItemDto,
  AppointmentListResponseDto,
} from './dto/appointment-list-item.dto';
import { EditAppointmentDto } from './dto/edit-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(public prisma: PrismaService) {}

  async list(dto: GetAppointmentsDto): Promise<AppointmentListResponseDto> {
    const { page = 1, pageSize = 10, q } = dto;
    const pageNum = Number(page);
    const pageSizeNum = Number(pageSize);
    const skip = (pageNum - 1) * pageSizeNum;
    const take = pageSizeNum;

    const where = {
      deletedAt: null as Date | null,
      OR: q
        ? [
            { patient: { firstName: { contains: q, mode: 'insensitive' } } },
            { patient: { lastName: { contains: q, mode: 'insensitive' } } },
            { patient: { phone: { contains: q } } },
            {
              practice: {
                doctor: { name: { contains: q, mode: 'insensitive' } },
              },
            },
            {
              practice: {
                hospital: { name: { contains: q, mode: 'insensitive' } },
              },
            },
          ]
        : undefined,
    };

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.appointment.count({ where }),
      this.prisma.appointment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        select: {
          id: true,
          createdAt: true,
          status: true,
          paymentStatus: true,
          fee: true,

          patient: {
            select: {
              firstName: true,
              lastName: true,
              phone: true,
            },
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

    const data: AppointmentListItemDto[] = rows.map((row) => {
      const patientName = row.patient
        ? [row.patient.firstName, row.patient.lastName]
            .filter(Boolean)
            .join(' ') || null
        : null;

      return {
        id: row.id.toString(), // Convert BigInt to string
        patientName,
        patientPhone: row.patient?.phone ?? null,

        doctorName: row.practice?.doctor?.name ?? null,
        doctorSpecialty: row.practice?.doctor?.mainSpeciality?.name ?? null,
        doctorPhone: row.practice?.doctor?.phone ?? null,

        hospitalName: row.practice?.hospital?.name ?? null,
        hospitalAddress: row.practice?.hospital?.address ?? null,
        hospitalCity: row.practice?.hospital?.city ?? null,

        scheduledAt: row.slot?.startTs?.toISOString() ?? null,
        fee: row.fee ?? null,

        status: row.status,
        paymentStatus: row.paymentStatus ?? null,

        createdAt: row.createdAt.toISOString(),
      };
    });

    return {
      data,
      meta: {
        page,
        pageSize,
        total,
        pages: Math.max(1, Math.ceil(total / pageSize)),
      },
    };
  }

  async get(id: number) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        practice: {
          include: {
            doctor: {
              include: {
                mainSpeciality: true,
              },
            },
            hospital: true,
          },
        },
        slot: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    const patientName = appointment.patient
      ? [appointment.patient.firstName, appointment.patient.lastName]
          .filter(Boolean)
          .join(' ') || null
      : null;

    return {
      id: appointment.id.toString(),
      patientName,
      patientPhone: appointment.patient?.phone ?? null,
      patientGender: appointment.patient?.gender ?? null,
      patientCity: appointment.patient?.city ?? null,

      doctorName: appointment.practice?.doctor?.name ?? null,
      doctorSpecialty: appointment.practice?.doctor?.mainSpeciality?.name ?? null,
      doctorPhone: appointment.practice?.doctor?.phone ?? null,

      hospitalName: appointment.practice?.hospital?.name ?? null,
      hospitalAddress: appointment.practice?.hospital?.address ?? null,
      hospitalCity: appointment.practice?.hospital?.city ?? null,

      scheduledAt: appointment.slot?.startTs?.toISOString() ?? null,
      fee: appointment.fee ?? null,

      status: appointment.status,
      paymentStatus: appointment.paymentStatus ?? null,

      notes: null, // TODO: Add these fields to schema
      appointmentInstructions: null, // TODO: Add these fields to schema

      createdAt: appointment.createdAt.toISOString(),
    };
  }

  async edit(id: number, dto: EditAppointmentDto) {
    // First check if appointment exists
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    // If changing slot, verify the new slot exists and is available
    if (dto.slotId) {
      const existingAppointment = await this.prisma.appointment.findFirst({
        where: {
          slotId: dto.slotId,
          id: { not: id },
          deletedAt: null,
        },
      });

      if (existingAppointment) {
        throw new Error('Selected slot is already booked');
      }

      const slot = await this.prisma.appointmentSlot.findUnique({
        where: { id: dto.slotId },
      });

      if (!slot) {
        throw new NotFoundException(`Slot with ID ${dto.slotId} not found`);
      }
    }

    // Prepare update data
    const updateData: any = {};

    if (dto.status !== undefined) {
      updateData.status = dto.status;
    }

    if (dto.paymentStatus !== undefined) {
      updateData.paymentStatus = dto.paymentStatus;
    }

    if (dto.fee !== undefined) {
      updateData.fee = dto.fee;
    }

    if (dto.slotId !== undefined) {
      updateData.slotId = dto.slotId;
    }

    if (dto.notes !== undefined) {
      updateData.notes = dto.notes;
    }

    if (dto.appointmentInstructions !== undefined) {
      updateData.appointmentInstructions = dto.appointmentInstructions;
    }

    // If patient details are provided, update the patient record
    if (dto.patientDetails) {
      const { patientId } = appointment;
      if (patientId) {
        await this.prisma.patient.update({
          where: { id: patientId },
          data: {
            phone: dto.patientDetails.phone,
            gender: dto.patientDetails.gender,
            city: dto.patientDetails.city,
          },
        });
      }
    }

    // Update the appointment
    const updatedAppointment = await this.prisma.appointment.update({
      where: { id },
      data: updateData,
      include: {
        patient: true,
        slot: {
          select: {
            startTs: true,
          },
        },
        practice: {
          select: {
            doctor: {
              select: {
                name: true,
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
                city: true,
              },
            },
          },
        },
      },
    });

    const patientName = updatedAppointment.patient
      ? [updatedAppointment.patient.firstName, updatedAppointment.patient.lastName]
          .filter(Boolean)
          .join(' ') || null
      : null;

    return {
      id: updatedAppointment.id.toString(),
      patientName,
      patientPhone: updatedAppointment.patient?.phone ?? null,
      patientGender: updatedAppointment.patient?.gender ?? null,
      patientCity: updatedAppointment.patient?.city ?? null,
      status: updatedAppointment.status,
      paymentStatus: updatedAppointment.paymentStatus,
      fee: updatedAppointment.fee,
      scheduledAt: updatedAppointment.slot?.startTs?.toISOString() ?? null,
      doctorName: updatedAppointment.practice?.doctor?.name ?? null,
      doctorSpecialty: updatedAppointment.practice?.doctor?.mainSpeciality?.name ?? null,
      hospitalName: updatedAppointment.practice?.hospital?.name ?? null,
      hospitalCity: updatedAppointment.practice?.hospital?.city ?? null,
      updatedAt: updatedAppointment.updatedAt.toISOString(),
    };
  }
}
