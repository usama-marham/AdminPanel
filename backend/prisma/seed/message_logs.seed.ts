import { faker } from '@faker-js/faker';
import { SeederContext } from './types';
import { pick } from './constants';

interface SeedMessageLogsOptions {
  appointments?: any[];
  users?: any[];
}

export async function seedMessageLogs(
  { prisma, debug = false }: SeederContext,
  { appointments = [], users = [] }: SeedMessageLogsOptions = {},
) {
  if (debug) console.log('🌱 Seeding message logs...');

  const messageLogs: any[] = [];
  const numMessages = faker.number.int({ min: 50, max: 200 });

  for (let i = 0; i < numMessages; i++) {
    const serviceType = pick([
      'PATIENT',
      'DOCTOR',
      'APPOINTMENT',
      'HOSPITAL',
    ]);

    const channel = pick([
      'SMS',
      'WHATSAPP',
      'EMAIL',
      'PUSH',
    ]);

    const direction = pick(['INBOUND', 'OUTBOUND']);
    const status = pick([
      'QUEUED',
      'SENT',
      'DELIVERED',
      'READ',
    ]);

    // Generate appropriate service ID based on service type
    let serviceId = faker.number.int({ min: 1, max: 100 });
    let appointmentId = null;
    let userId = null;

    if (serviceType === 'APPOINTMENT' && appointments.length > 0) {
      const appointment = pick(appointments);
      serviceId = appointment.id;
      appointmentId = appointment.id;
    } else if (serviceType === 'PATIENT' && users.length > 0) {
      const user = pick(users);
      serviceId = user.id;
      userId = user.id;
    }

    const messageLog = await prisma.messageLog.create({
      data: {
        serviceType: serviceType as any,
        serviceId: BigInt(serviceId),
        appointmentId: appointmentId ? BigInt(appointmentId) : null,
        userId: userId ? BigInt(userId) : null,
        channel: channel as any,
        direction: direction as any,
        toAddress: faker.phone.number(),
        fromAddress: faker.phone.number(),
        body: faker.lorem.sentence(),
        bodySha256: faker.string.alphanumeric(64),
        templateKey: pick(['APPT_REMINDER_V1', 'APPT_CONFIRMATION_V1', 'PAYMENT_REMINDER_V1']),
        provider: pick(['twilio', 'whatsapp_cloud', 'sendgrid']),
        providerMsgId: faker.string.alphanumeric(20),
        correlationId: faker.string.uuid(),
        status: status as any,
        queuedAt: faker.date.recent({ days: 7 }),
        sentAt: status !== 'QUEUED' ? faker.date.recent({ days: 6 }) : null,
        deliveredAt: ['DELIVERED', 'READ'].includes(status) ? faker.date.recent({ days: 5 }) : null,
        readAt: status === 'READ' ? faker.date.recent({ days: 4 }) : null,
        failedAt: status === 'FAILED' ? faker.date.recent({ days: 3 }) : null,
        errorCode: status === 'FAILED' ? 'DELIVERY_FAILED' : null,
        errorMessage: status === 'FAILED' ? 'Message delivery failed' : null,
        meta: {
          ip: faker.internet.ip(),
          userAgent: faker.internet.userAgent(),
        },
      },
    });

    messageLogs.push(messageLog);
  }

  if (debug) console.log(`✅ Seeded ${messageLogs.length} message logs`);
  return messageLogs;
}
