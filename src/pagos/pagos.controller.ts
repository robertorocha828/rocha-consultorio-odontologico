import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, NotFoundException, InternalServerErrorException,
} from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Pago } from './pago.entity';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post()
  async create(@Body() dto: CreatePagoDto) {
    const pago = await this.pagosService.create(dto);
    if (!pago) throw new InternalServerErrorException('Error al crear el pago');
    return new SuccessResponseDto('Pago creado exitosamente', pago);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Pago>>> {
    if (query.limit && query.limit > 100) query.limit = 100;
    const result = await this.pagosService.findAll(query);
    if (!result) throw new InternalServerErrorException('Error al listar pagos');
    return new SuccessResponseDto('Pagos obtenidos exitosamente', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const pago = await this.pagosService.findOne(id);
    if (!pago) throw new NotFoundException('Pago no encontrado');
    return new SuccessResponseDto('Pago obtenido exitosamente', pago);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePagoDto) {
    const pago = await this.pagosService.update(id, dto);
    if (!pago) throw new NotFoundException('Pago no encontrado');
    return new SuccessResponseDto('Pago actualizado exitosamente', pago);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const pago = await this.pagosService.remove(id);
    if (!pago) throw new NotFoundException('Pago no encontrado');
    return new SuccessResponseDto('Pago eliminado exitosamente', pago);
  }
}