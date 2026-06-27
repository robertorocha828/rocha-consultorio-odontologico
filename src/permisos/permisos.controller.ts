import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, NotFoundException, InternalServerErrorException,
} from '@nestjs/common';
import { PermisosService } from './permisos.service';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { UpdatePermisoDto } from './dto/update-permiso.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('permisos')
export class PermisosController {
  constructor(private readonly permisosService: PermisosService) {}

  @Post()
  async create(@Body() dto: CreatePermisoDto) {
    const permiso = await this.permisosService.create(dto);
    if (!permiso) throw new InternalServerErrorException('Error al crear el permiso');
    return new SuccessResponseDto('Permiso creado exitosamente', permiso);
  }

  @Get()
  async findAll(@Query() query: QueryDto) {
    if (query.limit && query.limit > 100) query.limit = 100;
    const result = await this.permisosService.findAll(query);
    if (!result) throw new InternalServerErrorException('Error al listar permisos');
    return new SuccessResponseDto('Permisos obtenidos exitosamente', result);
  }

  @Get('rol/:rolId')
  async findByRol(@Param('rolId') rolId: string) {
    const result = await this.permisosService.findByRol(rolId);
    return new SuccessResponseDto('Permisos del rol obtenidos', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const permiso = await this.permisosService.findOne(id);
    if (!permiso) throw new NotFoundException('Permiso no encontrado');
    return new SuccessResponseDto('Permiso obtenido exitosamente', permiso);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePermisoDto) {
    const permiso = await this.permisosService.update(id, dto);
    if (!permiso) throw new NotFoundException('Permiso no encontrado');
    return new SuccessResponseDto('Permiso actualizado exitosamente', permiso);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const permiso = await this.permisosService.remove(id);
    if (!permiso) throw new NotFoundException('Permiso no encontrado');
    return new SuccessResponseDto('Permiso eliminado exitosamente', permiso);
  }
}
