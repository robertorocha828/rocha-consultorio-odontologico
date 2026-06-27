import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { TratamientosService } from './tratamientos.service';
import { CreateTratamientoDto } from './dto/create-tratamiento.dto';
import { UpdateTratamientoDto } from './dto/update-tratamiento.dto';

@Controller('tratamientos')
export class TratamientosController {
  constructor(private readonly tratamientosService: TratamientosService) {}

  @Post()
  create(@Body() dto: CreateTratamientoDto) {
    return this.tratamientosService.create(dto);
  }

  @Get()
  findAll() {
    return this.tratamientosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tratamientosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTratamientoDto,
  ) {
    return this.tratamientosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tratamientosService.remove(id);
  }
}