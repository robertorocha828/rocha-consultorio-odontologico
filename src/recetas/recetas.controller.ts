import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RecetasService } from './recetas.service';
import { CreateRecetaDto } from './dto/create-receta.dto';
import { UpdateRecetaDto } from './dto/update-receta.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('recetas')
export class RecetasController {
  constructor(private readonly recetasService: RecetasService) {}

  @Roles('admin', 'doctor')
  @Post()
  create(@Body() dto: CreateRecetaDto) {
    return this.recetasService.create(dto);
  }

  @Roles('admin', 'doctor')
  @Get()
  findAll() {
    return this.recetasService.findAll();
  }

  @Roles('admin', 'doctor')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recetasService.findOne(id);
  }

  @Roles('admin', 'doctor')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRecetaDto,
  ) {
    return this.recetasService.update(id, dto);
  }

  @Roles('admin', 'doctor')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recetasService.remove(id);
  }
}