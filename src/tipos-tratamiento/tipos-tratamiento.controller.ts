import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { TiposTratamientoService } from './tipos-tratamiento.service';
import { CreateTipoTratamientoDto } from './dto/create-tipo-tratamiento.dto';
import { UpdateTipoTratamientoDto } from './dto/update-tipo-tratamiento.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('tipos-tratamiento')
export class TiposTratamientoController {
  constructor(private readonly tiposTratamientoService: TiposTratamientoService) {}

  @Roles('admin')
  @Post()
  create(@Body() dto: CreateTipoTratamientoDto) {
    return this.tiposTratamientoService.create(dto);
  }

  @Roles('admin')
  @Get()
  findAll() {
    return this.tiposTratamientoService.findAll();
  }

  @Roles('admin')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tiposTratamientoService.findOne(id);
  }

  @Roles('admin')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTipoTratamientoDto,
  ) {
    return this.tiposTratamientoService.update(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tiposTratamientoService.remove(id);
  }
}