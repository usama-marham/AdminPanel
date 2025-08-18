import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { GetAppointmentsDto } from './dto/get-appointments.dto';
import { AppointmentListResponseDto } from './dto/appointment-list-item.dto';
import { EditAppointmentDto } from './dto/edit-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Get()
  async list(
    @Query() query: GetAppointmentsDto,
  ): Promise<AppointmentListResponseDto> {
    return this.appointmentsService.list(query);
  }

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.get(id);
  }

  @Patch(':id')
  async edit(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EditAppointmentDto,
  ) {
    return this.appointmentsService.edit(id, dto);
  }
}
