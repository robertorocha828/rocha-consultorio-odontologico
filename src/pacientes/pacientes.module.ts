import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacientesController } from './pacientes.controller';
import { PacientesService } from './pacientes.service';
import { Paciente } from './paciente.entity';
import { OdontogramaModule } from 'src/odontograma/odontograma.module';

@Module({
  imports: [TypeOrmModule.forFeature([Paciente]),OdontogramaModule,],
  controllers: [PacientesController],
  providers: [PacientesService],
  exports: [PacientesService], // exportar para usarlo desde CitasModule
})
export class PacientesModule {}
