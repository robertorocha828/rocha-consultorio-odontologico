import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, NotFoundException, InternalServerErrorException,
} from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Paciente } from './paciente.entity';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) { }

  @Post()
  async create(@Body() dto: CreatePacienteDto) {
    const paciente = await this.pacientesService.create(dto);
    if (!paciente) throw new InternalServerErrorException('Error al crear el paciente');
    return new SuccessResponseDto('Paciente creado exitosamente', paciente);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Paciente>>> {
    if (query.limit && query.limit > 100) query.limit = 100;
    const result = await this.pacientesService.findAll(query);
    if (!result) throw new InternalServerErrorException('Error al listar pacientes');
    return new SuccessResponseDto('Pacientes obtenidos exitosamente', result);
  }

  @Get('cedula/:cedula')
  async findByCedula(@Param('cedula') cedula: string) {
    const paciente = await this.pacientesService.findByCedula(cedula);
    if (!paciente) throw new NotFoundException('Paciente no encontrado');
    return new SuccessResponseDto('Paciente obtenido exitosamente', paciente);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const paciente = await this.pacientesService.findOne(id);
    if (!paciente) throw new NotFoundException('Paciente no encontrado');
    return new SuccessResponseDto('Paciente obtenido exitosamente', paciente);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePacienteDto) {
    const paciente = await this.pacientesService.update(id, dto);
    if (!paciente) throw new NotFoundException('Paciente no encontrado');
    return new SuccessResponseDto('Paciente actualizado exitosamente', paciente);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const paciente = await this.pacientesService.remove(id);
    if (!paciente) throw new NotFoundException('Paciente no encontrado');
    return new SuccessResponseDto('Paciente eliminado exitosamente', paciente);
  }

  @Get(':id/odontograma')
  async findOneConOdontograma(@Param('id') id: string) {
    const result = await this.pacientesService.findOneConOdontograma(id);
    if (!result) throw new NotFoundException('Paciente no encontrado');
    return new SuccessResponseDto('Paciente con odontograma obtenido', result);
  }
}
