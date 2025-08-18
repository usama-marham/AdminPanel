import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: 'super-secret-key-change-in-production',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, ConfigService],
  exports: [JwtModule],
})
export class AuthModule {}
