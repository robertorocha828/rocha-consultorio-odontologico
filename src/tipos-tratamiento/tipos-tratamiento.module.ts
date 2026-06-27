import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoTratamiento } from './tipo-tratamiento.entity';
import { TiposTratamientoController } from './tipos-tratamiento.controller';
import { TiposTratamientoService } from './tipos-tratamiento.service';

@Module({
  imports: [TypeOrmModule.forFeature([TipoTratamiento])],
  controllers: [TiposTratamientoController],
  providers: [TiposTratamientoService],
  exports: [TiposTratamientoService],
})
export class TiposTratamientoModule {}