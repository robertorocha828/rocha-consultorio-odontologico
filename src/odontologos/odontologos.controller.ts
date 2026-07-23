import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, NotFoundException, InternalServerErrorException,
} from '@nestjs/common';
import { OdontologosService } from './odontologos.service';
import { CreateOdontologoDto } from './dto/create-odontologo.dto';
import { UpdateOdontologoDto } from './dto/update-odontologo.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Odontologo } from './odontologo.entity';
import { SuccessResponseDto } from '../common/dto/response.dto';
import { QueryDto } from '../common/dto/query.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('odontologos')
export class OdontologosController {
  constructor(private readonly odontologosService: OdontologosService) {}

  @Roles('admin')
  @Post()
  async create(@Body() dto: CreateOdontologoDto) {
    const odontologo = await this.odontologosService.create(dto);
    if (!odontologo) throw new InternalServerErrorException('Error al crear el odontólogo');
    return new SuccessResponseDto('Odontólogo creado exitosamente', odontologo);
  }

  // Sin @Roles(): los pacientes autenticados lo necesitan para el selector
  // de odontólogo al agendar una cita.
  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Odontologo>>> {
    if (query.limit && query.limit > 100) query.limit = 100;
    const result = await this.odontologosService.findAll(query);
    if (!result) throw new InternalServerErrorException('Error al listar odontólogos');
    return new SuccessResponseDto('Odontólogos obtenidos exitosamente', result);
  }

  // Usuarios con rol "doctor" que todavía no tienen una ficha de odontólogo
  // vinculada. Debe ir antes de ':id' para que no lo intente matchear como id.
  @Roles('admin')
  @Get('usuarios-disponibles')
  async findUsuariosDisponibles() {
    const usuarios = await this.odontologosService.findUsuariosDisponibles();
    return new SuccessResponseDto('Usuarios disponibles obtenidos exitosamente', usuarios);
  }

  @Get('cedula/:cedula')
  async findByCedula(@Param('cedula') cedula: string) {
    const odontologo = await this.odontologosService.findByCedula(cedula);
    if (!odontologo) throw new NotFoundException('Odontólogo no encontrado');
    return new SuccessResponseDto('Odontólogo obtenido exitosamente', odontologo);
  }

  // Sin @Roles(): el propio doctor lo usa para encontrar su ficha.
  @Get('usuario/:userId')
  async findByUsuario(@Param('userId') userId: string) {
    const odontologo = await this.odontologosService.findByUsuario(userId);
    if (!odontologo) throw new NotFoundException('Odontólogo no encontrado');
    return new SuccessResponseDto('Odontólogo obtenido exitosamente', odontologo);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const odontologo = await this.odontologosService.findOne(id);
    if (!odontologo) throw new NotFoundException('Odontólogo no encontrado');
    return new SuccessResponseDto('Odontólogo obtenido exitosamente', odontologo);
  }

  @Roles('admin')
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateOdontologoDto) {
    const odontologo = await this.odontologosService.update(id, dto);
    if (!odontologo) throw new NotFoundException('Odontólogo no encontrado');
    return new SuccessResponseDto('Odontólogo actualizado exitosamente', odontologo);
  }

  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const odontologo = await this.odontologosService.remove(id);
    if (!odontologo) throw new NotFoundException('Odontólogo no encontrado');
    return new SuccessResponseDto('Odontólogo eliminado exitosamente', odontologo);
  }
}