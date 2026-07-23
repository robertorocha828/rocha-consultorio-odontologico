import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, NotFoundException, InternalServerErrorException,
} from '@nestjs/common';
import { HorariosService } from './horarios.service';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Horario } from './horario.entity';
import { SuccessResponseDto } from '../common/dto/response.dto';
import { QueryDto } from '../common/dto/query.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('horarios')
export class HorariosController {
  constructor(private readonly horariosService: HorariosService) {}

  @Roles('admin')
  @Post()
  async create(@Body() dto: CreateHorarioDto) {
    const horario = await this.horariosService.create(dto);
    if (!horario) throw new InternalServerErrorException('Error al crear el horario');
    return new SuccessResponseDto('Horario creado exitosamente', horario);
  }

  @Roles('admin')
  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Horario>>> {
    if (query.limit && query.limit > 100) query.limit = 100;
    const result = await this.horariosService.findAll(query);
    if (!result) throw new InternalServerErrorException('Error al listar horarios');
    return new SuccessResponseDto('Horarios obtenidos exitosamente', result);
  }

  @Roles('admin')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const horario = await this.horariosService.findOne(id);
    if (!horario) throw new NotFoundException('Horario no encontrado');
    return new SuccessResponseDto('Horario obtenido exitosamente', horario);
  }

  @Roles('admin')
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateHorarioDto) {
    const horario = await this.horariosService.update(id, dto);
    if (!horario) throw new NotFoundException('Horario no encontrado');
    return new SuccessResponseDto('Horario actualizado exitosamente', horario);
  }

  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const horario = await this.horariosService.remove(id);
    if (!horario) throw new NotFoundException('Horario no encontrado');
    return new SuccessResponseDto('Horario eliminado exitosamente', horario);
  }
}