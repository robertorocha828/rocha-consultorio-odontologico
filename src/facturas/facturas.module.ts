import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacturasService } from './facturas.service';
import { FacturasController } from './facturas.controller';
import { Factura } from './factura.entity';
import { Paciente } from '../pacientes/paciente.entity';
import { Pago } from '../pagos/pago.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Factura, Paciente, Pago])],
  controllers: [FacturasController],
  providers: [FacturasService],
  exports: [FacturasService],
})
export class FacturasModule {}