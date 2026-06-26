import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, NotFoundException, InternalServerErrorException,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(@Body() dto: CreateRolDto) {
    const rol = await this.rolesService.create(dto);
    if (!rol) throw new InternalServerErrorException('Error al crear el rol');
    return new SuccessResponseDto('Rol creado exitosamente', rol);
  }

  @Get()
  async findAll(@Query() query: QueryDto) {
    if (query.limit && query.limit > 100) query.limit = 100;
    const result = await this.rolesService.findAll(query);
    if (!result) throw new InternalServerErrorException('Error al listar roles');
    return new SuccessResponseDto('Roles obtenidos exitosamente', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const rol = await this.rolesService.findOne(id);
    if (!rol) throw new NotFoundException('Rol no encontrado');
    return new SuccessResponseDto('Rol obtenido exitosamente', rol);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateRolDto) {
    const rol = await this.rolesService.update(id, dto);
    if (!rol) throw new NotFoundException('Rol no encontrado');
    return new SuccessResponseDto('Rol actualizado exitosamente', rol);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const rol = await this.rolesService.remove(id);
    if (!rol) throw new NotFoundException('Rol no encontrado');
    return new SuccessResponseDto('Rol eliminado exitosamente', rol);
  }
}
