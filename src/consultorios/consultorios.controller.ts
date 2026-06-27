import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, NotFoundException, InternalServerErrorException,
} from '@nestjs/common';
import { ConsultoriosService } from './consultorios.service';
import { CreateConsultorioDto } from './dto/create-consultorio.dto';
import { UpdateConsultorioDto } from './dto/update-consultorio.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Consultorio } from './consultorio.entity';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('consultorios')
export class ConsultoriosController {
  constructor(private readonly consultoriosService: ConsultoriosService) {}

  @Post()
  async create(@Body() dto: CreateConsultorioDto) {
    const consultorio = await this.consultoriosService.create(dto);
    if (!consultorio) throw new InternalServerErrorException('Error al crear el consultorio');
    return new SuccessResponseDto('Consultorio creado exitosamente', consultorio);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Consultorio>>> {
    if (query.limit && query.limit > 100) query.limit = 100;
    const result = await this.consultoriosService.findAll(query);
    if (!result) throw new InternalServerErrorException('Error al listar consultorios');
    return new SuccessResponseDto('Consultorios obtenidos exitosamente', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const consultorio = await this.consultoriosService.findOne(id);
    if (!consultorio) throw new NotFoundException('Consultorio no encontrado');
    return new SuccessResponseDto('Consultorio obtenido exitosamente', consultorio);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateConsultorioDto) {
    const consultorio = await this.consultoriosService.update(id, dto);
    if (!consultorio) throw new NotFoundException('Consultorio no encontrado');
    return new SuccessResponseDto('Consultorio actualizado exitosamente', consultorio);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const consultorio = await this.consultoriosService.remove(id);
    if (!consultorio) throw new NotFoundException('Consultorio no encontrado');
    return new SuccessResponseDto('Consultorio eliminado exitosamente', consultorio);
  }
}