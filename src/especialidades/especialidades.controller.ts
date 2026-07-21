import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { EspecialidadesService } from './especialidades.service';
import { CreateEspecialidadDto } from './dto/create-especialidad.dto';
import { UpdateEspecialidadDto } from './dto/update-especialidad.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('especialidades')
export class EspecialidadesController {
  constructor(private readonly especialidadesService: EspecialidadesService) {}

  @Roles('admin')
  @Post()
  create(@Body() dto: CreateEspecialidadDto) {
    return this.especialidadesService.create(dto);
  }

  // Públicas: la página de especialidades del sitio se ve sin iniciar sesión.
  @Public()
  @Get()
  findAll() {
    return this.especialidadesService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.especialidadesService.findOne(id);
  }

  @Roles('admin')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEspecialidadDto,
  ) {
    return this.especialidadesService.update(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.especialidadesService.remove(id);
  }
}