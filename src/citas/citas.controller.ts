import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, NotFoundException, InternalServerErrorException,
} from '@nestjs/common';
import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Cita } from './cita.entity';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('citas')
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @Post()
  async create(@Body() dto: CreateCitaDto) {
    const cita = await this.citasService.create(dto);
    if (!cita) throw new InternalServerErrorException('Error al crear la cita');
    return new SuccessResponseDto('Cita creada exitosamente', cita);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Cita>>> {
    if (query.limit && query.limit > 100) query.limit = 100;
    const result = await this.citasService.findAll(query);
    if (!result) throw new InternalServerErrorException('Error al listar citas');
    return new SuccessResponseDto('Citas obtenidas exitosamente', result);
  }

  @Get('paciente/:pacienteId')
  async findByPaciente(
    @Param('pacienteId') pacienteId: string,
    @Query() query: QueryDto,
  ) {
    const result = await this.citasService.findByPaciente(pacienteId, query);
    if (!result) throw new InternalServerErrorException('Error al buscar citas del paciente');
    return new SuccessResponseDto('Citas del paciente obtenidas', result);
  }

  @Get('odontologo/:odontologoId')
  async findByOdontologo(
    @Param('odontologoId') odontologoId: string,
    @Query() query: QueryDto,
  ) {
    const result = await this.citasService.findByOdontologo(odontologoId, query);
    if (!result) throw new InternalServerErrorException('Error al buscar citas del odontólogo');
    return new SuccessResponseDto('Citas del odontólogo obtenidas', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const cita = await this.citasService.findOne(id);
    if (!cita) throw new NotFoundException('Cita no encontrada');
    return new SuccessResponseDto('Cita obtenida exitosamente', cita);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCitaDto) {
    const cita = await this.citasService.update(id, dto);
    if (!cita) throw new NotFoundException('Cita no encontrada');
    return new SuccessResponseDto('Cita actualizada exitosamente', cita);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const cita = await this.citasService.remove(id);
    if (!cita) throw new NotFoundException('Cita no encontrada');
    return new SuccessResponseDto('Cita eliminada exitosamente', cita);
  }
}
