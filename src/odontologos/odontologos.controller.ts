import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, NotFoundException, InternalServerErrorException,
} from '@nestjs/common';
import { OdontologosService } from './odontologos.service';
import { CreateOdontologoDto } from './dto/create-odontologo.dto';
import { UpdateOdontologoDto } from './dto/update-odontologo.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Odontologo } from './odontologo.entity';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('odontologos')
export class OdontologosController {
  constructor(private readonly odontologosService: OdontologosService) {}

  @Post()
  async create(@Body() dto: CreateOdontologoDto) {
    const odontologo = await this.odontologosService.create(dto);
    if (!odontologo) throw new InternalServerErrorException('Error al crear el odontólogo');
    return new SuccessResponseDto('Odontólogo creado exitosamente', odontologo);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Odontologo>>> {
    if (query.limit && query.limit > 100) query.limit = 100;
    const result = await this.odontologosService.findAll(query);
    if (!result) throw new InternalServerErrorException('Error al listar odontólogos');
    return new SuccessResponseDto('Odontólogos obtenidos exitosamente', result);
  }

  @Get('cedula/:cedula')
  async findByCedula(@Param('cedula') cedula: string) {
    const odontologo = await this.odontologosService.findByCedula(cedula);
    if (!odontologo) throw new NotFoundException('Odontólogo no encontrado');
    return new SuccessResponseDto('Odontólogo obtenido exitosamente', odontologo);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const odontologo = await this.odontologosService.findOne(id);
    if (!odontologo) throw new NotFoundException('Odontólogo no encontrado');
    return new SuccessResponseDto('Odontólogo obtenido exitosamente', odontologo);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateOdontologoDto) {
    const odontologo = await this.odontologosService.update(id, dto);
    if (!odontologo) throw new NotFoundException('Odontólogo no encontrado');
    return new SuccessResponseDto('Odontólogo actualizado exitosamente', odontologo);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const odontologo = await this.odontologosService.remove(id);
    if (!odontologo) throw new NotFoundException('Odontólogo no encontrado');
    return new SuccessResponseDto('Odontólogo eliminado exitosamente', odontologo);
  }
}