import { Controller, Get, Query, Param, Patch, Body, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { GetAppointmentsDto } from './dto/get-appointments.dto';
import { EditAppointmentDto } from './dto/edit-appointment.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('v1/appointments')
@UseGuards(AuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  list(@Query() dto: GetAppointmentsDto) {
    return this.appointmentsService.list(dto);
  }

  @Get('lookups')
  getLookups() {
    return this.appointmentsService.getLookups();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.appointmentsService.get(id);
  }

  @Patch(':id')
  edit(@Param('id') id: string, @Body() dto: EditAppointmentDto) {
    return this.appointmentsService.edit(id, dto);
  }
}
