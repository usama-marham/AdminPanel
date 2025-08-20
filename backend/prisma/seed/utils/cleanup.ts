import { PrismaClient } from '@prisma/client';

export async function cleanupModel(prisma: PrismaClient, modelName: string, debug = false) {
  if (debug) console.log(`🧹 Cleaning up ${modelName}...`);
  // @ts-ignore - Prisma client has dynamic model access
  await prisma[modelName].deleteMany({});
  if (debug) console.log(`✅ ${modelName} cleaned`);
}

export async function cleanupAll(prisma: PrismaClient, debug = false) {
  if (debug) console.log('🧹 Cleaning up all data...');

  // Order matters due to foreign key constraints - clean dependents first
  // Level 4: Most dependent tables
  await cleanupModel(prisma, 'messageLog', debug);
  await cleanupModel(prisma, 'appointment', debug);
  await cleanupModel(prisma, 'review', debug);
  
  // Level 3: Next level dependencies
  await cleanupModel(prisma, 'appointmentSlot', debug);
  await cleanupModel(prisma, 'availability', debug);
  await cleanupModel(prisma, 'patient', debug);
  
  // Level 2: Practice and user dependencies
  await cleanupModel(prisma, 'doctorPractice', debug);
  await cleanupModel(prisma, 'doctorSpeciality', debug);
  await cleanupModel(prisma, 'user', debug);
  
  // Level 1: Core entities
  await cleanupModel(prisma, 'doctor', debug);
  await cleanupModel(prisma, 'hospital', debug);
  
  // Level 0: Base lookup tables (least dependent)
  await cleanupModel(prisma, 'speciality', debug);
  await cleanupModel(prisma, 'category', debug);
  await cleanupModel(prisma, 'appointmentProbability', debug);
  await cleanupModel(prisma, 'paymentStatus', debug);
  await cleanupModel(prisma, 'appointmentType', debug);
  await cleanupModel(prisma, 'appointmentStatus', debug);
  await cleanupModel(prisma, 'userType', debug);

  if (debug) console.log('✅ All data cleaned');
} 