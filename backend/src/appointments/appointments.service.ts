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

  private convertBigIntToString(value: any): any {
    if (value === null || value === undefined) {
      return value;
    }

    if (typeof value === 'bigint') {
      return value.toString();
    }

    if (Array.isArray(value)) {
      return value.map(item => this.convertBigIntToString(item));
    }

    if (typeof value === 'object') {
      const converted: any = {};
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          converted[key] = this.convertBigIntToString(value[key]);
        }
      }
      return converted;
    }

    return value;
  }

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
      maxFee,
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

    // Add status filters (updated to new schema fields)
    if (status !== undefined) {
      where.appointmentStatusId = status;
    }
    if (paymentStatus !== undefined) {
      where.paymentStatusId = paymentStatus;
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

    // Add scheduled date filters (updated to appointmentDateTime)
    if (scheduledDateFrom || scheduledDateTo) {
      where.appointmentDateTime = {} as any;
      if (scheduledDateFrom) {
        (where.appointmentDateTime as any).gte = new Date(scheduledDateFrom);
      }
      if (scheduledDateTo) {
        (where.appointmentDateTime as any).lte = new Date(scheduledDateTo);
      }
    }

    // Fetch lookup data for transformations
    const [appointmentStatuses, paymentStatuses, appointmentProbabilities, userTypes, totalCount, appointments] = await this.prisma.$transaction([
      this.prisma.appointmentStatus.findMany({
        where: { deletedAt: null },
        select: { id: true, title: true },
      }),
      this.prisma.paymentStatus.findMany({
        where: { deletedAt: null },
        select: { id: true, title: true },
      }),
      this.prisma.appointmentProbability.findMany({
        where: { deletedAt: null },
        select: { id: true, name: true },
      }),
      this.prisma.userType.findMany({
        select: { id: true, typeName: true },
      }),
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
              visitorSource: true,
              utmSource: true,
              utmMedium: true,
              utmCampaign: true,
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
                  phone: true, // Include hospital phone
                },
              },
              onPanel: true, // Include on-panel status
              allowsDirectBooking: true, // Include direct booking flag
            },
          },
        },
      }),
    ]);

    // Create lookup maps for efficient transformations
    const statusMap = new Map(appointmentStatuses.map(s => [s.id, s.title]));
    const paymentStatusMap = new Map(paymentStatuses.map(s => [s.id, s.title]));
    const probabilityMap = new Map(appointmentProbabilities.map(p => [p.id, p.name]));
    const userTypeMap = new Map(userTypes.map(t => [t.id, t.typeName]));

    const data: AppointmentListItemDto[] = await Promise.all(appointments.map(async (appointment) => {
      const patientName = appointment.patient
        ? [appointment.patient.firstName, appointment.patient.lastName]
            .filter(Boolean)
            .join(' ') || null
        : null;

      // Calculate time difference between creation and scheduled time
      const createdToScheduledTime =
        appointment.appointmentDateTime && appointment.createdAt
          ? this.calculateTimeDifference(
              appointment.createdAt,
              appointment.appointmentDateTime,
            )
          : null;

      // Combine UTM parameters for acquisition info
      const acquisition = appointment.patient?.utmSource
        ? `${appointment.patient.utmSource}${
            appointment.patient.utmMedium
              ? ` / ${appointment.patient.utmMedium}`
              : ''
          }${
            appointment.patient.utmCampaign
              ? ` / ${appointment.patient.utmCampaign}`
              : ''
          }`
        : null;

      const messageStatus = await this.getMessageStatus(appointment.id);

      return {
        id: appointment.id.toString(),

        // Patient Info
        patientName,
        patientPhone: appointment.patient?.phone ?? null,

        // Doctor Info
        doctorName: appointment.practice?.doctor?.name ?? null,
        doctorPhone: appointment.practice?.doctor?.phone ?? null,
        doctorSpecialty:
          appointment.practice?.doctor?.mainSpeciality?.name ?? null,

        // Hospital Info
        hospitalName: appointment.practice?.hospital?.name ?? null,
        hospitalAddress: appointment.practice?.hospital?.address ?? null,
        hospitalCity: appointment.practice?.hospital?.city ?? null,
        hospitalPhone: appointment.practice?.hospital?.phone ?? null,

        // Appointment Times
        scheduledAt: appointment.appointmentDateTime?.toISOString() ?? null,
        createdToScheduledTime,

        // Fees and Payment
        fee: appointment.fee ?? null,
        paymentStatus: (appointment as any).paymentStatusId 
          ? paymentStatusMap.get((appointment as any).paymentStatusId) ?? null
          : null,

        // Status and Messages
        appointmentStatus: (appointment as any).appointmentStatusId 
          ? statusMap.get((appointment as any).appointmentStatusId) ?? null
          : null,
        messageStatus: messageStatus,
        lastMessagePatient: null, // TODO: Add to schema
        lastMessageDoctor: null, // TODO: Add to schema

        // Booking Info
        bookedBy: appointment.user?.userTypeId 
          ? userTypeMap.get(appointment.user.userTypeId) ?? null
          : null,
        bookedFrom: appointment.patient?.visitorSource ?? null,
        probability: (appointment as any).probabilityId 
          ? probabilityMap.get((appointment as any).probabilityId) ?? null
          : null,
        acquisition,

        // Doctor Practice Info
        directBookingAllowed: appointment.practice?.allowsDirectBooking ?? null,
        onPanel: appointment.practice?.onPanel ?? false,

        createdAt: appointment.createdAt.toISOString(),
      };
    }));

    return this.convertBigIntToString({
      data,
      meta: {
        page: pageNum,
        pageSize: pageSizeNum,
        total: totalCount,
        pages: Math.max(1, Math.ceil(totalCount / pageSizeNum)),
      },
    });
  }

  private calculateTimeDifference(createdAt: Date, scheduledAt: Date): string {
    const diffInHours =
      Math.abs(scheduledAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return `${Math.round(diffInHours)} hours`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days} days`;
    }
  }

  private async getMessageStatus(appointmentId: BigInt): Promise<string | null> {
    // TODO: Fix BigInt type issues with Prisma filters
    // For now, return a placeholder status
    return 'No Messages';
    
    /*
    try {
      // Check if there are any delivered messages for this appointment
      const deliveredMessage = await this.prisma.messageLog.findFirst({
        where: {
          appointmentId: { equals: appointmentId },
          deletedAt: null,
          status: 'DELIVERED' as any, // Using string literal since enum might not be available
        },
        orderBy: { createdAt: 'desc' },
      });

      if (deliveredMessage) {
        return 'Delivered';
      }

      // Check if there are any failed messages
      const failedMessage = await this.prisma.messageLog.findFirst({
        where: {
          appointmentId: { equals: appointmentId },
          deletedAt: null,
          status: 'FAILED' as any,
        },
        orderBy: { createdAt: 'desc' },
      });

      if (failedMessage) {
        return 'Failed';
      }

      // Check if there are any queued/sent messages
      const pendingMessage = await this.prisma.messageLog.findFirst({
        where: {
          appointmentId: { equals: appointmentId },
          deletedAt: null,
          status: { in: ['QUEUED', 'SENT'] as any[] },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (pendingMessage) {
        return 'Pending';
      }

      return 'No Messages';
    } catch (error) {
      console.error('Error checking message status:', error);
      return null;
    }
    */
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
            visitorSource: true,
            utmSource: true,
            utmMedium: true,
            utmCampaign: true,
          },
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
            hospital: { select: { name: true, address: true, city: true, phone: true } },
            onPanel: true,
            allowsDirectBooking: true,
          },
        },
      },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    // Fetch lookup data for transformations
    const [appointmentStatuses, paymentStatuses, appointmentProbabilities, userTypes] = await this.prisma.$transaction([
      this.prisma.appointmentStatus.findMany({
        where: { deletedAt: null },
        select: { id: true, title: true },
      }),
      this.prisma.paymentStatus.findMany({
        where: { deletedAt: null },
        select: { id: true, title: true },
      }),
      this.prisma.appointmentProbability.findMany({
        where: { deletedAt: null },
        select: { id: true, name: true },
      }),
      this.prisma.userType.findMany({
        select: { id: true, typeName: true },
      }),
    ]);

    // Create lookup maps for efficient transformations
    const statusMap = new Map(appointmentStatuses.map(s => [s.id, s.title]));
    const paymentStatusMap = new Map(paymentStatuses.map(s => [s.id, s.title]));
    const probabilityMap = new Map(appointmentProbabilities.map(p => [p.id, p.name]));
    const userTypeMap = new Map(userTypes.map(t => [t.id, t.typeName]));

    const messageStatus = await this.getMessageStatus(appointment.id);

    return this.convertBigIntToString({
      id: appointment.id.toString(),
      patientName: appointment.patient
        ? [appointment.patient.firstName, appointment.patient.lastName]
            .filter(Boolean)
            .join(' ') || null
        : null,
      patientPhone: appointment.patient?.phone ?? null,
      doctorName: appointment.practice?.doctor?.name ?? null,
      doctorPhone: appointment.practice?.doctor?.phone ?? null,
      doctorSpecialty:
        appointment.practice?.doctor?.mainSpeciality?.name ?? null,
      hospitalName: appointment.practice?.hospital?.name ?? null,
      hospitalAddress: appointment.practice?.hospital?.address ?? null,
      hospitalCity: appointment.practice?.hospital?.city ?? null,
      hospitalPhone: appointment.practice?.hospital?.phone ?? null,
      scheduledAt: appointment.appointmentDateTime?.toISOString() ?? null,
      fee: appointment.fee ?? null,
      appointmentStatus: (appointment as any).appointmentStatusId 
        ? statusMap.get((appointment as any).appointmentStatusId) ?? null
        : null,
      paymentStatus: (appointment as any).paymentStatusId 
        ? paymentStatusMap.get((appointment as any).paymentStatusId) ?? null
        : null,
      createdAt: appointment.createdAt.toISOString(),
      notes: null, // TODO: Add these fields to schema
      appointmentInstructions: null, // TODO: Add these fields to schema
      messageStatus: messageStatus,
      lastMessagePatient: null, // TODO: Add these fields to schema
      lastMessageDoctor: null, // TODO: Add these fields to schema
      probability: (appointment as any).probabilityId 
        ? probabilityMap.get((appointment as any).probabilityId) ?? null
        : null,
      createdToScheduledTime:
        appointment.appointmentDateTime && appointment.createdAt
          ? this.calculateTimeDifference(
              appointment.createdAt,
              appointment.appointmentDateTime,
            )
          : null,
      bookedBy: appointment.user?.userTypeId 
        ? userTypeMap.get(appointment.user.userTypeId) ?? null
        : null,
      bookedFrom: appointment.patient?.visitorSource ?? null,
      acquisition: appointment.patient?.utmSource
        ? `${appointment.patient.utmSource}${
            appointment.patient.utmMedium
              ? ` / ${appointment.patient.utmMedium}`
              : ''
          }${
            appointment.patient.utmCampaign
              ? ` / ${appointment.patient.utmCampaign}`
              : ''
          }`
        : null,
      onPanel: appointment.practice?.onPanel ?? false,
      directBookingAllowed: appointment.practice?.allowsDirectBooking ?? null,
    });
  }

  async edit(id: string, dto: EditAppointmentDto) {
    console.log('Edit method called with ID:', id);
    console.log('Edit DTO received:', dto);
    
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: BigInt(id), deletedAt: null },
      include: {
        practice: {
          include: {
            doctor: true,
            hospital: true,
          },
        },
        patient: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    console.log('Appointment found:', appointment.id);

    // Get lookup data for status conversions
    const [appointmentStatuses, paymentStatuses, appointmentProbabilities] = await Promise.all([
      this.prisma.appointmentStatus.findMany({
        where: { deletedAt: null },
        select: { id: true, title: true },
      }),
      this.prisma.paymentStatus.findMany({
        where: { deletedAt: null },
        select: { id: true, title: true },
      }),
      this.prisma.appointmentProbability.findMany({
        where: { deletedAt: null },
        select: { id: true, name: true },
      }),
    ]);

    console.log('Lookup data loaded:', {
      appointmentStatuses: appointmentStatuses.length,
      paymentStatuses: paymentStatuses.length,
      appointmentProbabilities: appointmentProbabilities.length
    });

    const updateData: any = {};

    // Convert string status to ID and update
    if (dto.appointmentStatus !== undefined) {
      console.log('Processing appointmentStatus:', dto.appointmentStatus);
      const status = appointmentStatuses.find(s => s.title === dto.appointmentStatus);
      if (status) {
        updateData.appointmentStatus = { connect: { id: status.id } };
        console.log('Found status ID:', status.id);
      } else {
        console.log('Status not found. Available statuses:', appointmentStatuses.map(s => s.title));
        throw new NotFoundException(`Appointment status '${dto.appointmentStatus}' not found`);
      }
    }

    if (dto.paymentStatus !== undefined) {
      console.log('Processing paymentStatus:', dto.paymentStatus);
      const paymentStatus = paymentStatuses.find(ps => ps.title === dto.paymentStatus);
      if (paymentStatus) {
        updateData.paymentStatus = { connect: { id: paymentStatus.id } };
        console.log('Found payment status ID:', paymentStatus.id);
      } else {
        console.log('Payment status not found. Available statuses:', paymentStatuses.map(ps => ps.title));
        throw new NotFoundException(`Payment status '${dto.paymentStatus}' not found`);
      }
    }

    if (dto.probability !== undefined) {
      console.log('Processing probability:', dto.probability);
      const probability = appointmentProbabilities.find(p => p.name === dto.probability);
      if (probability) {
        updateData.probability = { connect: { id: probability.id } };
        console.log('Found probability ID:', probability.id);
      } else {
        console.log('Probability not found. Available probabilities:', appointmentProbabilities.map(p => p.name));
        throw new NotFoundException(`Probability '${dto.probability}' not found`);
      }
    }

    if (dto.fee !== undefined) updateData.fee = dto.fee;
    // Remove notes and appointmentInstructions since they don't exist in the schema
    // if (dto.notes !== undefined) updateData.notes = dto.notes;
    // if (dto.appointmentInstructions !== undefined) updateData.appointmentInstructions = dto.appointmentInstructions;
    if (dto.appointmentDateTime !== undefined) updateData.appointmentDateTime = new Date(dto.appointmentDateTime);

    console.log('Final updateData for appointment:', updateData);

    // Update appointment
    try {
      await this.prisma.appointment.update({
        where: { id: BigInt(id) },
        data: updateData,
      });
      console.log('Appointment update successful');
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }

    // Update practice details if provided
    if (dto.onPanel !== undefined || dto.directBookingAllowed !== undefined) {
      if (!appointment.practice) {
        throw new NotFoundException('Practice information not found for this appointment');
      }

      const practiceUpdateData: any = {};
      if (dto.onPanel !== undefined) practiceUpdateData.onPanel = dto.onPanel;
      if (dto.directBookingAllowed !== undefined) practiceUpdateData.allowsDirectBooking = dto.directBookingAllowed;

      if (Object.keys(practiceUpdateData).length > 0) {
        await this.prisma.doctorPractice.update({
          where: { id: appointment.practice.id },
          data: practiceUpdateData,
        });
      }
    }

    // Update patient details if provided
    if (dto.patientDetails && Object.keys(dto.patientDetails).length > 0) {
      console.log('Updating patient details:', dto.patientDetails);
      if (!appointment.patient) {
        throw new NotFoundException('Patient information not found for this appointment');
      }

      const patientUpdateData: any = {};
      // Only update fields that exist in the Patient model
      if (dto.patientDetails.phone !== undefined) patientUpdateData.phone = dto.patientDetails.phone;
      // Remove fields that don't exist in the schema:
      // if (dto.patientDetails.occupation !== undefined) patientUpdateData.occupation = dto.patientDetails.occupation;
      // if (dto.patientDetails.age !== undefined) patientUpdateData.age = dto.patientDetails.age;
      // if (dto.patientDetails.gender !== undefined) patientUpdateData.gender = dto.patientDetails.gender;
      // if (dto.patientDetails.city !== undefined) patientUpdateData.city = dto.patientDetails.city;
      if (dto.patientDetails.firstName !== undefined) patientUpdateData.firstName = dto.patientDetails.firstName;
      if (dto.patientDetails.lastName !== undefined) patientUpdateData.lastName = dto.patientDetails.lastName;

      console.log('Patient update data:', patientUpdateData);

      if (Object.keys(patientUpdateData).length > 0) {
        try {
          await this.prisma.patient.update({
            where: { id: appointment.patient.id },
            data: patientUpdateData,
          });
          console.log('Patient update successful');
        } catch (error) {
          console.error('Error updating patient:', error);
          throw error;
        }
      }
    }

    // Update doctor details if provided
    if (dto.doctorDetails && Object.keys(dto.doctorDetails).length > 0) {
      if (!appointment.practice?.doctor) {
        throw new NotFoundException('Doctor information not found for this appointment');
      }

      const doctorUpdateData: any = {};
      if (dto.doctorDetails.name !== undefined) doctorUpdateData.name = dto.doctorDetails.name;
      if (dto.doctorDetails.phone !== undefined) doctorUpdateData.phone = dto.doctorDetails.phone;
      if (dto.doctorDetails.email !== undefined) doctorUpdateData.email = dto.doctorDetails.email;

      if (Object.keys(doctorUpdateData).length > 0) {
        await this.prisma.doctor.update({
          where: { id: appointment.practice.doctor.id },
          data: doctorUpdateData,
        });
      }
    }

    // Update hospital details if provided
    if (dto.hospitalDetails && Object.keys(dto.hospitalDetails).length > 0) {
      if (!appointment.practice?.hospital) {
        throw new NotFoundException('Hospital information not found for this appointment');
      }

      const hospitalUpdateData: any = {};
      if (dto.hospitalDetails.name !== undefined) hospitalUpdateData.name = dto.hospitalDetails.name;
      if (dto.hospitalDetails.phone !== undefined) hospitalUpdateData.phone = dto.hospitalDetails.phone;
      if (dto.hospitalDetails.address !== undefined) hospitalUpdateData.address = dto.hospitalDetails.address;
      if (dto.hospitalDetails.city !== undefined) hospitalUpdateData.city = dto.hospitalDetails.city;

      if (Object.keys(hospitalUpdateData).length > 0) {
        await this.prisma.hospital.update({
          where: { id: appointment.practice.hospital.id },
          data: hospitalUpdateData,
        });
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

    // Get all appointment statuses
    const appointmentStatuses = await this.prisma.appointmentStatus.findMany({
      where: { deletedAt: null },
      select: { id: true, title: true },
      orderBy: { title: 'asc' },
    });

    // Get all payment statuses
    const paymentStatuses = await this.prisma.paymentStatus.findMany({
      where: { deletedAt: null },
      select: { id: true, title: true },
      orderBy: { title: 'asc' },
    });

    // Get all appointment probabilities
    const appointmentProbabilities = await this.prisma.appointmentProbability.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });

    return this.convertBigIntToString({
      specialties: specialties.map((s) => ({ id: s.id, name: s.name })),
      doctors: doctors.map((d) => ({
        id: d.id.toString(),
        name: d.name || 'Unknown',
        specialty: d.mainSpeciality?.name || 'Unknown',
      })),
      patients: patients.map((p) => ({
        id: p.id.toString(),
        name: [p.firstName, p.lastName].filter(Boolean).join(' ') || 'Unknown',
        phone: p.phone || 'N/A',
      })),
      users: users.map((u) => ({
        id: u.id.toString(),
        name: u.fullName || u.email || 'Unknown',
        type: u.type.typeName,
      })),
      appointmentStatuses: appointmentStatuses.map((s) => ({ id: s.id, title: s.title })),
      paymentStatuses: paymentStatuses.map((s) => ({ id: s.id, title: s.title })),
      probabilities: appointmentProbabilities.map((p) => ({ id: p.id, name: p.name })),
    });
  }
}
