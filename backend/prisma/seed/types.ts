import { PrismaClient } from '@prisma/client';

export interface SeederContext {
  prisma: PrismaClient;
  debug?: boolean;
}

export interface SeederOptions {
  debug?: boolean;
} 