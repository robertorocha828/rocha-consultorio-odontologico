import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultoriosController } from './consultorios.controller';
import { ConsultoriosService } from './consultorios.service';
import { Consultorio } from './consultorio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Consultorio])],
  controllers: [ConsultoriosController],
  providers: [ConsultoriosService],
  exports: [ConsultoriosService],
})
export class ConsultoriosModule {}