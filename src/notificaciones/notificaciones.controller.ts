import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, NotFoundException, InternalServerErrorException,
} from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { UpdateNotificacionDto } from './dto/update-notificacion.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  @Roles('admin')
  @Post()
  async create(@Body() dto: CreateNotificacionDto) {
    const result = await this.notificacionesService.create(dto);
    if (!result) throw new InternalServerErrorException('Error al crear la notificación');
    return new SuccessResponseDto('Notificación creada exitosamente', result);
  }

  @Roles('admin')
  @Get()
  async findAll(@Query() query: QueryDto) {
    if (query.limit && query.limit > 100) query.limit = 100;
    const result = await this.notificacionesService.findAll(query);
    if (!result) throw new InternalServerErrorException('Error al listar notificaciones');
    return new SuccessResponseDto('Notificaciones obtenidas exitosamente', result);
  }

  @Roles('admin')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.notificacionesService.findOne(id);
    if (!result) throw new NotFoundException('Notificación no encontrada');
    return new SuccessResponseDto('Notificación obtenida exitosamente', result);
  }

  @Roles('admin')
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateNotificacionDto) {
    const result = await this.notificacionesService.update(id, dto);
    if (!result) throw new NotFoundException('Notificación no encontrada');
    return new SuccessResponseDto('Notificación actualizada exitosamente', result);
  }

  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.notificacionesService.remove(id);
    if (!result) throw new NotFoundException('Notificación no encontrada');
    return new SuccessResponseDto('Notificación eliminada exitosamente', result);
  }
}