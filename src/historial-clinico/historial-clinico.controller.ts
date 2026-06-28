import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, NotFoundException, InternalServerErrorException,
} from '@nestjs/common';
import { HistorialClinicoService } from './historial-clinico.service';
import { CreateHistorialClinicoDto } from './dto/create-historial-clinico.dto';
import { UpdateHistorialClinicoDto } from './dto/update-historial-clinico.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('historial-clinico')
export class HistorialClinicoController {
  constructor(private readonly historialService: HistorialClinicoService) {}

  @Post()
  async create(@Body() dto: CreateHistorialClinicoDto) {
    const result = await this.historialService.create(dto);
    if (!result) throw new InternalServerErrorException('Error al crear el historial clínico');
    return new SuccessResponseDto('Historial clínico creado exitosamente', result);
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const result = await this.historialService.findAll({ page: +page, limit: +limit });
    if (!result) throw new InternalServerErrorException('Error al listar historiales');
    return new SuccessResponseDto('Historiales obtenidos exitosamente', result);
  }

  @Get('paciente/:pacienteId')
  async findByPaciente(
    @Param('pacienteId') pacienteId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const result = await this.historialService.findByPaciente(pacienteId, {
      page: +page,
      limit: +limit,
    });
    if (!result) throw new InternalServerErrorException('Error al buscar historiales del paciente');
    return new SuccessResponseDto('Historiales del paciente obtenidos', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.historialService.findOne(id);
    if (!result) throw new NotFoundException('Historial clínico no encontrado');
    return new SuccessResponseDto('Historial clínico obtenido exitosamente', result);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateHistorialClinicoDto) {
    const result = await this.historialService.update(id, dto);
    if (!result) throw new NotFoundException('Historial clínico no encontrado');
    return new SuccessResponseDto('Historial clínico actualizado exitosamente', result);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.historialService.remove(id);
    if (!result) throw new NotFoundException('Historial clínico no encontrado');
    return new SuccessResponseDto('Historial clínico eliminado exitosamente', result);
  }
}
