import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, NotFoundException, InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    if (!user) throw new InternalServerErrorException('Error al crear el usuario');
    return new SuccessResponseDto('Usuario creado exitosamente', user);
  }

  @Get()
  async findAll(@Query() query: QueryDto) {
    if (query.limit && query.limit > 100) query.limit = 100;
    const result = await this.usersService.findAll(query);
    if (!result) throw new InternalServerErrorException('Error al listar usuarios');
    return new SuccessResponseDto('Usuarios obtenidos exitosamente', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return new SuccessResponseDto('Usuario obtenido exitosamente', user);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const user = await this.usersService.update(id, dto);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return new SuccessResponseDto('Usuario actualizado exitosamente', user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const user = await this.usersService.remove(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return new SuccessResponseDto('Usuario eliminado exitosamente', user);
  }
}
