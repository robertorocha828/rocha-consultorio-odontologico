import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { Pago } from './pago.entity';
import { Paciente } from '../pacientes/paciente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pago, Paciente])],
  controllers: [PagosController],
  providers: [PagosService],
  exports: [PagosService],
})
export class PagosModule {}