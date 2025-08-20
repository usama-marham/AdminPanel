import {
  Controller,
  Get,
  Query,
  Param,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { GetAppointmentsDto } from './dto/get-appointments.dto';
import { EditAppointmentDto } from './dto/edit-appointment.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('appointments')
// @UseGuards(AuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  list(@Query() dto: GetAppointmentsDto) {
    console.log('GET /appointments - Query params:', dto);
    return this.appointmentsService.list(dto);
  }

  @Get('lookups')
  getLookups() {
    console.log('GET /appointments/lookups');
    return this.appointmentsService.getLookups();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    console.log('GET /appointments/:id - ID:', id);
    try {
      const result = this.appointmentsService.get(id);
      console.log('GET /appointments/:id - Success');
      return result;
    } catch (error) {
      console.error('GET /appointments/:id - Error:', error);
      throw error;
    }
  }

  @Patch(':id')
  edit(@Param('id') id: string, @Body() dto: EditAppointmentDto) {
    console.log('PATCH /appointments/:id - ID:', id);
    console.log('PATCH /appointments/:id - Body:', dto);
    try {
      const result = this.appointmentsService.edit(id, dto);
      console.log('PATCH /appointments/:id - Success');
      return result;
    } catch (error) {
      console.error('PATCH /appointments/:id - Error:', error);
      throw error;
    }
  }
}
