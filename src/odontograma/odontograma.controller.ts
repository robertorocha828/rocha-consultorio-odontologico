import {
  Controller, Get, Post, Put, Delete, Patch,
  Param, Body, Query, NotFoundException, InternalServerErrorException,
} from '@nestjs/common';
import { OdontogramaService } from './odontograma.service';
import { CreateOdontogramaDto } from './dto/create-odontograma.dto';
import { UpdateDienteDto } from './dto/update-diente.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('odontograma')
export class OdontogramaController {
  constructor(private readonly odontogramaService: OdontogramaService) {}

  @Post()
  async create(@Body() dto: CreateOdontogramaDto) {
    const result = await this.odontogramaService.create(dto);
    if (!result) throw new InternalServerErrorException('Error al crear el odontograma');
    return new SuccessResponseDto('Odontograma creado exitosamente', result);
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<SuccessResponseDto<any>> {
    const result = await this.odontogramaService.findAll({ page: +page, limit: +limit });
    if (!result) throw new InternalServerErrorException('Error al listar odontogramas');
    return new SuccessResponseDto('Odontogramas obtenidos exitosamente', result);
  }

  @Get('paciente/:pacienteId')
  async findByPaciente(
    @Param('pacienteId') pacienteId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const result = await this.odontogramaService.findByPaciente(pacienteId, { page: +page, limit: +limit });
    if (!result) throw new InternalServerErrorException('Error al buscar odontogramas del paciente');
    return new SuccessResponseDto('Odontogramas del paciente obtenidos', result);
  }

  @Get('paciente/:pacienteId/ultimo')
  async findLatest(@Param('pacienteId') pacienteId: string) {
    const result = await this.odontogramaService.findLatestByPaciente(pacienteId);
    if (!result) throw new NotFoundException('No se encontró un odontograma para este paciente');
    return new SuccessResponseDto('Último odontograma obtenido', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.odontogramaService.findOne(id);
    if (!result) throw new NotFoundException('Odontograma no encontrado');
    return new SuccessResponseDto('Odontograma obtenido exitosamente', result);
  }

  @Patch(':id/diente')
  async updateDiente(@Param('id') id: string, @Body() dto: UpdateDienteDto) {
    const result = await this.odontogramaService.updateDiente(id, dto);
    if (!result) throw new NotFoundException('Odontograma o diente no encontrado');
    return new SuccessResponseDto('Diente actualizado exitosamente', result);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.odontogramaService.remove(id);
    if (!result) throw new NotFoundException('Odontograma no encontrado');
    return new SuccessResponseDto('Odontograma eliminado exitosamente', result);
  }
}
