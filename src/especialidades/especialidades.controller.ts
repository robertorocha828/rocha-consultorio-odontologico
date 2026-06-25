import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EspecialidadesService } from './especialidades.service';
import { CreateEspecialidadDto } from './dto/create-especialidad.dto';
import { UpdateEspecialidadDto } from './dto/update-especialidad.dto';
import { Especialidad } from './especialidad.entity';

@ApiTags('Especialidades')
@ApiBearerAuth()
@Controller('especialidades')
export class EspecialidadesController {
  constructor(private readonly especialidadesService: EspecialidadesService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar una nueva especialidad odontológica' })
  @ApiResponse({ status: 201, type: Especialidad })
  create(@Body() dto: CreateEspecialidadDto): Promise<Especialidad> {
    return this.especialidadesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las especialidades' })
  findAll(): Promise<Especialidad[]> {
    return this.especialidadesService.findAll();
  }

  @Get('activas')
  @ApiOperation({ summary: 'Obtener solo las especialidades activas (para formularios)' })
  findAllActivas(): Promise<Especialidad[]> {
    return this.especialidadesService.findAllActivas();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una especialidad por ID' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Especialidad> {
    return this.especialidadesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos de una especialidad' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEspecialidadDto,
  ): Promise<Especialidad> {
    return this.especialidadesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar una especialidad del sistema' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.especialidadesService.remove(id);
  }
}