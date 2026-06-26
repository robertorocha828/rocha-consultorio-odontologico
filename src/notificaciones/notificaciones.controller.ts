import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, NotFoundException, InternalServerErrorException,
} from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { UpdateNotificacionDto } from './dto/update-notificacion.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  @Post()
  async create(@Body() dto: CreateNotificacionDto) {
    const result = await this.notificacionesService.create(dto);
    if (!result) throw new InternalServerErrorException('Error al crear la notificación');
    return new SuccessResponseDto('Notificación creada exitosamente', result);
  }

  @Get()
  async findAll(@Query() query: QueryDto) {
    if (query.limit && query.limit > 100) query.limit = 100;
    const result = await this.notificacionesService.findAll(query);
    if (!result) throw new InternalServerErrorException('Error al listar notificaciones');
    return new SuccessResponseDto('Notificaciones obtenidas exitosamente', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.notificacionesService.findOne(id);
    if (!result) throw new NotFoundException('Notificación no encontrada');
    return new SuccessResponseDto('Notificación obtenida exitosamente', result);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateNotificacionDto) {
    const result = await this.notificacionesService.update(id, dto);
    if (!result) throw new NotFoundException('Notificación no encontrada');
    return new SuccessResponseDto('Notificación actualizada exitosamente', result);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.notificacionesService.remove(id);
    if (!result) throw new NotFoundException('Notificación no encontrada');
    return new SuccessResponseDto('Notificación eliminada exitosamente', result);
  }
}
