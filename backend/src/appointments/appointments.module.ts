import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { BigIntInterceptor } from '../interceptors/bigint.interceptor';

@Module({
  controllers: [AppointmentsController],
  providers: [
    AppointmentsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: BigIntInterceptor,
    },
  ],
})
export class AppointmentsModule {}
