import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { TiposTratamientoService } from './tipos-tratamiento.service';
import { CreateTipoTratamientoDto } from './dto/create-tipo-tratamiento.dto';
import { UpdateTipoTratamientoDto } from './dto/update-tipo-tratamiento.dto';

@Controller('tipos-tratamiento')
export class TiposTratamientoController {
  constructor(private readonly tiposTratamientoService: TiposTratamientoService) {}

  @Post()
  create(@Body() dto: CreateTipoTratamientoDto) {
    return this.tiposTratamientoService.create(dto);
  }

  @Get()
  findAll() {
    return this.tiposTratamientoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tiposTratamientoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTipoTratamientoDto,
  ) {
    return this.tiposTratamientoService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tiposTratamientoService.remove(id);
  }
}