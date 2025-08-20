import { PrismaClient } from '@prisma/client';
import { SeederContext } from './types';

export async function seedPaymentStatuses(context: SeederContext) {
  const { prisma } = context;

  console.log('🌱 Seeding payment statuses...');

  const paymentStatuses = [
    {
      id: 1,
      title: 'Unpaid',
      statusKey: 'UNPAID',
      description: 'Payment has not been received',
      isActive: true,
    },
    {
      id: 2,
      title: 'Paid',
      statusKey: 'PAID',
      description: 'Payment has been received in full',
      isActive: true,
    },
    {
      id: 3,
      title: 'Evidence Received',
      statusKey: 'EVIDENCE_RECEIVED',
      description: 'Payment evidence has been submitted',
      isActive: true,
    },
    {
      id: 4,
      title: 'Pending',
      statusKey: 'PENDING',
      description: 'Payment is being processed',
      isActive: true,
    },
    {
      id: 5,
      title: 'To Be Refunded',
      statusKey: 'TO_BE_REFUNDED',
      description: 'Payment is marked for refund',
      isActive: true,
    },
    {
      id: 6,
      title: 'Refunded',
      statusKey: 'REFUNDED',
      description: 'Payment has been refunded',
      isActive: true,
    },
  ];

  for (const status of paymentStatuses) {
    await prisma.paymentStatus.upsert({
      where: { id: status.id },
      update: status,
      create: status,
    });
  }

  console.log(`✅ Seeded ${paymentStatuses.length} payment statuses`);
  return paymentStatuses;
}
