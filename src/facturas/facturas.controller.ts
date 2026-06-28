import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, NotFoundException, InternalServerErrorException,
} from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Factura } from './factura.entity';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('facturas')
export class FacturasController {
  constructor(private readonly facturasService: FacturasService) {}

  @Post()
  async create(@Body() dto: CreateFacturaDto) {
    const factura = await this.facturasService.create(dto);
    if (!factura) throw new InternalServerErrorException('Error al crear la factura');
    return new SuccessResponseDto('Factura creada exitosamente', factura);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Factura>>> {
    if (query.limit && query.limit > 100) query.limit = 100;
    const result = await this.facturasService.findAll(query);
    if (!result) throw new InternalServerErrorException('Error al listar facturas');
    return new SuccessResponseDto('Facturas obtenidas exitosamente', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const factura = await this.facturasService.findOne(id);
    if (!factura) throw new NotFoundException('Factura no encontrada');
    return new SuccessResponseDto('Factura obtenida exitosamente', factura);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateFacturaDto) {
    const factura = await this.facturasService.update(id, dto);
    if (!factura) throw new NotFoundException('Factura no encontrada');
    return new SuccessResponseDto('Factura actualizada exitosamente', factura);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const factura = await this.facturasService.remove(id);
    if (!factura) throw new NotFoundException('Factura no encontrada');
    return new SuccessResponseDto('Factura eliminada exitosamente', factura);
  }
}